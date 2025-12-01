import { Ref, useRef, forwardRef, ReactElement, useImperativeHandle } from 'react';
import SearchList, { RefProps, SearchListProps } from '../dist-lib/index';

const data = {
  code: 200,
  message: 'success',
  data: {
    // items: [{ name: 'aaa', age: 18 }, { name: 'bbb', age: 82 }],
    // total: 100,
    items: [],
    total: 0,
  },
};

async function httpGet<Res>(url: string, opts: {
  params: Record<string, Key>;
  headers?: Record<string, Key>;
}) {
  console.log(url);
  console.log(opts);
  return new Promise<Res>((resolve) => {
    setTimeout(() => {
      // @ts-ignore
      resolve(data);
    }, 1000);
  });
}

const SearchListComponentInner = <T extends Record<string, any>, D>(props: Omit<SearchListProps<T, D>, 'httpGet'>, ref: Ref<RefProps<D>>) => {
  const tempRef = useRef<RefProps<D>>(null);
  // @ts-expect-error pass
  useImperativeHandle(ref, () => tempRef.current);

  return (
    <SearchList
      {...props}
      httpGet={httpGet}
      paginationKey={{
        pageSizeKey: 'pageSize',
        pageNumKey: 'pageNum',
      }}
    />
  );
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const SearchListComponent = forwardRef(SearchListComponentInner) as <T extends Record<string, any>, D>(
  props: Omit<SearchListProps<T, D>, 'httpGet'> & { ref?: React.Ref<RefProps<D>> }
) => ReactElement;

export default SearchListComponent;
