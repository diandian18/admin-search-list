import { useState, forwardRef, useImperativeHandle, useMemo, cloneElement } from 'react';
import { useMount, useUpdateEffect } from 'react-use';
import { Button, Spin, Pagination } from 'antd';
import { DEFAULT_PAGE_NUM, DEFAULT_PAGE_SIZE, pickDataByIdentifier } from '@/utils';
import classNames from 'classnames';
import { useStickyBox } from 'react-sticky-box';
import type { ForwardedRef } from 'react';
import { Language, RefProps, SearchParams, SearchListProps } from '@/types';
import { useUrlQuery } from '@/hooks/useUrlQuery';
import BackTop from '@/BackTop';
import { useBackTop, scrollToList, scrollToListTop, getListScrollTop } from '@/BackTop/utils';
import { useScroll } from '@/hooks/useScroll';
import useRefOfCurrentState from '@/hooks/useRefOfCurrentState';
import { SEARCH_LIST_DOM_CLASS, SEARCH_LIST_LANGUAGE } from '@/const';
import './index.less';

/**
 * 可搜索的列表组件
 */
const SearchList = <T extends Record<string, any>, D>(props: SearchListProps<T, D>, ref: ForwardedRef<RefProps<D>>) => {
  const {
    className = '',
    url,
    headers,
    httpGet,
    beforeSearch,
    afterSearch,
    searchForm,
    extraSearchModel,
    formatSearchModel,
    topRender: TopRender,
    searchRender: SearchRender,
    actionRender: ActionRender,
    scrollLoadMode,
    scrollContainer,
    listRender: ListRender,
    beforeListRender: BeforeListRender,
    paginationLeftRender: PaginationLeftRender,
    searchLater = false,
    hidePagination = false,
    paginationProps,
    paginationKey = {},
    searchBtn = ['search', 'reset'],
    searchBtnRender,
    resetBtnRender,
    searchSticky = false,
    identifier = 'data.items',
    identifierTotal = 'data.total',
    listScroll = true,
    willMount,
    language = Language['zh_Hans'],
    locale,
  } = props;

  const {
    pageSizeKey = 'perPage',
    pageNumKey = 'page',
  } = paginationKey;

  const { urlQuery, setUrlQuery } = useUrlQuery(props);
  const [pageNum, setPageNum] = useState(urlQuery?.pageNum ?? DEFAULT_PAGE_NUM); // 当前页数
  const pageNumRef = useRefOfCurrentState(pageNum);
  const [pageSize, setPageSize] = useState(urlQuery?.pageSize ?? (paginationProps?.defaultPageSize ?? DEFAULT_PAGE_SIZE)); // 每页条数
  const [pageTotal, setPageTotal] = useState(0); // 总条数
  const [list, setList] = useState<D[]>([]); // 列表数据
  const listRef = useRefOfCurrentState(list);
  const [loading, setLoading] = useState(true); // loading

  const { scrollTop } = useBackTop(props);
  const stickyRef = useStickyBox();

  /** 收集表单数据，并请求 */
  function fetchList(searchParams?: SearchParams) {
    if (!url) {
      return Promise.reject('Need url param');
    }
    let searchModel = searchForm ? searchForm.getFieldsValue() : {} as T;
    if (extraSearchModel) {
      searchModel = { ...searchModel, ...extraSearchModel };
    }
    if (formatSearchModel) {
      searchModel = formatSearchModel(searchModel) ?? searchModel;
    }
    const query = {
      ...searchModel,
      [pageNumKey]: searchParams?.pageNum ?? pageNum,
      [pageSizeKey]: searchParams?.pageSize ?? pageSize,
    };
    const get = httpGet;
    return get<Record<string, any>>(url, {
      params: query,
      headers,
    });
  }

  /** 搜索和副作用 */
  async function search(searchParams?: SearchParams) {
    if (beforeSearch && !await beforeSearch()) {
      return;
    }
    setLoading(true);
    try {
      const res = await fetchList(searchParams);
      const items = pickDataByIdentifier<D[]>(res, identifier, []);
      const total = pickDataByIdentifier<number>(res, identifierTotal, 0);
      if (!scrollLoadMode) {
        // 如果搜索到的是空的,则再搜上一页
        if (items.length === 0 && pageNumRef.current - 1 >= 1) {
          changePaginationAndsearch(pageNumRef.current - 1);
        } else {
          setList(items);
          setPageTotal(total);
          await afterSearch?.(items);
        }
      } else {
        // 滚动加载模式下，各页数据是累加的
        const newList = pageNumRef.current === 1 ? items : [
          ...listRef.current,
          ...items,
        ];
        setList(newList);
        setPageTotal(total);
        await afterSearch?.(newList);
      }
    } catch (err) {
      console.error(err);
    }
    setLoading(false);
  }

  /** 搜索动作 */
  async function actionSearch(searchParams: SearchParams) {
    await search(searchParams);

    // ========== 一些搜索后的副作用 ==========
    if (!scrollLoadMode) {
      setUrlQuery({
        formValues: searchForm?.getFieldsValue(),
        pageNum: searchParams.pageNum,
        pageSize: searchParams.pageSize,
      });
      scrollTop();
    } else {
      scrollTop();
    }
    // ========== 一些搜索后的副作用 ==========
  }

  /** 根据分页搜索 */
  function changePaginationAndsearch(pageNum: number, pageSize?: number): void {
    setPageNum(pageNum);
    if (pageSize) {
      setPageSize(pageSize);
    }
    actionSearch({ pageNum, pageSize });
  }

  /** 搜索至第一页 */
  function searchFirstPage() {
    changePaginationAndsearch(1, pageSize);
  }

  /** 重置至第一页 */
  function reSearchFirstPage() {
    if (searchForm) {
      searchForm.resetFields();
    }
    searchFirstPage();
  }

  /** 第一次进 */
  useMount(async() => {
    if (willMount) await willMount();
    if (searchLater) {
      setLoading(false);
      return;
    }
    actionSearch({ pageNum, pageSize });
  });

  /** 额外参数的数据变更走点击查询,页码重置为1的逻辑 */
  useUpdateEffect(() => {
    searchFirstPage();
  }, [extraSearchModel]);

  /** 搜索按钮 */
  const SearchBtnRender = searchBtnRender ? cloneElement(searchBtnRender, { onClick: searchFirstPage }) : null; // memo?

  /** 重置按钮 */
  const ResetBtnRender = resetBtnRender ? cloneElement(resetBtnRender, { onClick: reSearchFirstPage }) : null;

  /** 组件ref API */
  useImperativeHandle(ref, () => {
    return {
      search,
      reSearchFirstPage,
      searchFirstPage,
      getData: () => list,
      setData(data: D[]) { setList(data) },
      getPageNum: () => pageNum,
      setPageNum(num: number) { setPageNum(num) },
      getPageSize: () => pageSize,
      setPageSize: (num: number) => { setPageSize(num) },
      getPageTotal: () => pageTotal,
      setPageTotal: (total: number) => { setPageTotal(total) },
      scrollToListTop: () => scrollToListTop(scrollContainer ?? SEARCH_LIST_DOM_CLASS),
      scrollToList: (top: number) => scrollToList(top, scrollContainer ?? SEARCH_LIST_DOM_CLASS),
      getListScrollTop: () => getListScrollTop(scrollContainer ?? SEARCH_LIST_DOM_CLASS),
    };
  });

  /** 滚动加载模式下，是否触底 */
  const isNoMore = useMemo(() => {
    return pageTotal !== 0 && list.length >= pageTotal;
  }, [list.length, pageTotal]);
  const isNoMoreRef = useRefOfCurrentState(isNoMore);

  /** 滚动加载模式下，滚动监听 */
  useScroll({
    wrap: scrollContainer ?? SEARCH_LIST_DOM_CLASS,
    arrivedCb: () => {
      if (!scrollLoadMode || isNoMoreRef.current) return;
      setPageNum(pageNumRef.current + 1);
      search({ pageNum: pageNumRef.current + 1 });
    },
  });

  return (
    <div className={classNames('searchList', className, {
      listScroll,
    })}>
      {/* 顶部区域 */}
      {TopRender &&
        <div className="searchList__top">
          <TopRender />
        </div>
      }
      {/* 搜索区域 */}
      {SearchRender &&
        <div className="searchList__search" ref={searchSticky ? stickyRef : null}>
          <SearchRender
            search={search}
            searchFirstPage={searchFirstPage}
            reSearchFirstPage={reSearchFirstPage}
            SearchBtnComponent={() => (
              <div className="searchList__search-btns">
                {searchBtn.map(item => {
                  if (item === 'reset') {
                    return (
                      <span className="searchList__search-btn" key={item}>
                        {ResetBtnRender ?? <Button onClick={reSearchFirstPage}>{locale?.reset ?? SEARCH_LIST_LANGUAGE[language].reset}</Button>}
                      </span>
                    );
                  } else {
                    return (
                      <span className="searchList__search-btn" key={item}>
                        {SearchBtnRender ?? <Button type="primary" onClick={searchFirstPage}>{locale?.search ?? SEARCH_LIST_LANGUAGE[language].search}</Button>}
                      </span>
                    );
                  }
                })}
              </div>
            )}
          />
        </div>
      }
      {/* 操作区域 */}
      {ActionRender &&
        <div className="searchList__action">
          <ActionRender search={search} />
        </div>
      }
      {/* 列表前区域 */}
      {BeforeListRender &&
        <div className="searchList__beforeList">
          <BeforeListRender search={search} />
        </div>
      }
      {/* 列表区域 */}
      <Spin wrapperClassName={classNames('searchList__loading', {
        listScroll,
      })} spinning={loading}>
        {ListRender && (
          <>
            <ListRender data={list} />
            {scrollLoadMode && isNoMore && <div className="searchList__scrollLoad-nomore">{locale?.noMore ?? SEARCH_LIST_LANGUAGE[language].noMore}</div>}
          </>
        )}
      </Spin>
      {!scrollLoadMode && !hidePagination &&
        <div className="searchList__pagination-wrap">
          <div className="searchList__pagination-afterListRender">
            {PaginationLeftRender &&
              <PaginationLeftRender search={search} />
            }
          </div>
          <Pagination
            className="searchList__pagination"
            current={pageNum}
            pageSize={pageSize}
            total={pageTotal}
            onChange={changePaginationAndsearch}
            pageSizeOptions={['15', '30', '50', '100']}
            showTotal={(total) => `${locale?.total ?? SEARCH_LIST_LANGUAGE[language].total} ${total.toString() ? total : 0} ${locale?.items ?? SEARCH_LIST_LANGUAGE[language].items}`}
            showQuickJumper={true}
            showSizeChanger={true}
            { ...paginationProps }
          />
        </div>
      }
      {/* 回到顶部 */}
      <BackTop {...props} />
    </div>
  );
};

export default forwardRef(SearchList);
