import React from 'react';
import Input from './Input';

const InputField = ({
  label,
  type,
  value,
  name,
  changeHandler,
  reference,
  moveField,
  selectField,
}) => {
  return (
    <div className='flex my-3 h-12'>
      <label htmlFor='' className='basis-1/3'>
        {label}
      </label>
      <Input
        className='basis-2/3'
        type={type}
        value={value}
        name={name}
        changeHandler={changeHandler}
        reference={reference}
        moveField={moveField}
        selectField={selectField}
      />
    </div>
  );
};

export default InputField;
