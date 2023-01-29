import React from 'react';

const ActionButton = ({
  children,
  className: classes,
  onClick: clickHandler,
}) => {
  return (
    <button
      className={`rounded-md text-white bg-blue-500 px-4 py-2 text-xl font-semibold ${classes}`}
      onClick={clickHandler}
    >
      {children}
    </button>
  );
};

export default ActionButton;
