import React from 'react';
import { twMerge } from 'tailwind-merge';

const ActionButton = ({
  children,
  className: classes,
  onClick: clickHandler,
}) => {
  const classList = twMerge(
    `rounded-md text-white bg-blue-500 px-4 py-2 text-xl font-semibold  ${classes}`
  );
  // console.log(classList);
  return (
    <button className={classList} onClick={clickHandler}>
      {children}
    </button>
  );
};

export default ActionButton;
