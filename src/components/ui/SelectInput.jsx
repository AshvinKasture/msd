import React from 'react';

function SellectInput({ options = [], name, value, disabled, dispatchState }) {
  return (
    <div className='w-48'>
      <select
        className={`w-full mx-0.5 px-1 py-0.5 outline outline-1 outline-black rounded-sm ${
          disabled && 'bg-gray-300 cursor-not-allowed'
        }`}
        value={value}
        disabled={disabled}
        size={options.length === 0 ? 1 : 1}
        onChange={(e) => {
          dispatchState({
            type: 'CHANGE_VALUE',
            payload: { fieldName: name, value: e.target.value },
          });
        }}
      >
        <option value='' disabled={true} hidden={true}></option>
        {options.map((option) => (
          <option key={option}>{option}</option>
        ))}
      </select>
    </div>
  );
}

export default SellectInput;
