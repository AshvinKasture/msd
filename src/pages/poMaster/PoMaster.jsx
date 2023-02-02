import React, { Fragment, useState, useEffect, useReducer } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import FormField from '../../components/ui/inputs/FormField/FormField';
import TextInput from '../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../components/ui/inputs/SuggestionInput/SuggestionInput';
import TableRow from '../../components/table/po/TableRow';
import ActionButton from '../../components/ui/ActionButton';
import useNavigationShortcuts from '../../hooks/useNavigationShortcuts';
import AppContext from '../../store/appContext';

function PoMaster({ type }) {
  const { setContentSpinner } = useContent(AppContext);

  const [customerList, setCustomerList] = useState([]);
  const [itemsTable, setItemsTable] = useState({ rawItems: [] });

  const [[poNumberRef, customerNameRef], dispatchNavigationShortcut] =
    useNavigationShortcuts({
      sequence: ['poNumber', 'customerName'],
      defaultFocused: 'poNumber',
      lastAction: () => {},
    });

  useEffect(() => {
    function initialElementFocus() {
      poNumberRef.ref.current.focus();
    }
    async function getCustomerList() {
      setCustomerList(
        (await customerMasterModule.getCustomers()).map(
          (customerItem) => customerItem.customer_name
        )
      );
    }
    async function getItems() {
      const items = await itemMasterModule.getItems();
      const itemsTable = {
        rawItems: items,
        drawingNoMapping: {},
        descriptionMapping: {},
      };
      for (let i = 0; i < items.length; i++) {
        itemsTable.drawingNoMapping[items[i].drg_no] = items[i].description;
        itemsTable.descriptionMapping[items[i].description] = items[i].drg_no;
      }
      setItemsTable(itemsTable);
    }
    initialElementFocus();
    getCustomerList();
    getItems();
  }, []);

  function resetPage() {
    poNumberRef.ref.current.reset();
    customerNameRef.ref.current.reset();
    resetTable();
  }

  const [tableState, dispatchTableState] = useReducer(
    (state, { type, payload }) => {
      let index, drawingNo, description, newRowState, newRowData, quantity;
      switch (type) {
        case 'ADD_ROW':
          return [
            ...state,
            {
              index: state.length,
              drawingNo: '',
              description: '',
              quantity: '',
            },
          ];
        case 'SET_DRAWING_NO':
          ({ index, drawingNo } = payload);
          newRowState = [...state];
          description = itemsTable.drawingNoMapping[drawingNo] || null;
          newRowData = {
            ...state[index],
            drawingNo: description ? drawingNo : '',
            description: description ? description : '',
          };
          newRowState[index] = newRowData;
          return newRowState;
        case 'SET_DESCRIPTION':
          ({ index, description } = payload);
          newRowState = [...state];
          drawingNo = itemsTable.descriptionMapping[description] || null;
          newRowData = {
            ...state[index],
            description: drawingNo ? description : '',
            drawingNo: drawingNo ? drawingNo : '',
          };
          newRowState[index] = newRowData;
          return newRowState;
        case 'SET_QUANTITY':
          ({ index, quantity } = payload);
          newRowState = [...state];
          newRowData = {
            ...state[index],
            quantity,
          };
          newRowState[index] = newRowData;
          return newRowState;
        case 'RESET':
          return [
            {
              index: 0,
              drawingNo: '',
              description: '',
              quantity: '',
            },
          ];
        default:
          return state;
      }
    },
    [
      {
        index: 0,
        drawingNo: '',
        description: '',
        quantity: '',
      },
    ]
  );

  function addRow() {
    dispatchTableState({ type: 'ADD_ROW' });
  }

  function setDrawingNo(index, drawingNo) {
    dispatchTableState({
      type: 'SET_DRAWING_NO',
      payload: { index, drawingNo },
    });
  }

  function setDescription(index, description) {
    dispatchTableState({
      type: 'SET_DESCRIPTION',
      payload: { index, description },
    });
  }

  function setQuantity(index, quantity) {
    dispatchTableState({ type: 'SET_QUANTITY', payload: { index, quantity } });
  }

  function resetTable() {
    dispatchTableState({ type: 'RESET' });
  }

  const modeContent = {
    CREATE: (
      <Fragment>
        <div className='flex justify-center gap-10'>
          <FormField
            component={TextInput}
            label='PO Number'
            componentProperties={{
              placeholder: 'PO Number',
              name: 'poNumber',
              dispatchNavigationShortcut,
            }}
            ref={poNumberRef.ref}
          />
          <FormField
            component={SuggestionInput}
            label='Customer Name'
            componentProperties={{
              placeholder: 'Customer Name',
              name: 'customerName',
              suggestions: customerList,
              strict: true,
              dispatchNavigationShortcut,
            }}
            ref={customerNameRef.ref}
          />
        </div>
        <div className='w-full mx-auto mt-10 border border-black table border-collapse'>
          <div className='table-header-group text-center font-bold text-lg'>
            <div className='table-row'>
              <div className='table-cell py-2 border border-black'>
                Drawing No
              </div>
              <div className='table-cell py-2 border border-black w-3/5'>
                Description
              </div>
              <div className='table-cell py-2 border border-black'>
                Quantity
              </div>
            </div>
          </div>
          <div className='table-row-group'>
            {tableState.map((tableRow) => {
              return (
                <TableRow
                  key={tableRow.index}
                  rowData={tableRow}
                  addRow={addRow}
                  setDrawingNo={setDrawingNo}
                  setDescription={setDescription}
                  setQuantity={setQuantity}
                  itemsTable={itemsTable}
                  focusFirstElement={tableRow.index === tableState.length - 1}
                />
              );
            })}
          </div>
        </div>
        <ActionButton
          className='block bg-white text-black border hover:bg-black hover:text-white border-black mt-5'
          onClick={addRow}
        >
          Add Row
        </ActionButton>
        <ActionButton className='block mx-auto my-10' onClick={submitHandler}>
          Save
        </ActionButton>
      </Fragment>
    ),
  };

  function isRowValid({ drawingNo, description, quantity }) {
    return (
      itemsTable.rawItems.map((item) => item.drg_no).includes(drawingNo) &&
      itemsTable.drawingNoMapping[drawingNo] === description &&
      +quantity > 0
    );
  }

  async function submitHandler() {
    setContentSpinner(true);
    const poNumber = poNumberRef.ref.current.value;
    const customerName = customerNameRef.ref.current.value;
    const validRows = [];
    for (let i = 0; i < tableState.length; i++) {
      const row = tableState[i];
      if (isRowValid(row)) {
        validRows.push(row);
      }
    }
    const poData = { poNumber, customerName, itemRows: validRows };
    await poMasterModule.createPo(poData);
    resetPage();
    setContentSpinner(false);
  }

  return (
    <Fragment>
      <TitleBar>PO Master</TitleBar>
      <div className='w-3/4 mx-auto mt-24'>{modeContent[type]}</div>
    </Fragment>
  );
}

export default PoMaster;
