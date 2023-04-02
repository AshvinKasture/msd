import { useState, useRef, forwardRef, useImperativeHandle } from 'react';

const TextInput = forwardRef(
  (
    {
      defaultValue,
      width = 'w-52',
      outlineSize = 'outline',
      outlineColor = 'outline-gray-400',
    },
    ref
  ) => {
    const [value, setValue] = useState(defaultValue);
    const inputRef = useRef(null);

    const handleInputChange = (event) => {
      setValue(event.target.value);
    };

    const getValue = () => {
      return value;
    };

    const setValueAndFocus = (newValue) => {
      setValue(newValue);
      inputRef.current.focus();
    };

    const focus = () => {
      inputRef.current.focus();
    };

    useImperativeHandle(ref, () => {
      return {
        getValue,
        setValueAndFocus,
        focus,
      };
    });

    return (
      <input
        ref={inputRef}
        type='text'
        value={value}
        onChange={handleInputChange}
        className={`px-4 py-2 ${width} ${outlineSize} ${outlineColor} rounded-lg transition-all duration-200 focus:${outlineSize}-2 focus:${outlineColor}`}
      />
    );
  }
);

export default TextInput;
