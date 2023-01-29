import React, { useContext } from 'react';
import AppContext from '../../store/appContext';

export default function Home() {
  const { appName, setContentSpinner } = useContext(AppContext);
  setContentSpinner(false);
  return (
    <div className='text-6xl font-bold text-center text-gray-400 h-full flex flex-col justify-center gap-y-5 font-serif'>
      <div>Monthly</div>
      <div>Schedule</div>
      <div>and</div>
      <div>Dispatch</div>
    </div>
  );
}
