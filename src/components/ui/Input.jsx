import React, { useRef, useEffect } from 'react';

const Input = ({
  className,
  type = 'text',
  name,
  value,
  hasFocus,
  isValid,
  showValidity,
  dispatchState,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  return (
    <input
      className={`outline h-8 rounded-md px-1 py-0.5 ${
        showValidity && !isValid
          ? 'outline-2 outline-red-600'
          : 'outline-1 outline-gray-500 focus:outline-black focus:outline-2'
      } ${className}`}
      type={type}
      name={name}
      value={value}
      ref={inputRef}
      onChange={(e) => {
        dispatchState({
          type: 'VALUE_CHANGE',
          payload: { fieldName: name, value: e.target.value },
        });
      }}
      onKeyUp={({ code, shiftKey }) => {
        if (code === 'Enter') {
          if (shiftKey) {
            dispatchState({
              type: 'MOVE_FIELD',
              payload: { fieldName: name, forward: false },
            });
          } else {
            dispatchState({
              type: 'MOVE_FIELD',
              payload: { fieldName: name, forward: true },
            });
          }
        }
      }}
      onClick={(e) => {
        dispatchState({ type: 'CLICK_FIELD', payload: { fieldName: name } });
      }}
    />
  );
};

export default Input;
