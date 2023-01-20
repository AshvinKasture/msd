import React, { useState, createContext } from 'react';

const { HOME, CREATE_ITEM_MASTER } = pages;

const AppContext = createContext({
  page: '',
  appName: '',
  changePage: (pageName) => {},
  navMenu: [],
  // pages: {HOME, CREATE_ITEM_MASTER}
});

export const AppContextProvider = ({ children }) => {
  const { HOME, CREATE_ITEM_MASTER } = pages;
  const navMenu = [
    {
      text: 'Home',
      active: true,
      pageValue: HOME,
    },
    {
      text: 'Item Master',
      subMenu: [
        {
          text: 'Create',
          pageValue: CREATE_ITEM_MASTER,
        },
        {
          text: 'View',
        },
        {
          text: 'Modify',
        },
        {
          text: 'Delete',
        },
        {
          text: 'Import',
        },
      ],
    },
    {
      text: 'PO Master',
      subMenu: [
        {
          text: 'Create',
        },
        {
          text: 'View',
        },
        {
          text: 'Modify',
        },
        {
          text: 'Delete',
        },
      ],
    },
    {
      text: 'Delivery Challan',
      subMenu: [
        {
          text: 'Create',
        },
        {
          text: 'View',
        },
        {
          text: 'Modify',
        },
        {
          text: 'Delete',
        },
      ],
    },
    {
      text: 'Master Sheet',
    },
    {
      text: 'Exit',
    },
  ];
  const [page, setPage] = useState(pages.HOME);
  const appName = 'Monthly Schedule and Dispatch';

  const changePage = (pageName) => {
    setPage(pageName);
  };

  pageModule.listenPageChanges(changePage);

  return (
    <AppContext.Provider
      value={{
        page,
        changePage,
        appName,
        navMenu,
        // pages: { HOME, CREATE_ITEM_MASTER },
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export default AppContext;
