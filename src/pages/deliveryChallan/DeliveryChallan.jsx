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
  const [challanNoList, setChallanNoList] = useState([]);
  const [poList, setPoList] = useState([]);
  const [poDetails, setPoDetails] = useState();
  const [challanNo, setChallanNo] = useState(null);
  const [challanDetails, setChallanDetails] = useState(null);

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
        setTodaysDate();
        break;
      case 'VIEW':
        getPoList();
        getChallanNoList();
        // if (appData !== null) {
        //   const { challanNo } = appData;
        //   setAppData(null);
        //   resetPage();
        //   console.log(challanNoRef);
        //   console.log(challanNo);
        //   challanNoRef.ref.current.setValue(challanNo);
        //   getChallanDetails(challanNo);
        // }
        break;
      case 'EDIT':
        getPoList();
        getChallanNoList();
        break;
      case 'DELETE':
        getPoList();
        getChallanNoList();
        break;
    }
  }, [type]);

  function initialElementFocus() {
    poNumberRef.ref.current.focus();
  }

  function setTodaysDate() {
    challanDateRef.ref.current.setValue(new Date());
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

  async function getChallanNoList() {
    const challanList = await deliveryChallanModule.getChallanList();
    setChallanNoList(challanList);
    // console.log('here', challanList);
  }

  async function getPoList() {
    const poList = await poMasterModule.getPoList();
    setPoList(poList.map((poItem) => poItem.po_no));
  }

  function resetPage() {
    poNumberRef.ref.current.reset();
    customerNameRef.ref.current.reset();
    resetTable();
    if (type === 'CREATE') {
      getNextChallanNo();
    }
  }

  async function getPoDetails(poNumber) {
    console.log('Getting PO Details');
    const poDetails = await poMasterModule.getPoDetails(poNumber);
    customerNameRef.ref.current.setValue(poDetails.customerName);
    dispatchState({ type: 'SET_PO_DETAILS', payload: poDetails });
    dispatchTableState({ type: 'RESET' });
  }

  async function getChallanDetails(challanNo) {
    // const poDetails = await deliveryChallanModule.getAllChallans(poNumber);
    // console.log(poDetails);
    // setPoDetails(poDetails);
    const { poNo, customerName, challanDate, challanItems, isCancelled } =
      await deliveryChallanModule.getChallanDetails(challanNo);
    // console.log(result);
    setChallanNo(challanNo);
    poNumberRef.ref.current.setValue(poNo);
    if (isCancelled) {
      document.getElementById('cancelled-stamp').classList.remove('hidden');
    } else {
      document.getElementById('cancelled-stamp').classList.add('hidden');
    }
    await getPoDetails(poNo);
    customerNameRef.ref.current.setValue(customerName);
    // console.log(new Date(momentModule.formatDate(challanDate)));
    challanDateRef.ref.current.setValue(new Date(challanDate));
    fillChallanItems(challanItems);
    // setChallanDetails(result);
  }

  function fillChallanItems(challanItems) {
    // setChallanId(challanId);
    // const challanItems = poDetails.challans.filter(
    //   (challan) => challan.challan_id == challanId
    // )[0].items;
    const tableRows = [];
    for (let i = 0; i < challanItems.length; i++) {
      const { drawingNo, description, quantity } = challanItems[i];
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
          const rows = [];
          for (let i = 0; i < payload.length; i++) {
            rows.push({
              ...payload[i],
              quantityAllowed:
                itemsTable.quantityMapping[payload[i].drawingNo] +
                payload[i].quantity,
            });
          }
          return {
            focusedIndex: -1,
            lastRowIndex: payload.length - 1,
            rows,
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
                // value: new Date(),
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
              // console.log(tableRow);
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
                suggestions: challanNoList,
                strict: true,
                extendChangeHandler: () => {
                  setTimeout(() => {
                    const { value, isValid } = challanNoRef.ref.current;
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
                disabled: true,
              }}
              ref={challanDateRef.ref}
            />
          </div>

          <div
            id='cancelled-stamp'
            className='border-8 border-red-400 border-solid w-fit mx-auto mt-5 p-2 text-red-400 font-extrabold text-lg hidden'
          >
            Cancelled
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
            className='bg-gray-500'
            onClick={(e) => {
              changePage(pages.HOME);
            }}
          >
            Back
          </ActionButton>
          <ActionButton
            className=''
            onClick={(e) => {
              deliveryChallanModule.outputDeliveryChallan({
                challanNo,
                type: 'SAVE',
              });
            }}
          >
            Save as PDF
          </ActionButton>
          <ActionButton
            className='bg-green-500'
            onClick={(e) => {
              deliveryChallanModule.outputDeliveryChallan({
                challanNo,
                type: 'PRINT',
              });
            }}
          >
            Print
          </ActionButton>
        </div>
      </Fragment>
    ),
    EDIT: (
      <Fragment>
        <div className='flex flex-col'>
          <div className='flex justify-center gap-10'>
            <FormField
              component={SuggestionInput}
              label='Challan Number'
              componentProperties={{
                placeholder: 'Challan Number',
                name: 'challanNo',
                suggestions: challanNoList,
                strict: true,
                extendChangeHandler: () => {
                  setTimeout(() => {
                    const { value, isValid } = challanNoRef.ref.current;
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
              // console.log(tableRow);
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
        <div className='flex justify-center gap-x-10 my-24'>
          <ActionButton
            onClick={(e) => {
              changePage(pages.HOME);
            }}
          >
            Back
          </ActionButton>

          <ActionButton className='bg-green-500' onClick={editDeliveryChallan}>
            Save
          </ActionButton>
        </div>
      </Fragment>
    ),
    DELETE: (
      <Fragment>
        <div className='flex flex-col'>
          <div className='flex justify-center gap-10'>
            <FormField
              component={SuggestionInput}
              label='Challan Number'
              componentProperties={{
                placeholder: 'Challan Number',
                name: 'challanNo',
                suggestions: challanNoList,
                strict: true,
                extendChangeHandler: () => {
                  setTimeout(() => {
                    const { value, isValid } = challanNoRef.ref.current;
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
                disabled: true,
              }}
              ref={challanDateRef.ref}
            />
          </div>
          <div
            id='cancelled-stamp'
            className='border-8 border-red-400 border-solid w-fit mx-auto mt-5 p-2 text-red-400 font-extrabold text-lg hidden'
          >
            Cancelled
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
            className='bg-gray-500'
            onClick={(e) => {
              changePage(pages.HOME);
            }}
          >
            Back
          </ActionButton>
          <ActionButton className='bg-red-500' onClick={deleteDeliveryChallan}>
            Delete
          </ActionButton>
        </div>
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
    setContentSpinner(true);
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
    if (!(poNumber === '' || validRows.length < 1)) {
      const poData = {
        poNumber,
        challanDate,
        itemRows: validRows,
      };
      const challanNo = await deliveryChallanModule.createDeliveryChallan(
        poData
      );
      resetPage();
    }
    setContentSpinner(false);
  }

  async function editDeliveryChallan() {
    setContentSpinner(true);
    const challanNumber = challanNoRef.ref.current.value;
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
    if (!(challanNumber === '' || poNumber === '' || validRows.length < 1)) {
      const challanData = {
        challanNumber,
        poNumber,
        challanDate,
        itemRows: validRows,
      };
      await deliveryChallanModule.editDeliveryChallan(challanData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function deleteDeliveryChallan() {
    setContentSpinner(true);
    const challanNo = challanNoRef.ref.current.value;
    if (challanNo !== '') {
      await deliveryChallanModule.deleteDeliveryChallan(challanNo);
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
