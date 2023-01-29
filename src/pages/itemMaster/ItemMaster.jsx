import React, { Fragment, useEffect, useState, useContext } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import ActionButton from '../../components/ui/ActionButton';
import useForm from '../../hooks/useForm';
import AppContext from '../../store/appContext';
import { isEmpty } from '../../helpers/basicValidations';
import FormField from '../../components/ui/FormField';
import Input from '../../components/ui/Input';
import SuggestionInput from '../../components/ui/SuggestionInput';

const ItemMaster = ({ type }) => {
  const { CREATE, VIEW, EDIT, DELETE } = types;
  const { changePage } = useContext(AppContext);
  const { drawingNoName, descriptionName } = {
    drawingNoName: 'drawingNo',
    descriptionName: 'description',
  };

  useEffect(() => {
    if ([VIEW, EDIT, DELETE].includes(type)) {
      async function getItemsFromDatabase() {
        const items = await itemMasterModule.getItems();
        dispatchState({
          type: 'SET_SUGGESTIONS',
          payload: {
            fieldName: drawingNoName,
            suggestions: items.map((item) => item.drg_no),
          },
        });
      }
      getItemsFromDatabase();
    }
  }, [type]);

  const initialProperties = [
    {
      label: 'Drawing No',
      name: drawingNoName,
      type: 'text',
      validationFunction: function (value) {
        return !isEmpty(value);
      },
    },
    {
      label: 'Descrption',
      name: descriptionName,
      type: 'text',
      validationFunction: (value) => {
        return !isEmpty(value);
      },
    },
  ];

  const [
    {
      components: {
        [drawingNoName]: drawingNoComponent,
        [descriptionName]: descriptionComponent,
      },
      isFormValid,
    },
    dispatchState,
  ] = useForm(initialProperties);

  useEffect(() => {
    if ([VIEW, EDIT, DELETE].includes(type)) {
      const checkIfValueChanged = async function () {
        const { value, isValid } = drawingNoComponent;
        if (isValid) {
          await fillValues(value);
        }
      };
      checkIfValueChanged();
    }
  }, [drawingNoComponent.value, drawingNoComponent.isValid]);

  useEffect(() => {
    dispatchState({ type: 'RESET_FORM' });
  }, [type]);

  async function fillValues(drawingNo) {
    const { description } = await itemMasterModule.getItemByDrawingNo(
      drawingNo
    );
    dispatchState({
      type: 'SET_VALUE',
      payload: { fieldName: descriptionName, value: description },
    });
  }

  async function submitForm(e) {
    if (isFormValid) {
      const drawingNo = drawingNoComponent.value;
      const description = descriptionComponent.value;
      const result = await itemMasterModule.createItem({
        drawingNo,
        description,
      });
      console.log(result);
      if (result) {
        dispatchState({ type: 'RESET_FORM' });
      }
    } else {
      dispatchState({ type: 'SHOW_VALIDITY' });
    }
  }

  const modeContent = {
    CREATE: (
      <Fragment>
        <FormField
          properties={drawingNoComponent}
          component={Input}
          dispatchState={dispatchState}
        />

        <FormField
          properties={descriptionComponent}
          component={Input}
          dispatchState={dispatchState}
        />

        <ActionButton className='block mx-auto mt-10 mb-5' onClick={submitForm}>
          Save
        </ActionButton>
      </Fragment>
    ),
    VIEW: (
      <Fragment>
        <FormField
          properties={drawingNoComponent}
          component={SuggestionInput}
          dispatchState={dispatchState}
        />

        <FormField
          properties={{ ...descriptionComponent, disabled: true }}
          component={Input}
          dispatchState={dispatchState}
        />

        <ActionButton
          className='block mx-auto mt-10 mb-5'
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
