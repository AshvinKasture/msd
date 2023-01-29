import { useReducer } from 'react';

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
      const {
        label,
        name,
        type,
        value,
        suggestions = [],
        options = [],
        validationFunction,
      } = componentProperties;
      const newComponentObject = {
        label,
        name,
        type,
        isValid: false,
        showValidity: false,
        suggestions,
        options,
      };
      newComponentObject.value = value === undefined ? '' : value;
      newComponentObject.sequenceNo = i;
      newComponentObject.hasFocus = i === 0 ? true : false;
      newComponentObject.validationFunction =
        validationFunction.bind(suggestions);
      initialState.components[name] = newComponentObject;
    }
    return initialState;
  }

  function reducerFunction(state, { type, payload }) {
    const newState = { ...state };
    const { fieldName, value } = payload
      ? payload
      : { fieldName: null, value: null };
    switch (type) {
      case 'FILL_SUGGESTION':
      case 'SET_VALUE':
      case 'CHANGE_VALUE':
        // newState = { ...state };
        // const { value } = payload;
        newState.components[fieldName].value = value;
        // const isFieldValid =
        //   newState.components[fieldName].validationFunction(value);
        let isFieldValid;
        if (newState.components[fieldName].suggestions.length > 0) {
          isFieldValid =
            newState.components[fieldName].suggestions.indexOf(value) !== -1;
        } else {
          isFieldValid =
            newState.components[fieldName].validationFunction(value);
        }
        // (state.components[fieldName].suggestions.length > 0
        //   ? state.components[fieldName].suggestions.indexOf(value) !== -1
        //   : true) && newState.components[fieldName].validationFunction(value);
        newState.components[fieldName].isValid = isFieldValid;
        newState.isFormValid = Object.values(state.components)
          .map((item) => item.isValid)
          .every((item) => item);
        return newState;
      case 'MOVE_FIELD':
        const { forward } = payload;
        // newState = { ...state };
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
        // newState = { ...state };
        for (const name in newState.components) {
          if (newState.components[name].sequenceNo === state.focusedIndex) {
            newState.components[name].hasFocus = false;
          }
        }
        newState.focusedIndex = newState.components[fieldName].sequenceNo;
        newState.components[fieldName].hasFocus = true;
        return newState;
      case 'SHOW_VALIDITY':
        // newState = { ...state };
        for (const name in newState.components) {
          if (!newState.components[name].isValid) {
            newState.components[name].showValidity = true;
          }
        }
        return newState;
      case 'SET_PROPERTIES':
        initialProperties = payload;
      case 'RESET_FORM':
        return initState(initialProperties);
      case 'FOCUS_OUT':
        newState.components[fieldName].hasFocus = false;
        if (!state.components[fieldName].isValid) {
          newState.components[fieldName].value = '';
        }
        return newState;
      case 'SET_SUGGESTIONS':
        // newState = { ...state };
        const { suggestions } = payload;
        newState.components[fieldName].suggestions = suggestions;
        return newState;
      case 'SET_OPTIONS':
        const { options } = payload;
        newState.components[fieldName].options = options;
        return newState;
    }
  }
  return useReducer(reducerFunction, initialProperties, initState);
}
