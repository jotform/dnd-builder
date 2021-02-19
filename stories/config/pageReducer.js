import { action as _action } from '@storybook/addon-actions';
import { generateId } from '../../src/index';

const findItemById = (itemID, pages) => {
  const page = pages.find(p => p.items.find(item => item.id === itemID));
  if (!page) return null;
  return page.items.find(item => item.id === itemID);
};

export const initialPages = () => [
  {
    id: generateId(),
    items: [],
    order: 1,
  },
];

export const pagesReducer = (state, action) => {
  _action(action.type)(action.payload);
  switch (action.type) {
    case 'onItemAdd':
      return state.map(page => {
        if (page.id === action.payload.pageID) {
          page.items.push(action.payload);
        }
        return page;
      });
    case 'onItemChange':
      return state.map(page => {
        const items = page.items.map(item => {
          if (item.id === action.payload.item.id) {
            return { ...item, ...action.payload.data };
          }
          return item;
        });
        return { ...page, items };
      });
    case 'onItemMove':
      const oldItem = findItemById(action.payload.id, state);
      if (oldItem.pageID === action.payload.pageID) {
        return state.map(page => {
          if (page.id === action.payload.pageID) {
            const items = page.items.map(item => {
              if (item.id === action.payload.id) {
                return { ...item, ...action.payload };
              }
              return item;
            });
            return { ...page, items };
          }
          return page;
        });
      }
      return state.map(page => {
        if (page.id === oldItem.pageID) {
          const items = page.items.filter(item => {
            return item.id !== action.payload.id;
          });
          return { ...page, items };
        }
        if (page.id === action.payload.pageID) {
          page.items.push({ ...oldItem, ...action.payload });
        }
        return page;
      });
    case 'onItemRemove':
      return state.map(page => {
        if (page.id === action.payload.pageID) {
          const items = page.items.filter(item => {
            return item.id !== action.payload.id;
          });
          return { ...page, items };
        }
        return page;
      });
    case 'onItemResize':
      return state.map(page => {
        const items = page.items.map(item => {
          if (item.id === action.payload.item.id) {
            return { ...item, ...action.payload.data };
          }
          return item;
        });
        return { ...page, items };
      });
    case 'onPageAdd':
      const emptyPage = {
        id: generateId(),
        items: [],
      };
      return [
        ...state.slice(0, action.payload - 1),
        emptyPage,
        ...state.slice(action.payload - 1),
      ].map((page, key) => ({ ...page, order: key + 1 }));
    case 'onPageDuplicate':
      const newPageID = generateId();
      const newPage = {
        ...action.payload,
        id: newPageID,
        items: action.payload.items.map(item => ({
          ...item,
          id: generateId(),
          pageID: newPageID,
        })),
      };
      return [
        ...state.slice(0, newPage.order),
        newPage,
        ...state.slice(newPage.order),
      ].map((page, key) => ({ ...page, order: key + 1 }));
    case 'onPageChange':
      console.warn('Currently unavailable! // Sercan will write!');
      return state;
    case 'onPageRemove':
      return state.filter(page => page.id !== action.payload);
    case 'onPageOrdersChange':
      return state.map(page => {
        const newOrder = action.payload[page.id];
        return { ...page, order: newOrder.order };
      });
    default:
      throw new Error();
  }
};
