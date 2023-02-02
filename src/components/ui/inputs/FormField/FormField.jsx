import React, { forwardRef } from 'react';

const FormField = forwardRef(
  ({ component: Component, label = '', componentProperties }, ref) => {
    return (
      <div className='flex justify-center items-center my-5'>
        <label className='w-40 max-w-xsd'>{label}</label>
        <Component {...componentProperties} ref={ref} />
      </div>
    );
  }
);

export default FormField;
