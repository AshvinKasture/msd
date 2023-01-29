import React, { useState, useContext } from 'react';
import Tree from './Tree';
import AppContext from '../../../store/appContext';

const NodeItem = ({
  children: { text, pageValue, type, subMenu: subTree, active = false },
}) => {
  const [showSubTree, setShowSubTree] = useState(false);

  const { changePage } = useContext(AppContext);

  const clickHandler = (e) => {
    if (subTree) {
      toggleSubTree();
    } else {
      changePage(pageValue, type);
    }
  };

  const toggleSubTree = () => {
    setShowSubTree((prev) => {
      return !prev;
    });
  };
  return (
    <li className='my-2'>
      ---
      <button
        className={`cursor-default hover:underline text-gray-300 ${
          active &&
          'text-white font-semibold underline underline-offset-4 hover:cursor-pointer'
        }`}
        onClick={clickHandler}
      >
        {text}
      </button>
      {subTree && showSubTree && <Tree tree={subTree} rootTree={false} />}
    </li>
  );
};

export default NodeItem;
