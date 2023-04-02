import React, { useEffect, useCallback } from 'react';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import { isPositiveInteger } from '../../../helpers/basicValidations';
import DeleteIcon from '../../../assets/deleteIcon';

function TableRow({
  rowData: { index, drawingNo, description, quantity, quantityAllowed },
  disabled = false,
  lastActionHandler = null,
  setDrawingNo = null,
  setDescription = null,
  setQuantity = null,
  itemsTable = null,
  showQuantityLimit = false,
  focusFirstElement = false,
  disableDelete = false,
  deleteRowHandler = null,
}) {
  const [
    [drawingNoRef, descriptionRef, quantityRef],
    dispatchNavigationShortcut,
    setFocusedElement,
  ] = useCallback(
    useNavigationShortcuts({
      sequence: ['drawingNo', 'description', 'quantity'],
      defaultFocused: 'drawingNo',
      lastAction: () => {
        if (lastActionHandler !== null) {
          lastActionHandler(index);
        }
      },
    }),
    []
  );

  useEffect(() => {
    if (focusFirstElement) {
      drawingNoRef.ref.current.focus();
    }
    setFocusedElement('drawingNo');
  }, [focusFirstElement]);

  // console.log(showQuantityLimit)

  return (
    <div className='table-row'>
      <div className='table-cell py-2 border border-black text-center'>
        {index + 1}.
      </div>
      <div className='table-cell p-2 border border-black'>
        <SuggestionInput
          width='full'
          name='drawingNo'
          value={drawingNo}
          disabled={disabled}
          suggestions={
            itemsTable ? itemsTable.rawItems.map((item) => item.drawing_no) : []
          }
          extendBlurHandler={
            setDrawingNo &&
            ((e, value) => {
              console.log('blur');
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
          width={showQuantityLimit ? '1/2' : 'full'}
          name='quantity'
          value={quantity}
          disabled={disabled}
          extendChangeHandler={
            setQuantity && ((e, value) => setQuantity(index, value))
          }
          acceptedInput={({ oldValue, newValue }) => {
            if (showQuantityLimit) {
              return isPositiveInteger(newValue) &&
                +newValue <= +quantityAllowed &&
                +newValue > 0
                ? newValue
                : oldValue;
            } else {
              return isPositiveInteger(newValue) ? newValue : oldValue;
            }
          }}
          dispatchNavigationShortcut={dispatchNavigationShortcut}
          className='outline-0 text-right'
          ref={quantityRef.ref}
        />
        {showQuantityLimit && (
          <span className='ml-2 font-bold'>/ {quantityAllowed}</span>
        )}
      </div>
      <div className='table-cell p-2 border border-black'>
        <div className='flex justify-center'>
          <button
            disabled={disableDelete}
            className={`${disableDelete && 'cursor-not-allowed'}`}
            onClick={() => {
              if (deleteRowHandler !== null) {
                deleteRowHandler(index);
              }
            }}
          >
            <DeleteIcon disabled={disableDelete} />
          </button>
        </div>
      </div>
    </div>
  );
}

export default TableRow;
