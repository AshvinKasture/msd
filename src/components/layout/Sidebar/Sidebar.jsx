import React, { useContext } from 'react';
import NavTree from '../NavTree/NavTree';
import AppContext from '../../../store/appContext';

const Sidebar = () => {
  const { navMenu } = useContext(AppContext);
  // console.log(navMenu);
  return (
    <div className='bg-zinc-700 text-white basis-2/12 p-2 '>
      <div className='font-bold my-5 text-4xl tracking-widest'>MSD</div>
      <NavTree navTree={navMenu} />
    </div>
  );
};

export default Sidebar;
