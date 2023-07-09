import React, { Fragment, useState, useEffect, useContext } from 'react';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../../components/ui/inputs/SuggestionInput/SuggestionInput';
import ActionButton from '../../../components/ui/ActionButton';

function EditItemMaster() {
  const { setContentSpinner, changePage, parameterValue } =
    useContext(AppContext);

  const [itemList, setItemList] = useState([]);
  const [editFieldsDisabled, setEditFieldsDisabled] = useState(true);

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

  async function editItem() {
    setContentSpinner(true);
    const itemData = {
      drawingNo: drawingNoRef.ref.current.value,
      description: descriptionRef.ref.current.value,
    };
    if (itemData.drawingNo !== '') {
      await itemMasterModule.editItem(itemData);
      setContentSpinner(false);
      changePage('HOME', null, null);
    }
    setContentSpinner(false);
  }

  function resetPage() {
    drawingNoRef.ref.current.setValue('');
    descriptionRef.ref.current.setValue('');
    setEditFieldsDisabled(true);
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
          focusable: true,
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
          dispatchNavigationShortcut,
          strict: true,
          extendChangeHandler: () => {
            setTimeout(() => {
              const { value: itemDrawingNo, isValid } =
                drawingNoRef.ref.current;
              if (isValid) {
                fillSelectedItemDetails(itemDrawingNo);
                setEditFieldsDisabled(false);
              } else {
                setEditFieldsDisabled(true);
              }
            }, 100);
          },
          extendFillHandler: (itemDrawingNo) => {
            fillSelectedItemDetails(itemDrawingNo);
            setEditFieldsDisabled(false);
          },
        }}
        ref={drawingNoRef.ref}
      />
      <FormField
        label='Description'
        component={TextInput}
        componentProperties={{
          name: 'description',
          disabled: editFieldsDisabled,
          dispatchNavigationShortcut,
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
          className='bg-red-500'
          onClick={(e) => {
            resetPage();
          }}
        >
          Discard
        </ActionButton>
        <ActionButton className='bg-green-500' onClick={editItem}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default EditItemMaster;
