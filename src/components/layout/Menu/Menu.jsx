import React from 'react';
import MenuItem from './MenuItem';

export default function Menu({ data }) {
  return (
    <ul className='flex w-1/3 mx-auto justify-evenly'>
      {data.map((menuItemData) => (
        <MenuItem key={menuItemData.value} menuItemData={menuItemData} />
      ))}
    </ul>
  );
}
