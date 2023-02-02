import React, { useEffect, useCallback } from 'react';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import { isPositiveInteger } from '../../../helpers/basicValidations';

function TableRow({
  rowData: { index, drawingNo, description, quantity },
  addRow,
  setDrawingNo,
  setDescription,
  setQuantity,
  itemsTable,
  focusFirstElement,
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
          suggestions={itemsTable.rawItems.map((item) => item.drg_no)}
          extendBlurHandler={(e, value) => {
            setDrawingNo(index, value);
          }}
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
          suggestions={itemsTable.rawItems.map((item) => item.description)}
          extendBlurHandler={(e, value) => {
            setDescription(index, value);
          }}
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          className='outline-0'
          ref={descriptionRef.ref}
        />
      </div>
      <div className='table-cell p-2 border border-black'>
        <TextInput
          name='quantity'
          value={quantity}
          extendChangeHandler={(e, value) => setQuantity(index, value)}
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
