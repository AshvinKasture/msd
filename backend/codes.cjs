const pages = {
  HOME: 'HOME',
  ITEM_MASTER: 'ITEM_MASTER',
  CUSTOMER_MASTER: 'CUSTOMER_MASTER',
  PO_MASTER: 'PO_MASTER',
  IMPORT: 'IMPORT',
};

const types = {
  CREATE: 'CREATE',
  VIEW: 'VIEW',
  EDIT: 'EDIT',
  DELETE: 'DELETE',
};

const windowCodes = {
  HOME: 'home',
  ITEM_MASTER_MENU: 'item_master/menu',
  PO_MASTER_MENU: 'po_master/menu',
  CUSTOMER_MASTER_MENU: 'customer_master/menu',
  DELIVERY_CHALLAN_MENU: 'delivery_challan/menu',
  MASTER_SHEET: 'master_sheet',
  CREATE_ITEM_MASTER: 'item_master/create',
  VIEW_ITEM_MASTER: 'item_master/view',
  IMPORT_ITEM_MASTER: 'item_master/import',
  CREATE_PO_MASTER: 'po_master/create',
  VIEW_PO_MASTER: 'po_master/view',
  CREATE_CUSTOMER_MASTER: 'customer_master/create',
  VIEW_CUSTOMER_MASTER: 'customer_master/view',
  CREATE_DELIVERY_CHALLAN: 'delivery_challan/create',
  VIEW_DELIVERY_CHALLAN: 'delivery_challan/menu',
};

const comCodes = {
  OPEN_WINDOW: 'OPWN_WINDOW',
  OPEN_EXCEL_FILE: 'OPEN_EXCEL_FILE',
  CREATE_ITEM: 'CREATE_ITEM',
  GET_ITEMS: 'GET_ITEMS',
  GET_ITEM_DETAILS: 'GET_ITEM_DETAILS',
  EDIT_ITEM: 'EDIT_ITEM',
  DELETE_ITEM: 'DELETE_ITEM',
  IMPORT_ITEM_MASTER: 'IMPORT_ITEM_MASTER',
  CREATE_PO: 'CREATE_PO',
  GET_ALL_PO: 'GET_ALL_PO',
  GET_ITEMS_OF_PO: 'GET_ITEMS_OF_PO',
  GET_PO_DETAILS: 'GET_PO_DETAILS',
  CREATE_CUSTOMER: 'CREATE_CUSTOMER',
  GET_CUSTOMERS: 'GET_CUSTOMERS',
  GET_CUSTOMER_BY_ID: 'GET_CUSTOMER_BY_ID',
  GET_CUSTOMER_BY_NAME: 'GET_CUSTOMER_BY_NAME',
  GET_CUSTOMER_DETAILS: 'GET_CUSTOMER_DETAILS',
  IMPORT_CUSTOMER_MASTER: 'IMPORT_CUSTOMER_MASTER',
};

module.exports = { windowCodes, pages, types, comCodes };
