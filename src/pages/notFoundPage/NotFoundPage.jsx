import React, { useContext } from 'react';
import AppContext from '../../store/appContext';

export default function NotFoundPage() {
  const { page } = useContext(AppContext);
  return <div>NotFoundPage for {page}</div>;
}
