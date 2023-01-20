import React, { useReducer } from 'react';

export default function useForm(initialProperties) {
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

  function reducerFunction(state, { type, payload }) {
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
          if (newState.components[name].sequenceNo === newState.focusedIndex) {
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
  }

  return useReducer(reducerFunction, initialProperties, initState);
}
