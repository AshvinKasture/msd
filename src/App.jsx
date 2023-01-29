import { Fragment, useState, useContext } from 'react';
import HomePage from './pages/home/Home';
import ItemMaster from './pages/itemMaster/ItemMaster';
import VendorMaster from './pages/vendorMaster/VendorMaster';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';
import AppContext from './store/appContext';
import Layout from './components/layout/Layout/Layout';
import Import from './pages/import/Import';

function App() {
  const { page } = useContext(AppContext);
  const { type } = useContext(AppContext);

  const PageContent = getPageContent(page);

  return (
    <Layout>
      <PageContent type={type} />
    </Layout>
  );
}

function getPageContent(page) {
  const { HOME, ITEM_MASTER, VENDOR_MASTER, IMPORT } = pages;
  switch (page) {
    case HOME:
      return HomePage;
    case ITEM_MASTER:
      return ItemMaster;
    case VENDOR_MASTER:
      return VendorMaster;
    case IMPORT:
      return Import;
    default:
      return NotFoundPage;
  }
}

export default App;
