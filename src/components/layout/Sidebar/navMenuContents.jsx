const { HOME, CREATE_ITEM_PAGE } = pages;

const navMenu = [
  {
    text: 'Home',
    active: true,
  },
  {
    text: 'Item Master',
    subMenu: [
      {
        text: 'Create',
        pageValue: CREATE_ITEM_PAGE,
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

export default navMenu;
