import React, { Fragment, useState, useContext, useEffect } from 'react';
import usePoTable from '../../../hooks/usePoTable';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import DateInput from '../../../components/ui/inputs/DateInput/DateInput';
import ActionButton from '../../../components/ui/ActionButton';
import TableRow from '../../../components/table/po/TableRow';

function ViewPoMaster() {
  const { changePage, setContentSpinner, parameterValue } =
    useContext(AppContext);

  const [poList, setPoList] = useState([]);
  const [itemsTable, setItemsTable] = useState({ rawItems: [] });

  useEffect(() => {
    getItemsTable();
    getPoList();
  }, []);

  useEffect(() => {
    console.log(parameterValue);
    if (parameterValue) {
      poNumberRef.ref.current.setValue(parameterValue);
      fillSelectedPoDetails(parameterValue);
    }
  }, [parameterValue]);

  async function getItemsTable() {
    const items = await itemMasterModule.getItems();
    const itemsTable = {
      rawItems: items,
      drawingNoMapping: {},
      descriptionMapping: {},
    };
    for (let i = 0; i < items.length; i++) {
      itemsTable.drawingNoMapping[items[i].drawing_no] = items[i].description;
      itemsTable.descriptionMapping[items[i].description] = items[i].drawing_no;
    }
    setItemsTable(itemsTable);
  }

  async function fillSelectedPoDetails(poNumber) {
    const poDetails = await poMasterModule.getPoDetails(poNumber);
    customerNameRef.ref.current.setValue(poDetails.customerName);
    poDateRef.ref.current.setValue(poDetails.poDate);
    const tableRows = [];
    for (let i = 0; i < poDetails.poItems.length; i++) {
      const {
        drawing_no: drawingNo,
        description,
        quantity,
      } = poDetails.poItems[i];
      tableRows.push({ index: i, drawingNo, description, quantity });
    }
    dispatchTableState({ type: 'SET_ROWS', payload: tableRows });
  }

  async function getPoList() {
    const poList = await poMasterModule.getPoList();
    setPoList(poList.map((poItem) => poItem.po_no));
  }

  const [
    [poNumberRef, customerNameRef, poDateRef],
    dispatchNavigationShortcut,
  ] = useNavigationShortcuts({
    fieldList: [
      {
        name: 'poNumber',
        focusable: true,
      },
      {
        name: 'customerName',
        focusable: true,
      },
      {
        name: 'poDate',
        focusable: true,
      },
    ],
    defaultFocusedFieldName: 'poNumber',
  });

  const {
    tableState,
    addRow,
    lastActionHandler,
    setDrawingNo,
    setDescription,
    setQuantity,
    deleteRow,
    setFocusedRow,
    resetTable,
    dispatchTableState,
  } = usePoTable(itemsTable);

  return (
    <Fragment>
      <div className='flex flex-col'>
        <div className='flex justify-center gap-10'>
          <FormField
            component={SuggestionInput}
            label='PO Number'
            componentProperties={{
              placeholder: 'PO Number',
              name: 'poNumber',
              suggestions: poList,
              strict: true,
              extendChangeHandler: () => {
                setTimeout(() => {
                  const { value, isValid } = poNumberRef.ref.current;
                  if (isValid) {
                    fillSelectedPoDetails(value);
                  }
                }, 100);
              },
              extendFillHandler: (value) => {
                fillSelectedPoDetails(value);
              },
            }}
            ref={poNumberRef.ref}
          />
        </div>
        <div className='flex justify-center gap-10'>
          <FormField
            component={TextInput}
            label='Customer Name'
            componentProperties={{
              name: 'customerName',
              value: '',
              disabled: true,
            }}
            ref={customerNameRef.ref}
          />
          <FormField
            component={DateInput}
            label='PO Date'
            componentProperties={{
              name: 'poDate',
              value: '',
              disabled: true,
            }}
            ref={poDateRef.ref}
          />
        </div>
      </div>
      <div className='w-full mx-auto mt-10 border border-black table border-collapse'>
        <div className='table-header-group text-center font-bold text-lg'>
          <div className='table-row'>
            <div className='table-cell py-2 border border-black w-1/12'>
              Sr. No.
            </div>
            <div className='table-cell py-2 border border-black w-3/12'>
              Drawing No
            </div>
            <div className='table-cell py-2 border border-black w-5/12'>
              Description
            </div>
            <div className='table-cell py-2 border border-black w-2/12'>
              Quantity
            </div>
            <div className='table-cell py-2 border border-black w-1/12'></div>
          </div>
        </div>
        <div className='table-row-group'>
          {tableState.rows.map((tableRow) => {
            return (
              <TableRow
                key={tableRow.index}
                rowData={tableRow}
                disableDelete={true}
                disabled={true}
              />
            );
          })}
        </div>
      </div>

      <ActionButton
        className='block mx-auto my-10'
        onClick={(e) => {
          changePage(pages.HOME);
        }}
      >
        Back
      </ActionButton>
    </Fragment>
  );
}

export default ViewPoMaster;
