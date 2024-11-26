import SearchList, { SearchListProps } from '../dist-lib/index';

const data = {
  code: 200,
  message: 'success',
  data: {
    items: [{ name: 'aaa', age: 18 }, { name: 'bbb', age: 82 }],
    total: 100,
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


const SearchListComponent = <T extends Record<string, any>, D>(props: Omit<SearchListProps<T, D>, 'httpGet'>) => {
  return (
    <SearchList
      {...props}
      httpGet={httpGet}
    />
  );
};

export default SearchListComponent;
