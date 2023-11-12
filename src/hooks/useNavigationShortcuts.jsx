import { useRef, useEffect } from 'react';

function useNavigationShortcuts({
  fieldList,
  defaultFocusedFieldName = null,
  defaultFocusedIndex = null,
  lastAction = () => {},
}) {
  const allFields = [];
  const focusableFields = [];

  function getSequenceNo(fieldName) {
    return focusableFields.findIndex((field) => field.name === fieldName);
  }

  function isFocusable(fieldName) {
    return fieldList.find((field) => field.name === fieldName).focusable;
  }

  for (let i = 0; i < fieldList.length; i++) {
    const currentFieldInfo = fieldList[i];
    const newFieldObject = {
      name: currentFieldInfo.name,
      ref: useRef(),
    };
    allFields.push(newFieldObject);
    if (currentFieldInfo.focusable) {
      focusableFields.push(newFieldObject);
    }
  }

  let currentSequenceNo = -1;
  if (defaultFocusedIndex) {
    currentSequenceNo = defaultFocusedIndex;
  } else if (defaultFocusedFieldName) {
    currentSequenceNo = getSequenceNo(defaultFocusedFieldName);
  } else {
    currentSequenceNo = fieldList.findIndex((field) => field.defaultFocused);
  }

  useEffect(() => {
    setTimeout(() => {
      if (currentSequenceNo >= 0 && currentSequenceNo < fieldList.length) {
        focusableFields[currentSequenceNo].ref.current.focus();
      }
    }, 100);
  }, []);

  function dispatchNavigationShortcut({ type, direction, name }) {
    if (isFocusable(name)) {
      let indexNo;
      switch (type) {
        case 'MOVE':
          if (currentSequenceNo + direction >= focusableFields.length) {
            lastAction();
            return;
          }
          currentSequenceNo += direction;
          setTimeout(() => {
            focusableFields[currentSequenceNo].ref.current.focus();
          }, 100);
          break;
        case 'CLICK':
          indexNo = getSequenceNo(name);
          currentSequenceNo = indexNo >= 0 ? indexNo : currentSequenceNo;
          break;
        case 'SET_FOCUS':
          indexNo = getSequenceNo(name);
          currentSequenceNo = indexNo >= 0 ? indexNo : currentSequenceNo;
          break;
        default:
          console.error('No case found');
      }
    }
  }

  return [allFields, dispatchNavigationShortcut];
}

export default useNavigationShortcuts;
