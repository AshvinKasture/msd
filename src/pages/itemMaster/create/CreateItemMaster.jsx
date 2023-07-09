import React, { Fragment, useRef, useContext } from 'react';
import useNavigationShortcuts from '../../../hooks/useNavigationShortcuts';
import AppContext from '../../../store/appContext';
import FormField from '../../../components/ui/inputs/FormField/FormField';
import TextInput from '../../../components/ui/inputs/TextInput/TextInput';
import ActionButton from '../../../components/ui/ActionButton';

function CreateItemMaster() {
  const { setContentSpinner, changePage } = useContext(AppContext);

  async function createItem() {
    setContentSpinner(true);
    const itemData = {
      drawingNo: drawingNoRef.ref.current.value,
      description: descriptionRef.ref.current.value,
    };

    if (itemData.drawingNo !== '') {
      await itemMasterModule.createItem(itemData);
      setContentSpinner(false);
      changePage(pages.ITEM_MASTER, types.VIEW, itemData.drawingNo);
    }
    setContentSpinner(false);
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
          focusable: true,
        },
      ],
    });

  return (
    <Fragment>
      <FormField
        label='Drawing No'
        component={TextInput}
        componentProperties={{
          name: 'drawingNo',
          dispatchNavigationShortcut,
        }}
        ref={drawingNoRef.ref}
      />
      <FormField
        label='Description'
        component={TextInput}
        componentProperties={{
          name: 'description',
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
        <ActionButton className='bg-green-500' onClick={createItem}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
}

export default CreateItemMaster;
