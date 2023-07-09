import React, { Fragment, useState, useEffect, useContext } from 'react';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import ActionButton from '../../../components/ui/ActionButton';

function DeleteItemMaster() {
  const { setContentSpinner, changePage, parameterValue } =
    useContext(AppContext);

  const [itemList, setItemList] = useState([]);

  useEffect(() => {
    getItemList();
  }, []);

  useEffect(() => {
    if (parameterValue) {
      drawingNoRef.ref.current.setValue(parameterValue);
      fillSelectedItemDetails(parameterValue);
    }
  }, [parameterValue]);

  async function getItemList() {
    const items = await itemMasterModule.getItems();
    setItemList(items.map((item) => item.drawing_no));
  }

  async function fillSelectedItemDetails(itemDrawingNo) {
    setContentSpinner(true);
    const result = await itemMasterModule.getItemDetails(itemDrawingNo);
    descriptionRef.ref.current.setValue(result.description);
    setContentSpinner(false);
  }

  async function deleteItem() {
    const itemDrawingNo = drawingNoRef.ref.current.value;
    if (itemDrawingNo !== '') {
      setContentSpinner(true);
      const result = await itemMasterModule.deleteItem(itemDrawingNo);
      setContentSpinner(false);
      if (result) {
        changePage(pages.HOME);
      }
    }
  }

  function resetPage() {
    drawingNoRef.ref.current.setValue('');
    descriptionRef.ref.current.setValue('');
  }

  const [[drawingNoRef, descriptionRef], dispatchNavigationShortcut] =
    useNavigationShortcuts({
      fieldList: [
        {
          name: 'drawingNo',
          focusable: true,
          defaultFocused: true,
        },
        {
          name: 'description',
          focusable: false,
        },
      ],
    });

  return (
    <Fragment>
      <FormField
        label='Drawing No'
        component={SuggestionInput}
        componentProperties={{
          name: 'drawingNo',
          suggestions: itemList,
          strict: true,
          extendChangeHandler: () => {
            setTimeout(() => {
              const { value: itemDrawingNo, isValid } =
                drawingNoRef.ref.current;
              if (isValid) {
                fillSelectedItemDetails(itemDrawingNo);
              }
            }, 100);
          },
          extendFillHandler: (itemDrawingNo) => {
            fillSelectedItemDetails(itemDrawingNo);
          },
        }}
        ref={drawingNoRef.ref}
      />
      <FormField
        label='Description'
        component={TextInput}
        componentProperties={{
          name: 'description',
          disabled: true,
        }}
        ref={descriptionRef.ref}
      />

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
          onClick={(e) => {
            resetPage();
          }}
        >
          Clear
        </ActionButton>
        <ActionButton className='bg-red-500' onClick={deleteItem}>
          Delete
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default DeleteItemMaster;
