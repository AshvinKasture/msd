import React, { Fragment } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import CreatePoMaster from './create/CreatePoMaster';
import ViewPoMaster from './view/viewPoMaster';
// import ViewPoMaster from './view/ViewPoMaster';
// import EditPoMaster from './edit/EditPoMaster';
// import DeletePoMaster from './delete/DeletePoMaster';

function PoMaster({ type }) {
  const modeContent = {
    CREATE: CreatePoMaster,
    VIEW: ViewPoMaster,
    // EDIT: EditPoMaster,
    // DELETE: DeletePoMaster,
  };
  const PageContent = modeContent[type];
  return (
    <Fragment>
      <TitleBar>Item Master</TitleBar>
      <div className='w-2/5  mx-auto mt-24'>
        <PageContent />
      </div>
    </Fragment>
  );
}

export default PoMaster;
