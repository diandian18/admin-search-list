import { useCallback } from 'react';
import { SearchListProps } from '../types';
import { SEARCH_LIST_DOM_CLASS } from '../const';

export function useBackTop<T extends Record<string, any>, D>(props: SearchListProps<T, D>) {
  const {
    listScroll,
    scrollToTop,
  } = props;

  const scrollTop = useCallback(function scrollTop() {
    if (listScroll) {
      scrollToListTop();
    } else {
      scrollToTop?.();
    }
  }, [scrollToTop, listScroll]);

  return {
    /** 滚动到顶部 */
    scrollTop,
  };
}

export function getListScrollTop() {
  const scrollTop = document.querySelector(SEARCH_LIST_DOM_CLASS)!.scrollTop;
  return scrollTop;
}
export function scrollToList(top: number) {
  document.querySelector(SEARCH_LIST_DOM_CLASS)?.scrollTo({ top });
}
export function scrollToListTop() {
  scrollToList(0);
}