import React from 'react';
import Sidebar from '../Sidebar/Sidebar';

const Layout = ({ children }) => {
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='h-ful basis-10/12'>{children}</div>
    </div>
  );
};

export default Layout;
