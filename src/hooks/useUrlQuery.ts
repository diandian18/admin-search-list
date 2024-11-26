import { useCallback, useEffect, useMemo } from 'react';
import { SearchListProps } from '../types';
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, URL_QUERY_PAGE_NUMBER, URL_QUERY_PAGE_SIZE, URL_QUERY_PREFIX_FORM, getKey } from '../utils';

interface UrlQueryObj<T extends Record<string, any>> {
  pageNum?: number;
  pageSize?: number;
  formValues?: T;
}

/**
 * 同步请求参数到url上: 
 * (这是一个扩展功能)
 */
export function useUrlQuery<T extends Record<string, any>, D>(props: SearchListProps<T, D>) {
  const {
    scrollLoadMode,
    syncUrl,
    formatSearchModel,
    formatUrlQuery,
    paginationProps,
    searchForm,
  } = props;
  const urlQuery = useMemo(() => {
    // 滚动加载模式下，初始化参数固定
    if (scrollLoadMode) {
      return {
        pageNum: paginationProps?.defaultCurrent ?? DEFAULT_PAGE_NUM,
        pageSize: paginationProps?.defaultPageSize ?? DEFAULT_PAGE_SIZE,
        formValues: {} as T,
      };
    }
    if (syncUrl) {
      const url = new URL(window.location.href);
      const entries = url.searchParams.entries();
      const formValues = {};
      let pageNum = paginationProps?.defaultCurrent ?? DEFAULT_PAGE_NUM;
      let pageSize = paginationProps?.defaultPageSize ?? DEFAULT_PAGE_SIZE;
      for (const [key, value] of entries) {
        if (key.startsWith(URL_QUERY_PREFIX_FORM)) {
          // @ts-expect-error pass
          formValues[getKey(key)] = value;
        } else if (key === URL_QUERY_PAGE_NUMBER) {
          pageNum = Number(value);
        } else if (key === URL_QUERY_PAGE_SIZE) {
          pageSize = Number(value);
        }
      }
      return {
        pageNum,
        pageSize,
        formValues: formatUrlQuery?.(formValues) ?? formValues,
      };
    }
  }, [scrollLoadMode, syncUrl, paginationProps?.defaultCurrent, paginationProps?.defaultPageSize, formatUrlQuery]);

  /**
   * 组件初始化时
   * pageNum和pageSize通过useState初始化
   * form通过这里初始化
   */
  useEffect(() => {
    if (syncUrl) {
      searchForm?.setFieldsValue(urlQuery?.formValues ?? {});
    }
  }, [searchForm, syncUrl, urlQuery?.formValues]);

  /** 在搜索时调用以把参数映射到url上 */
  const setUrlQuery = useCallback(function setUrlQuery(urlQuery: UrlQueryObj<T>) {
    if (!syncUrl) return;
    const url = new URL(window.location.href);
    const retUrl = new URL(window.location.href);
    if (urlQuery.pageNum) {
      retUrl.searchParams.set(URL_QUERY_PAGE_NUMBER, `${urlQuery.pageNum}`);
    }
    if (urlQuery.pageSize) {
      retUrl.searchParams.set(URL_QUERY_PAGE_SIZE, `${urlQuery.pageSize}`);
    }
    let { formValues } = urlQuery;
    if (formValues) {
      formValues = formatSearchModel?.(formValues) ?? formValues;

      // url上存在,但form里不存在的,则在url上删除之
      const entries = url.searchParams.entries();
      for (const [key] of entries) {
        if (key.startsWith(URL_QUERY_PREFIX_FORM) && !formValues?.[getKey(key)]) {
          retUrl.searchParams.delete(key);
        }
      }

      // form里没值或者值是''的,则url上删除
      // form里有值的,则url上设置
      for (const key in formValues) {
        const value = formValues[key];
        if (value !== undefined && value !== null && value !== '') {
          retUrl.searchParams.set(`${URL_QUERY_PREFIX_FORM}${key}`, value);
        } else {
          retUrl.searchParams.delete(`${URL_QUERY_PREFIX_FORM}${key}`);
        }
      }
    }
    if (retUrl.href !== window.location.href) {
      window.history.replaceState(null, '', retUrl.href);
    }
  }, [formatSearchModel, syncUrl]);

  return {
    /** url上的form参数 */
    urlQuery,
    /** 在搜索时调用以把参数映射到url上 */
    setUrlQuery,
  };
}
