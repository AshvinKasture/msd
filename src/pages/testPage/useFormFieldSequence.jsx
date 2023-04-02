import { useEffect, useRef } from 'react';

export default function useFormFieldSequence(fieldSequence) {
  const fieldRefs = useRef({});
  const [currentFieldIndex, setCurrentFieldIndex] = useState(0);

  useEffect(() => {
    if (fieldRefs.current[fieldSequence[currentFieldIndex]]) {
      fieldRefs.current[fieldSequence[currentFieldIndex]].focus();
    }
  }, [currentFieldIndex, fieldSequence]);

  function handleKeyDown(event) {
    if (
      event.key === 'Enter' &&
      currentFieldIndex === fieldSequence.length - 1
    ) {
      // submit form
      event.preventDefault();
      event.stopPropagation();
      return;
    }

    if (event.key === 'Enter' && currentFieldIndex < fieldSequence.length - 1) {
      // move focus to next field
      event.preventDefault();
      event.stopPropagation();
      setCurrentFieldIndex(currentFieldIndex + 1);
      return;
    }

    if (
      event.key === 'Shift' &&
      event.key === 'Enter' &&
      currentFieldIndex > 0
    ) {
      // move focus to previous field
      event.preventDefault();
      event.stopPropagation();
      setCurrentFieldIndex(currentFieldIndex - 1);
      return;
    }
  }

  function handleFieldClick(index) {
    setCurrentFieldIndex(index);
  }

  function registerFieldRef(fieldName, ref) {
    fieldRefs.current[fieldName] = ref;
  }

  return {
    registerFieldRef,
    handleKeyDown,
    handleFieldClick,
  };
}
