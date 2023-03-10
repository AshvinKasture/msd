import React, { useRef, useEffect, useState } from 'react';

const Input = ({
  className,
  type = 'text',
  name,
  value,
  hasFocus,
  isValid,
  showValidity,
  disabled,
  dispatchState,
}) => {
  const inputRef = useRef();

  useEffect(() => {
    if (hasFocus) {
      inputRef.current.focus();
    }
  }, [hasFocus]);

  function changeValue(value) {
    dispatchState({
      type: 'CHANGE_VALUE',
      payload: { fieldName: name, value },
    });
  }

  // useEffect(() => {
  //   changeValue('');
  // }, []);

  return (
    <div className=''>
      <input
        className={`outline rounded-sm mx-0.5 px-1 py-0.5 ${
          showValidity && !isValid
            ? 'outline-2 outline-red-600'
            : 'outline-1 outline-gray-500 focus:outline-black focus:outline-2'
        }   ${disabled && 'bg-gray-300 cursor-not-allowed'} ${className}`}
        type={type}
        name={name}
        value={value}
        disabled={disabled}
        ref={inputRef}
        onChange={(e) => {
          changeValue(e.target.value);
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
    </div>
  );
};

export default Input;
