import React, {
  Fragment,
  useState,
  useEffect,
  useReducer,
  useContext,
} from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import FormField from '../../components/ui/inputs/FormField/FormField';
import TextInput from '../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../components/ui/inputs/SuggestionInput/SuggestionInput';
import DateInput from '../../components/ui/inputs/DateInput/DateInput';
import SelectInput from '../../components/ui/inputs/SelectInput/SelectInput';
import TableRow from '../../components/table/po/TableRow';
import ActionButton from '../../components/ui/ActionButton';
import useNavigationShortcuts from '../../hooks/useNavigationShortcuts';
import AppContext from '../../store/appContext';

function DeliveryChallan({ type }) {
  const { changePage, setContentSpinner } = useContext(AppContext);
  const [nextChallanNo, setNextChallanNo] = useState('');
  const [customerList, setCustomerList] = useState([]);
  const [poList, setPoList] = useState([]);
  const [poDetails, setPoDetails] = useState();
  const [challanId, setChallanId] = useState(null);

  const [{ poNumber, customerName, itemsTable }, dispatchState] = useReducer(
    (state, { type, payload }) => {
      //   console.log(type, payload);
      switch (type) {
        case 'SET_PO_DETAILS':
          const { poNumber, customerName, poItems: items } = payload;
          //   console.log(poNumber, customerName, items);

          const itemsTable = {
            rawItems: items,
            drawingNoMapping: {},
            descriptionMapping: {},
            quantityMapping: {},
          };
          for (let i = 0; i < items.length; i++) {
            itemsTable.drawingNoMapping[items[i].drawing_no] =
              items[i].description;
            itemsTable.descriptionMapping[items[i].description] =
              items[i].drawing_no;
            itemsTable.quantityMapping[items[i].drawing_no] =
              items[i].quantity - items[i].quantity_completed;
          }
          console.log({ poNumber, customerName, itemsTable });
          return { poNumber, customerName, itemsTable };
        default:
          console.log('No case matched');
          return { ...state };
      }
    },
    {
      poNumber: '',
      customerName: '',
      itemsTable: {
        rawItems: [],
        drawingNoMapping: {},
        descriptionMapping: {},
      },
    }
  );

  const [
    [challanNoRef, poNumberRef, customerNameRef, challanDateRef],
    dispatchNavigationShortcut,
    _,
  ] = useNavigationShortcuts({
    sequence: ['challanNo', 'poNumber', 'customerName', 'challanDate'],
    defaultFocused: 'poNumber',
    lastAction: () => {},
  });

  useEffect(() => {
    resetPage();
    // initialElementFocus();
    switch (type) {
      case 'CREATE':
        getNextChallanNo();
        getPoList();
        getCustomerList();
        break;
      case 'VIEW':
        // getPoList();
        getChallanList();
        break;
      case 'EDIT':
        getPoList();
        getCustomerList();
        getItems();
    }
  }, [type]);

  function initialElementFocus() {
    poNumberRef.ref.current.focus();
  }

  async function getNextChallanNo() {
    const nextChallanNo = await deliveryChallanModule.getNextChallanNo();
    setNextChallanNo(nextChallanNo);
  }

  async function getCustomerList() {
    setCustomerList(
      (await customerMasterModule.getCustomers()).map(
        (customerItem) => customerItem.customer_name
      )
    );
  }

  async function getItems() {
    // const items = await itemMasterModule.getItems();
    console.log(poDetails);
    const items = poDetails.poItems;
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

  async function getChallanList() {
    const challanList = await deliveryChallanModule.getChallanList();
    console.log(challanList);
  }

  async function getPoList() {
    const poList = await poMasterModule.getPoList();
    setPoList(poList.map((poItem) => poItem.po_no));
  }

  function resetPage() {
    poNumberRef.ref.current.reset();
    customerNameRef.ref.current.reset();
    resetTable();
  }

  async function getPoDetails(poNumber) {
    const poDetails = await poMasterModule.getPoDetails(poNumber);
    customerNameRef.ref.current.setValue(poDetails.customerName);
    dispatchState({ type: 'SET_PO_DETAILS', payload: poDetails });
  }

  async function getChallanDetails(poNumber) {
    const poDetails = await deliveryChallanModule.getAllChallans(poNumber);
    console.log(poDetails);
    setPoDetails(poDetails);
  }

  function fillChallanItems(challanId) {
    setChallanId(challanId);
    const challanItems = poDetails.challans.filter(
      (challan) => challan.challan_id == challanId
    )[0].items;

    const tableRows = [];
    for (let i = 0; i < challanItems.length; i++) {
      const { drawing_no: drawingNo, description, quantity } = challanItems[i];
      tableRows.push({ index: i, drawingNo, description, quantity });
    }
    dispatchTableState({ type: 'SET_ROWS', payload: tableRows });
  }

  // const [focusedRowIndex, setFocusedRowIndex] = useState(-1);

  const [tableState, dispatchTableState] = useReducer(
    (state, { type, payload }) => {
      let index,
        drawingNo,
        description,
        newRowState,
        newRowData,
        quantity,
        quantityAllowed;
      // console.log({ type, payload });
      switch (type) {
        case 'ADD_ROW':
          return {
            focusedIndex: state.lastRowIndex + 1,
            lastRowIndex: state.lastRowIndex + 1,
            rows: [
              ...state.rows,
              {
                index: state.rows.length,
                drawingNo: '',
                description: '',
                quantity: '',
              },
            ],
          };
        case 'LAST_ACTION':
          if (payload === state.rows.length - 1) {
            // console.log('adding row');
            return {
              focusedIndex: state.lastRowIndex + 1,
              lastRowIndex: state.lastRowIndex + 1,
              rows: [
                ...state.rows,
                {
                  index: state.rows.length,
                  drawingNo: '',
                  description: '',
                  quantity: '',
                },
              ],
            };
          } else if (payload < state.rows.length - 1) {
            // console.log('reducer focusing next row');
            return { ...state, focusedIndex: payload + 1 };
          }
        case 'SET_DRAWING_NO':
          ({ index, drawingNo } = payload);
          if (
            index >= state.rows.length ||
            drawingNo === state.rows[index].drawingNo
          ) {
            return state;
          }
          console.log({
            old: state.rows[index].drawingNo,
            new: drawingNo,
            comparison: drawingNo === state.rows[index].drawingNo,
          });
          newRowState = [...state.rows];
          description = itemsTable.drawingNoMapping[drawingNo] || null;
          quantityAllowed = itemsTable.quantityMapping[drawingNo] || null;
          newRowData = {
            ...state.rows[index],
            drawingNo: description ? drawingNo : '',
            description: description ? description : '',
            quantityAllowed: quantityAllowed ? quantityAllowed : '',
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_DESCRIPTION':
          ({ index, description } = payload);
          if (
            index >= state.rows.length ||
            description === state.rows[index].description
          ) {
            return state;
          }
          newRowState = [...state.rows];
          drawingNo = itemsTable.descriptionMapping[description] || null;
          quantityAllowed = itemsTable.quantityMapping[drawingNo] || null;
          newRowData = {
            ...state.rows[index],
            description: drawingNo ? description : '',
            drawingNo: drawingNo ? drawingNo : '',
            quantityAllowed,
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_QUANTITY':
          ({ index, quantity } = payload);
          newRowState = [...state.rows];
          newRowData = {
            ...state.rows[index],
            quantity,
          };
          newRowState[index] = newRowData;
          return { ...state, rows: newRowState };
        case 'SET_ROWS':
          return {
            focusedIndex: -1,
            lastRowIndex: payload.length - 1,
            rows: payload,
          };
        case 'DELETE_ROW':
          newRowState = [];
          for (let i = 0; i < state.rows.length; i++) {
            if (i < payload) {
              newRowState.push(state.rows[i]);
            } else if (i > payload) {
              newRowState.push({
                ...state.rows[i],
                index: state.rows[i].index - 1,
              });
            } else {
              continue;
            }
          }
          // console.log(newRowState);
          return {
            ...state,
            lastRowIndex: state.lastRowIndex - 1,
            rows: newRowState,
          };
        case 'RESET':
          return {
            focusedIndex: -1,
            lastRowIndex: 0,
            rows: [
              {
                index: 0,
                drawingNo: '',
                description: '',
                quantity: '',
              },
            ],
          };
        default:
          return state;
      }
    },
    {
      focusedIndex: -1,
      lastRowIndex: 0,
      rows: [
        {
          index: 0,
          drawingNo: '',
          description: '',
          quantity: '',
        },
      ],
    }
  );

  function addRow(index) {
    dispatchTableState({ type: 'ADD_ROW' });
  }

  function lastActionHandler(index) {
    dispatchTableState({ type: 'LAST_ACTION', payload: index });
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

  function deleteRow(index) {
    dispatchTableState({ type: 'DELETE_ROW', payload: index });
  }

  function resetTable() {
    dispatchTableState({ type: 'RESET' });
  }

  const modeContent = {
    CREATE: (
      <Fragment>
        <div className='flex flex-col'>
          <div className='flex justify-center gap-10'>
            <FormField
              component={TextInput}
              label='Challan No'
              componentProperties={{ value: nextChallanNo, disabled: true }}
              ref={challanNoRef.ref}
            />
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
                      getPoDetails(value);
                    }
                  }, 100);
                },
                extendFillHandler: (value) => {
                  getPoDetails(value);
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
              label='Challan Date'
              componentProperties={{
                name: 'challanDate',
                value: new Date(),
              }}
              ref={challanDateRef.ref}
            />
          </div>
        </div>
        <div className='w-full mx-auto mt-10 border border-black table border-collapse'>
          <div className='table-header-group text-center font-bold text-lg'>
            <div className='table-row'>
              <div className='table-cell py-2 border border-black w-1/12'>
                Sr. No.
              </div>
              <div className='table-cell py-2 border border-black w-2/12'>
                Drawing No
              </div>
              <div className='table-cell py-2 border border-black w-5/12'>
                Description
              </div>
              <div className='table-cell py-2 border border-black w-3/12'>
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
                  lastActionHandler={lastActionHandler}
                  setDrawingNo={setDrawingNo}
                  setDescription={setDescription}
                  setQuantity={setQuantity}
                  itemsTable={itemsTable}
                  showQuantityLimit={true}
                  disableDelete={tableState.lastRowIndex === 0}
                  deleteRowHandler={deleteRow}
                  focusFirstElement={tableRow.index === tableState.focusedIndex}
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
        <ActionButton
          className='block mx-auto my-10'
          onClick={createDeliveryChallan}
        >
          Save
        </ActionButton>
      </Fragment>
    ),
    VIEW: (
      <Fragment>
        <div className='flex flex-col'>
          <div className='flex justify-center gap-10'>
            <FormField
              component={SuggestionInput}
              label='Challan Number'
              componentProperties={{
                placeholder: 'Challan Number',
                name: 'challanNo',
                suggestions: poList,
                strict: true,
                extendChangeHandler: () => {
                  setTimeout(() => {
                    const { value, isValid } = poNumberRef.ref.current;
                    if (isValid) {
                      // getPoDetails(value);
                      getChallanDetails(value);
                    }
                  }, 100);
                },
                extendFillHandler: (value) => {
                  // getPoDetails(value);
                  getChallanDetails(value);
                },
              }}
              ref={challanNoRef.ref}
            />
            <FormField
              component={TextInput}
              label='Po Number'
              componentProperties={{
                placeholder: 'PO Number',
                name: 'poNumber',
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
                value: poDetails ? poDetails.customerName : '',
                disabled: true,
              }}
              ref={customerNameRef.ref}
            />
            <FormField
              component={DateInput}
              label='Challan Date'
              componentProperties={{
                name: 'challanDate',
                value: '',
              }}
              ref={challanDateRef.ref}
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
        <div className='flex justify-center gap-x-10 my-24'>
          <ActionButton
            onClick={(e) => {
              changePage(pages.HOME);
            }}
          >
            Back
          </ActionButton>
          <ActionButton
            className='bg-green-500'
            onClick={(e) => {
              deliveryChallanModule.printChallan(challanId);
            }}
          >
            Print
          </ActionButton>
        </div>
      </Fragment>
    ),
    EDIT: (
      <Fragment>
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
                    getPoDetails(value);
                  }
                }, 100);
              },
              extendFillHandler: (value) => {
                getPoDetails(value);
              },
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
                  lastActionHandler={lastActionHandler}
                  setDrawingNo={setDrawingNo}
                  setDescription={setDescription}
                  setQuantity={setQuantity}
                  itemsTable={itemsTable}
                  disableDelete={tableState.lastRowIndex === 0}
                  deleteRowHandler={deleteRow}
                  focusFirstElement={tableRow.index === tableState.focusedIndex}
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
        <div className='flex justify-center gap-x-10 my-24'>
          <ActionButton
            className='bg-red-500'
            onClick={(e) => {
              resetPage();
            }}
          >
            Discard
          </ActionButton>
          <ActionButton className='bg-green-500' onClick={editPo}>
            Save
          </ActionButton>
        </div>
      </Fragment>
    ),
    DELETE: (
      <Fragment>
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
                    getPoDetails(value);
                  }
                }, 100);
              },
              extendFillHandler: (value) => {
                getPoDetails(value);
              },
            }}
            ref={poNumberRef.ref}
          />
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
          className='block mx-auto my-10 bg-red-500'
          onClick={deletePo}
        >
          Delete
        </ActionButton>
      </Fragment>
    ),
  };

  function isRowValid({ drawingNo, description, quantity }) {
    return (
      itemsTable.rawItems.map((item) => item.drawing_no).includes(drawingNo) &&
      itemsTable.drawingNoMapping[drawingNo] === description &&
      +quantity > 0
    );
  }

  async function createDeliveryChallan() {
    // setContentSpinner(true);
    const poNumber = poNumberRef.ref.current.value;
    const challanDate = challanDateRef.ref.current.value;
    const validRows = [];
    for (let i = 0; i < tableState.rows.length; i++) {
      const row = tableState.rows[i];
      if (isRowValid(row)) {
        validRows.push(row);
      }
    }
    // console.log({ poNumber, customerName, validRows });
    if (!(poNumber === '' || customerName === '' || validRows.length < 1)) {
      const poData = {
        poNumber,
        customerName,
        challanDate,
        itemRows: validRows,
      };
      await deliveryChallanModule.createDeliveryChallan(poData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function editPo() {
    setContentSpinner(true);
    const poNumber = poNumberRef.ref.current.value;
    const customerName = customerNameRef.ref.current.value;
    const validRows = [];
    for (let i = 0; i < tableState.rows.length; i++) {
      const row = tableState.rows[i];
      if (isRowValid(row)) {
        validRows.push(row);
      }
    }
    if (!(poNumber === '' || customerName === '' || validRows.length < 1)) {
      const poData = { poNumber, customerName, itemRows: validRows };
      await poMasterModule.editPo(poData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function deletePo() {
    setContentSpinner(true);
    const poNumber = poNumberRef.ref.current.value;
    if (poNumber !== '') {
      await poMasterModule.deletePo(poNumber);
      resetPage();
    }
    setContentSpinner(false);
  }

  return (
    <Fragment>
      <TitleBar>Delivery Challan</TitleBar>
      <div className='w-3/4 mx-auto mt-24'>{modeContent[type]}</div>
    </Fragment>
  );
}

export default DeliveryChallan;
