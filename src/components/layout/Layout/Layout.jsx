import React, { useContext } from 'react';
import Sidebar from '../Sidebar/Sidebar';
import ContentSpinner from '../../ui/ContentSpinner';
import AppContext from '../../../store/appContext';

const Layout = ({ children }) => {
  const { contentSpinner } = useContext(AppContext);
  return (
    <div className='flex min-h-screen'>
      <Sidebar />
      <div className='w-full relative'>
        {contentSpinner && <ContentSpinner />}
        {children}
      </div>
    </div>
  );
};

export default Layout;
