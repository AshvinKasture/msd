import { Fragment, useState, useContext } from 'react';
import HomePage from './pages/home/Home';
import ItemMaster from './pages/itemMaster/ItemMaster';
import CustomerMaster from './pages/customerMaster/CustomerMaster';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';
import AppContext from './store/appContext';
import Layout from './components/layout/Layout/Layout';
import Import from './pages/import/Import';
import PoMaster from './pages/poMaster/PoMaster';
import TestPage from './pages/testPage/TestPage';

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
  const { HOME, ITEM_MASTER, CUSTOMER_MASTER, PO_MASTER, IMPORT } = pages;
  switch (page) {
    case HOME:
      return HomePage;
    case ITEM_MASTER:
      return ItemMaster;
    case CUSTOMER_MASTER:
      return CustomerMaster;
    case PO_MASTER:
      return PoMaster;
    case IMPORT:
      return Import;
    case 'TEST_PAGE':
      return TestPage;
    default:
      return NotFoundPage;
  }
}

export default App;
