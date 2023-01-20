import React from 'react';
import Input from './Input';

const InputField = ({
  children: { label, type, name, value, hasFocus, isValid, showValidity },
  dispatchState,
}) => {
  return (
    <div className='flex my-3 h-12'>
      <label htmlFor='' className='basis-1/3'>
        {label}
      </label>
      <Input
        className='basis-2/3'
        type={type}
        name={name}
        value={value}
        hasFocus={hasFocus}
        isValid={isValid}
        showValidity={showValidity}
        dispatchState={dispatchState}
      />
    </div>
  );
};

export default InputField;
