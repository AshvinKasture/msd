import CreateItemMaster from './pages/itemMaster/create/CreateItemMaster';
const { CREATE_ITEM_MASTER, ITEM_MASTER } = PAGES;

export default function mapPage(pageName) {
  switch (pageName) {
    case CREATE_ITEM_MASTER:
      return CreateItemMaster;
    default:
      console.error('No page found');
  }
}
