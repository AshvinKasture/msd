import React, { useContext } from 'react';
import NavTree from '../NavTree/NavTree';
import AppContext from '../../../store/appContext';

const Sidebar = () => {
  const { navMenu } = useContext(AppContext);
  return (
    <div className='bg-zinc-700 text-white w-60 p-2 relative'>
      <div className='fixed top-0'>
        <div className='font-bold my-5 text-4xl tracking-widest'>MSD</div>
        <NavTree navTree={navMenu} />
      </div>
    </div>
  );
};

export default Sidebar;
