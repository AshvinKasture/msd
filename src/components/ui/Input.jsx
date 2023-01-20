import React from 'react';

const Input = ({
  className,
  type = 'text',
  value,
  name,
  changeHandler,
  reference,
  moveField,
  selectField,
}) => {
  return (
    <input
      type={type}
      className={`border border-gray-500 h-8 rounded-md px-1 py-0.5 outline-none focus:border-black focus:border-2 ${className}`}
      name={name}
      value={value}
      onChange={(e) => {
        changeHandler({
          action: 'CHANGE',
          payload: { field: e.target.name, value: e.target.value },
        });
      }}
      ref={reference}
      onKeyUp={({ code, shiftKey }) => {
        if (code === 'Enter') {
          if (shiftKey) {
            moveField(true);
          } else {
            moveField();
          }
        }
      }}
      onClick={(e) => {
        selectField(e.target.name);
      }}
    />
  );
};

export default Input;
