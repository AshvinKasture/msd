import React, { Fragment, useRef, useContext } from 'react';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import ActionButton from '../../../components/ui/ActionButton';
import TableRow from '../../../components/table/po/TableRow';

function CreateItemMaster() {
  const { setContentSpinner, changePage } = useContext(AppContext);

  async function createItem() {
    setContentSpinner(true);
    const itemData = {
      drawingNo: drawingNoRef.current.value,
      description: descriptionRef.current.value,
    };

    if (itemData.drawingNo !== '') {
      await itemMasterModule.createItem(itemData);
      setContentSpinner(false);
      changePage(pages.ITEM_MASTER, types.VIEW, itemData.drawingNo);
    }
    setContentSpinner(false);
  }

  function resetPage() {
    drawingNoRef.current.setValue('');
    descriptionRef.current.setValue('');
  }

  const drawingNoRef = useRef(null);
  const descriptionRef = useRef(null);

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
              //   dispatchNavigationShortcut,
            }}
            ref={poNumberRef}
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
              //   dispatchNavigationShortcut,
            }}
            ref={customerNameRef}
          />
          <FormField
            component={DateInput}
            label='PO Date'
            componentProperties={{
              name: 'poDate',
              // value: new Date(),
            }}
            ref={poDateRef}
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
      <ActionButton className='block mx-auto my-10' onClick={createPo}>
        Save
      </ActionButton>
    </Fragment>
  );
}

export default CreateItemMaster;
