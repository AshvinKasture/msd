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

function CreatePoMaster() {
  const { setContentSpinner, changePage } = useContext(AppContext);

  const [customerList, setCustomerList] = useState([]);
  const [itemsTable, setItemsTable] = useState({ rawItems: [] });

  useEffect(() => {
    getItemsTable();
    getCustomerList();
  }, []);

  async function getCustomerList() {
    setCustomerList(
      (await customerMasterModule.getCustomers()).map(
        (customerItem) => customerItem.customer_name
      )
    );
  }

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

  function isRowValid({ drawingNo, description, quantity }) {
    return (
      itemsTable.rawItems.map((item) => item.drawing_no).includes(drawingNo) &&
      itemsTable.drawingNoMapping[drawingNo] === description &&
      +quantity > 0
    );
  }

  async function createPo() {
    setContentSpinner(true);
    const poNumber = poNumberRef.ref.current.value;
    const customerName = customerNameRef.ref.current.value;
    const poDate = poDateRef.ref.current.value;
    const validRows = [];
    for (let i = 0; i < tableState.rows.length; i++) {
      const row = tableState.rows[i];
      if (isRowValid(row)) {
        validRows.push(row);
      }
    }
    if (!(poNumber === '' || customerName === '' || validRows.length < 1)) {
      const poData = { poNumber, customerName, poDate, itemRows: validRows };
      await poMasterModule.createPo(poData);
      setContentSpinner(false);
      changePage(pages.PO_MASTER, types.VIEW, poNumber);
    }
    setContentSpinner(false);
  }

  function resetPage() {
    poNumberRef.ref.current.reset();
    customerNameRef.ref.current.reset();
    poDateRef.ref.current.reset();
    resetTable();
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
            component={TextInput}
            label='PO Number'
            componentProperties={{
              placeholder: 'PO Number',
              name: 'poNumber',
              dispatchNavigationShortcut,
            }}
            ref={poNumberRef.ref}
          />
        </div>
        <div className='flex justify-center gap-10'>
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
          <FormField
            component={DateInput}
            label='PO Date'
            componentProperties={{
              name: 'poDate',
              dispatchNavigationShortcut,
              // value: new Date(),
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
          {/* {console.log({ focusedIndex: tableState.focusedIndex }) && ''} */}
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
                setFocusedRow={setFocusedRow}
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
      <div className='flex justify-center gap-x-10 mt-24'>
        <ActionButton
          className='bg-gray-500'
          onClick={(e) => {
            changePage(pages.HOME);
          }}
        >
          Back
        </ActionButton>
        <ActionButton
          className='bg-red-500'
          onClick={(e) => {
            resetPage();
          }}
        >
          Discard
        </ActionButton>
        <ActionButton className='bg-green-500' onClick={createPo}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default CreatePoMaster;
