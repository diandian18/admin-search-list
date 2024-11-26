export const DEFAULT_PAGE_SIZE = 15;
export const DEFAULT_PAGE_NUM = 1;

export const URL_QUERY_PREFIX_COMMON = 'sl_';
export const URL_QUERY_PREFIX_FORM = `${URL_QUERY_PREFIX_COMMON}form_`;
export const URL_QUERY_PREFIX_EXTRA = `${URL_QUERY_PREFIX_COMMON}extra_`;
export const URL_QUERY_PAGE_NUMBER  = `${URL_QUERY_PREFIX_COMMON}pageNumber`;
export const URL_QUERY_PAGE_SIZE = `${URL_QUERY_PREFIX_COMMON}pageSize`;

/**
 * 通过标识符('a.b.c')从一个对象中取值
 * 如果找不到，就会返回defaultValue
 * 示例：pickDataByIdentifier({ a: { b: { c: 'xxx' } } }, 'a.b.c', '')
 */
export function pickDataByIdentifier<T>(obj: Record<string, any>, identifier: string, defaultValue: any): T {
  let notMatchedValue: any;
  const res = identifier.split('.').reduce((pre, next) => {
    if (!pre[next] && !notMatchedValue) {
      notMatchedValue = defaultValue;
    }
    return pre[next] || {};
  }, obj);
  if (notMatchedValue) {
    return notMatchedValue;
  }
  return res as T;
}

export function getKey(key: string) {
  if (key.startsWith(URL_QUERY_PREFIX_FORM)) {
    return key.split(URL_QUERY_PREFIX_FORM)[1];
  }
  return key;
}
