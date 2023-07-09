import React, { Fragment } from 'react';
import TitleBar from '../../components/layout/TitleBar/TitleBar';
import CreateItemMaster from './create/CreateItemMaster';
import ViewItemMaster from './view/ViewItemMaster';
import EditItemMaster from './edit/EditItemMaster';
import DeleteItemMaster from './delete/DeleteItemMaster';

function ItemMaster({ type }) {
  const modeContent = {
    CREATE: CreateItemMaster,
    VIEW: ViewItemMaster,
    EDIT: EditItemMaster,
    DELETE: DeleteItemMaster,
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

export default ItemMaster;
