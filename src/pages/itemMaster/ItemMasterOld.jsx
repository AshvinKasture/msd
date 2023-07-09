import React, { Fragment, useEffect, useState, useContext } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import ActionButton from '../../components/ui/ActionButton';
import AppContext from '../../store/appContext';
import FormField from '../../components/ui/inputs/FormField/FormField';
import TextInput from '../../components/ui/inputs/TextInput/TextInput';
import SuggestionInput from '../../components/ui/inputs/SuggestionInput/SuggestionInput';
import useNavigationShortcuts from '../../hooks/useNavigationShortcuts';

const ItemMaster = ({ type }) => {
  const { changePage, setContentSpinner } = useContext(AppContext);
  const [itemList, setItemList] = useState([]);

  const [[drawingNoRef, descriptionRef], dispatchNavigationShortcut, _] =
    useNavigationShortcuts({
      sequence: ['drawingNo', 'description'],
      defaultFocused: 'drawingNo',
    });

  useEffect(() => {
    getItemList();
    resetPage();
  }, [type]);

  async function getItemList() {
    const items = await itemMasterModule.getItems();
    setItemList(items.map((item) => item.drawing_no));
  }

  function resetPage() {
    drawingNoRef.ref.current.reset();
    descriptionRef.ref.current.reset();
  }

  async function getItemDetails(value) {
    const result = await itemMasterModule.getItemDetails(value);

    descriptionRef.ref.current.setValue(result.description);
  }

  async function createItem(e) {
    setContentSpinner(true);
    const itemData = {
      drawingNo: drawingNoRef.ref.current.value,
      description: descriptionRef.ref.current.value,
    };
    if (itemData.drawingNo !== '') {
      await itemMasterModule.createItem(itemData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function editItem(e) {
    setContentSpinner(true);
    const itemData = {
      drawingNo: drawingNoRef.ref.current.value,
      description: descriptionRef.ref.current.value,
    };
    if (itemData.drawingNo !== '') {
      await itemMasterModule.editItem(itemData);
      resetPage();
    }
    setContentSpinner(false);
  }

  async function deleteItem(e) {
    const drawingNo = drawingNoRef.ref.current.value;
    if (drawingNo !== '') {
      setContentSpinner(true);
      const result = await itemMasterModule.deleteItem(drawingNo);
      setContentSpinner(false);
      if (result) {
        changePage('HOME');
      }
    }
  }

  const modeContent = {
    CREATE: (
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

        <ActionButton className='block mx-auto mt-24' onClick={createItem}>
          Save
        </ActionButton>
      </Fragment>
    ),
    VIEW: (
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
                const { value, isValid } = drawingNoRef.ref.current;
                if (isValid) {
                  getItemDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getItemDetails(value);
            },
          }}
          ref={drawingNoRef.ref}
        />
        <FormField
          label='Description'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={descriptionRef.ref}
        />

        <ActionButton
          className='block mx-auto mt-24'
          onClick={(e) => {
            changePage(pages.HOME);
          }}
        >
          Back
        </ActionButton>
      </Fragment>
    ),
    EDIT: (
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
                const { value, isValid } = drawingNoRef.ref.current;
                if (isValid) {
                  getItemDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getItemDetails(value);
            },
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
    ),
    DELETE: (
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
                const { value, isValid } = drawingNoRef.ref.current;
                if (isValid) {
                  getItemDetails(value);
                }
              }, 100);
            },
            extendFillHandler: (value) => {
              getItemDetails(value);
            },
          }}
          ref={drawingNoRef.ref}
        />
        <FormField
          label='Description'
          component={TextInput}
          componentProperties={{
            disabled: true,
          }}
          ref={descriptionRef.ref}
        />

        <ActionButton
          className='block mx-auto mt-24 bg-red-500'
          onClick={(e) => {
            deleteItem();
          }}
        >
          Delete
        </ActionButton>
      </Fragment>
    ),
  };

  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-2/5  mx-auto mt-24'>{modeContent[type]}</div>
    </Fragment>
  );
};

export default ItemMaster;
