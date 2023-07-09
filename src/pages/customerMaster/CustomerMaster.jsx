import React, { Fragment } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import CreateCustomerMaster from './create/CreateCustomerMaster';
import ViewCustomerMaster from './view/ViewCustomerMaster';
import EditCustomerMaster from './edit/EditCustomerMaster';
import DeleteCustomerMaster from './delete/DeleteCustomerMaster';

function CustomerMaster({ type }) {
  const modeContent = {
    CREATE: CreateCustomerMaster,
    VIEW: ViewCustomerMaster,
    EDIT: EditCustomerMaster,
    DELETE: DeleteCustomerMaster,
  };

  const PageContent = modeContent[type];

  return (
    <Fragment>
      <TitleBar>Customer Master</TitleBar>
      <div className='w-2/5  mx-auto mt-24'>
        <PageContent />
      </div>
    </Fragment>
  );
}

export default CustomerMaster;
