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

  const [[drawingNoRef, descriptionRef], dispatchNavigationShortcut] =
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

  async function submitForm(e) {
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

        <ActionButton className='block mx-auto mt-24' onClick={submitForm}>
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
  };

  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-2/5  mx-auto mt-24'>{modeContent[type]}</div>
    </Fragment>
  );
};

export default ItemMaster;
