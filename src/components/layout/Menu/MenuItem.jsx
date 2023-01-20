import React, { useContext } from 'react';
import Button from '../../ui/Button';
import AppContext from '../../../store/appContext';

export default function MenuItem({ menuItemData: { text, value, icon } }) {
  const { changePage } = useContext(AppContext);
  const menuItemClickHandler = (e) => {
    changePage(value);
  };
  return (
    <li className=''>
      <Button icon={icon} onClick={menuItemClickHandler}>
        {text}
      </Button>
    </li>
  );
}
