const pages = {
  HOME: 'HOME',
  CREATE_ITEM_MASTER: 'CREATE_ITEM_MASTER',
};

const windowCodes = {
  HOME: 'home',
  ITEM_MASTER_MENU: 'item_master/menu',
  PO_MASTER_MENU: 'po_master/menu',
  VENDOR_MASTER_MENU: 'vendor_master/menu',
  DELIVERY_CHALLAN_MENU: 'delivery_challan/menu',
  MASTER_SHEET: 'master_sheet',
  CREATE_ITEM_MASTER: 'item_master/create',
  VIEW_ITEM_MASTER: 'item_master/view',
  IMPORT_ITEM_MASTER: 'item_master/import',
  CREATE_PO_MASTER: 'po_master/create',
  VIEW_PO_MASTER: 'po_master/view',
  CREATE_VENDOR_MASTER: 'vendor_master/create',
  VIEW_VENDOR_MASTER: 'vendor_master/view',
  CREATE_DELIVERY_CHALLAN: 'delivery_challan/create',
  VIEW_DELIVERY_CHALLAN: 'delivery_challan/menu',
  PAGE1: 'PAGE1',
  PAGE2: 'PAGE2',
};

const comCodes = {
  OPEN_WINDOW: 'OPWN_WINDOW',
  OPEN_EXCEL_FILE: 'OPEN_EXCEL_FILE',
  CREATE_ITEM: 'CREATE_ITEM',
  GET_ITEMS: 'GET_ITEMS',
  GET_ITEM_BY_ID: 'GET_ITEM_BY_ID',
  GET_ITEM_BY_DRAWING_NO: 'GET_ITEM_BY_DRAWING_NO',
  IMPORT_ITEM_MASTER: 'IMPORT_ITEM_MASTER',
  CREATE_PO: 'CREATE_PO',
  GET_ALL_PO: 'GET_ALL_PO',
  GET_ITEMS_OF_PO: 'GET_ITEMS_OF_PO',
  CREATE_VENDOR: 'CREATE_VENDOR',
  GET_VENDORS: 'GET_VENDORS',
  GET_VENDOR_BY_ID: 'GET_VENDOR_BY_ID',
};

module.exports = { windowCodes, pages, comCodes };
