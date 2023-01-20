import React from 'react';

const ActionButton = ({
  children,
  className: classes,
  clickHandler,
  tabIndex,
  reference,
}) => {
  return (
    <button
      className={`border-2 rounded-md text-white bg-blue-500 px-4 py-2 text-xl font-semibold ${classes}`}
      onClick={clickHandler}
      tabIndex={tabIndex}
      ref={reference}
    >
      {children}
    </button>
  );
};

export default ActionButton;
