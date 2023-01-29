import React from 'react';
import SuggestionInput from './SuggestionInput';

const SuggestionField = ({
  component: {
    label,
    type,
    name,
    value,
    hasFocus,
    isValid,
    suggestions,
    showValidity,
  },
  dispatchState,
  disabled,
}) => {
  return (
    <div className='flex justify-center  outline-1 outline-black items-center my-5'>
      <label htmlFor='' className='w-40 max-w-xs  outline-1 outline-red-500'>
        {label}
      </label>
      <SuggestionInput
        className=''
        type={type}
        name={name}
        value={value}
        hasFocus={hasFocus}
        isValid={isValid}
        showValidity={showValidity}
        suggestions={suggestions || []}
        disabled={disabled}
        dispatchState={dispatchState}
      />
    </div>
  );
};

export default SuggestionField;
