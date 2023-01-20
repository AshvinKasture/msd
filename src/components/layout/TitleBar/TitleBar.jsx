import React from 'react';

const TitleBar = ({ children }) => {
  return (
    <div className='bg-amber-100 py-5 text-3xl text-center align-bottom'>
      {children}
    </div>
  );
};

export default TitleBar;
