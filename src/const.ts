import { Language, Locale } from './types';

export const SEARCH_LIST_DOM_CLASS = '.searchList__loading';

export const SEARCH_LIST_LANGUAGE: Record<string | Language, Locale> = {
  [Language.en]: {
    search: 'Search',
    reset: 'Reset',
    noMore: 'No more',
    total: 'Total',
    items: 'items',
  },
  [Language.zh_Hans]: {
    search: '查询',
    reset: '重置',
    noMore: '没有更多',
    total: '共',
    items: '条',
  },
};
