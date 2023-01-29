import React from 'react';

const FormField = ({ properties, component: Component, dispatchState }) => {
  return (
    <div className='flex justify-center items-center my-5 '>
      <label htmlFor='' className='w-40 max-w-xs'>
        {properties.label}
      </label>
      <Component {...properties} dispatchState={dispatchState} />
    </div>
  );
};

export default FormField;
