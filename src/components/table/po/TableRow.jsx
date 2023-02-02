import React, { useEffect, useCallback } from 'react';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import { isPositiveInteger } from '../../../helpers/basicValidations';

function TableRow({
  rowData: { index, drawingNo, description, quantity },
  disabled = false,
  addRow = null,
  setDrawingNo = null,
  setDescription = null,
  setQuantity = null,
  itemsTable = null,
  focusFirstElement = false,
}) {
  const [
    [drawingNoRef, descriptionRef, quantityRef],
    dispatchNavigationShortcut,
  ] = useCallback(
    useNavigationShortcuts({
      sequence: ['drawingNo', 'description', 'quantity'],
      defaultFocused: 'drawingNo',
      lastAction: addRow,
    }),
    []
  );

  useEffect(() => {
    if (focusFirstElement) {
      drawingNoRef.ref.current.focus();
    }
  }, []);

  return (
    <div className='table-row'>
      <div className='table-cell p-2 border border-black'>
        <SuggestionInput
          name='drawingNo'
          value={drawingNo}
          disabled={disabled}
          suggestions={
            itemsTable ? itemsTable.rawItems.map((item) => item.drg_no) : []
          }
          extendBlurHandler={
            setDrawingNo &&
            ((e, value) => {
              setDrawingNo(index, value);
            })
          }
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          className='outline-0'
          ref={drawingNoRef.ref}
        />
      </div>
      <div className='table-cell p-2 border border-black'>
        <SuggestionInput
          width='full'
          name='description'
          value={description}
          disabled={disabled}
          suggestions={
            itemsTable
              ? itemsTable.rawItems.map((item) => item.description)
              : []
          }
          extendBlurHandler={
            setDescription &&
            ((e, value) => {
              setDescription(index, value);
            })
          }
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          className='outline-0'
          ref={descriptionRef.ref}
        />
      </div>
      <div className='table-cell p-2 border border-black'>
        <TextInput
          name='quantity'
          value={quantity}
          disabled={disabled}
          extendChangeHandler={
            setQuantity && ((e, value) => setQuantity(index, value))
          }
          acceptedInput={({ oldValue, newValue }) => {
            return isPositiveInteger(newValue) ? newValue : oldValue;
          }}
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          className='outline-0'
          ref={quantityRef.ref}
        />
      </div>
    </div>
  );
}

export default TableRow;
