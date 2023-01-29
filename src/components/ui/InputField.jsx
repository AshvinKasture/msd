import React from 'react';
import Input from './Input';

const InputField = ({
  component: { label, type, name, value, hasFocus, isValid, showValidity },
  dispatchState,
  disabled = false,
}) => {
  return (
    <div className='flex justify-center items-center my-5'>
      <label htmlFor='' className='w-40 max-w-xs'>
        {label}
      </label>
      <Input
        type={type}
        name={name}
        value={value}
        hasFocus={hasFocus}
        isValid={isValid}
        showValidity={showValidity}
        disabled={disabled}
        dispatchState={dispatchState}
      />
    </div>
  );
};

export default InputField;
