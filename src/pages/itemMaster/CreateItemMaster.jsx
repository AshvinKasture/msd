import React, { Fragment, useReducer } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import InputField from '../../components/ui/InputField';
import ActionButton from '../../components/ui/ActionButton';

const CreateItemMaster = () => {
  const { drawingNoName, descriptionName } = {
    drawingNoName: 'drawingNo',
    descriptionName: 'description',
  };
  function isEmpty(value) {
    return value.trim().length === 0;
  }
  const initialProperties = [
    {
      label: 'Drawing No',
      name: drawingNoName,
      type: 'text',
      validationFunction: (value) => {
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
  function initState(initialObject) {
    const initialState = {
      focusedIndex: 0,
      size: initialObject.length,
      isFormValid: false,
      components: {},
    };
    for (let i = 0; i < initialObject.length; i++) {
      const componentProperties = initialObject[i];
      const { label, name, type, value, validationFunction } =
        componentProperties;
      const newComponentObject = {
        label,
        name,
        type,
        isValid: false,
        showValidity: false,
        validationFunction,
      };
      newComponentObject.value = value === undefined ? '' : value;
      newComponentObject.sequenceNo = i;
      newComponentObject.hasFocus = i === 0 ? true : false;
      initialState.components[name] = newComponentObject;
    }
    return initialState;
  }
  const [
    {
      components: {
        [drawingNoName]: drawingNoComponent,
        [descriptionName]: descriptionComponent,
      },
      isFormValid,
    },
    dispatchState,
  ] = useReducer(
    (state, { type, payload }) => {
      let newState;
      const { fieldName } = payload ? payload : { fieldName: null };
      switch (type) {
        case 'VALUE_CHANGE':
          const { value } = payload;
          newState = { ...state };
          newState.components[fieldName].value = value;
          const isFieldValid =
            newState.components[fieldName].validationFunction(value);
          newState.components[fieldName].isValid = isFieldValid;
          newState.isFormValid = Object.values(state.components)
            .map((item) => item.isValid)
            .every((item) => item);
          return newState;
        case 'MOVE_FIELD':
          const { forward } = payload;
          newState = { ...state };
          newState.components[fieldName].hasFocus = false;
          if (forward) {
            if (state.focusedIndex < state.size - 1) {
              newState.focusedIndex = state.focusedIndex + 1;
            } else if (state.focusedIndex === state.size - 1) {
              // ToDo: submit form using enter on last field functionality
              // submitForm();
            }
          } else {
            if (state.focusedIndex > 0) {
              newState.focusedIndex = state.focusedIndex - 1;
            }
          }
          for (const name in newState.components) {
            if (
              newState.components[name].sequenceNo === newState.focusedIndex
            ) {
              newState.components[name].hasFocus = true;
            }
          }
          return newState;
        case 'CLICK_FIELD':
          newState = { ...state };
          for (const name in newState.components) {
            if (newState.components[name].sequenceNo === state.focusedIndex) {
              newState.components[name].hasFocus = false;
            }
          }
          newState.focusedIndex = newState.components[fieldName].sequenceNo;
          newState.components[fieldName].hasFocus = true;
          return newState;
        case 'SHOW_VALIDITY':
          newState = { ...state };
          for (const name in newState.components) {
            if (!newState.components[name].isValid) {
              newState.components[name].showValidity = true;
            }
          }
          return newState;
      }
    },
    initialProperties,
    initState
  );

  function submitForm() {
    if (isFormValid) {
      const drawingNo = drawingNoComponent.value;
      const description = descriptionComponent.value;
      console.log(drawingNo, description);
    } else {
      dispatchState({ type: 'SHOW_VALIDITY' });
    }
  }

  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-1/4 mx-auto mt-24'>
        <InputField dispatchState={dispatchState}>
          {drawingNoComponent}
        </InputField>
        <InputField dispatchState={dispatchState}>
          {descriptionComponent}
        </InputField>
        <ActionButton className='block mx-auto' onClick={submitForm}>
          Save
        </ActionButton>
      </div>
    </Fragment>
  );
};

export default CreateItemMaster;
