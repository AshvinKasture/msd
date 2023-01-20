import { Fragment, useState, useContext } from 'react';
import HomePage from './pages/home/Home';
import CreateItemMaster from './pages/itemMaster/CreateItemMaster';
import NotFoundPage from './pages/notFoundPage/NotFoundPage';
import AppContext from './store/appContext';
import Layout from './components/layout/Layout/Layout';

function App() {
  const { page } = useContext(AppContext);

  const PageContent = getPageContent(page);

  return (
    <Layout>
      <PageContent />
    </Layout>
  );
}

function getPageContent(page) {
  const { HOME, CREATE_ITEM_MASTER } = pages;
  switch (page) {
    case HOME:
      return HomePage;
    case CREATE_ITEM_MASTER:
      return CreateItemMaster;
    default:
      return NotFoundPage;
  }
}

export default App;
