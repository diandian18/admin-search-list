import { PaginationProps } from 'antd';
import { ComponentType, FC, ReactElement } from 'react';

/** 重写React.forwardRef类型，以支持泛型组件 */
declare module 'react' {
  function forwardRef<P, R>(
    render: (props: React.PropsWithChildren<P>, ref: React.ForwardedRef<R>) => React.ReactElement | null
  ): (props: P & React.RefAttributes<R>) => React.ReactElement | null
}

/** 请求方法类型 */
export type HttpGet = <Res>(url: string, options: {
  params: Record<string, Key>;
  headers?: Record<string, Key>;
}) => Promise<Res>;

/** 表单属性 */
export interface FormProps<T> {
  getFieldsValue: () => T;
  setFieldsValue: (values: Partial<T>) => void;
  resetFields: () => void;
}

/**
 * 列表页组件props类型: 
 * 泛型T为搜索表单对象的类型，泛型D为列表数据的类型 
 */
export interface SearchListProps<T extends Record<string, any>, D> {
  className?: string;
  /** 列表数据请求地址 */
  url: string;
  /** 请求头 */
  headers?: Record<string, string>;
  /** 请求方法 */
  httpGet: HttpGet;
  /** 请求前钩子，返回boolean决定是否执行搜索 */
  beforeSearch?: () => boolean | Promise<boolean>;
  /** 请求后钩子 */
  afterSearch?: (data: D[]) => void | Promise<void>;
  /**
   * form表单对象
   * 可以是antd的const [form] = Form.useForm();
   */
  searchForm?: FormProps<T>;
  /**
   * 额外的查询参数，
   * 当该参数变化时自动执行搜索至第一页
   */
  extraSearchModel?: Record<string, any>;

  // 因不希望SearchList多一个泛型,所以格式化后的值类型简化为any
  /**
   * 请求前对数据格式化
   * @param searchModel 搜索表单对象
   */
  formatSearchModel?: (searchModel: T) => any;
  /** 顶部区域渲染组件 */
  topRender?: ComponentType;
  /** 搜索区域渲染组件 */
  searchRender?: ComponentType<{
    /** 搜索当前页 */
    search: (searchParams?: SearchParams) => void;
    /** 搜索至首页 */
    searchFirstPage: () => void;
    /** 重置至首页 */
    reSearchFirstPage: () => void;
    /** 搜索按钮组件 */
    SearchBtnComponent: FC;
  }>;
  /** 操作区域渲染组件 */
  actionRender?: ComponentType<{
    search: (searchParams?: SearchParams) => void;
  }>;
  /** 列表前区域渲染组件 */
  beforeListRender?: ComponentType<{
    search: (searchParams?: SearchParams) => void;
  }>;
  /** 分页左侧区域渲染组件 */
  paginationLeftRender?: ComponentType<{
    search: (searchParams?: SearchParams) => void;
  }>;
  /** listRender区域使用滚动加载模式 */
  scrollLoadMode?: boolean;
  /** 滚动容器, 影响滚动加载模式和回到顶部 */
  scrollContainer?: string;
  /** 列表区域渲染组件 */
  listRender?: ComponentType<{
    /** 搜索返回的列表数据 */
    data: D[];
  }>;
  /** 是否在初始化时搜索 */
  searchLater?: boolean;
  /** 是否隐藏分页。在滚动加载模式下，将无视本属性，分页会被强制隐藏 */
  hidePagination?: boolean;
  /** antd PaginationProps分页组件props */
  paginationProps?: PaginationProps;
  /** 搜索、重置按钮配置 */
  searchBtn?: ('search' | 'reset')[];
  /** 搜索按钮 */
  searchBtnRender?: ReactElement;
  /** 搜索吸顶，仅在非listScroll模式下生效 */
  searchSticky?: boolean;
  /** 重置按钮 */
  resetBtnRender?: ReactElement;
  /** 根据标示，从后端返回数据中拿到列表数据 */
  identifier?: string;
  /** 根据标示，从后端返回数据中拿到列表数据total */
  identifierTotal?: string;
  /** 列表固定一屏高度，并滚动。在滚动加载模式下, 该参数无效 */
  listScroll?: boolean;
  /**
   * 滚动到顶部
   * 在非listScroll模式下，在搜索(除了search api)后会滚顶
   * 在listScroll模式下，不需要设置该值，会自动处理
   */
  scrollToTop?: () => void;
  /** 回到顶部 */
  enableBackTop?: boolean;
  /** 回到顶部滚动容器 */
  backTopTarget?: string | HTMLElement;
  /**
   * searchList组件将要渲染，
   * 或者说该组件所有逻辑执行前的一个钩子，
   * 可用于根据页面url的query，在搜索前预设好一些搜索项
   */
  willMount?: (() => void) | (() => Promise<void>);
  /** 搜索和分页 参数是否同步在url query中 */
  syncUrl?: boolean;
  /** 
   * syncUrl时, 若设置了formatSearchModel, 则需要设置此方法, 用以将url上的formValues格式化为form需要的值
   * @param formValues url上关于搜索表单的值
   */
  formatUrlQuery?: (formValues: Record<string, any>) => T;
  language?: Language | string;
  /** 国际化 */
  locale?: Locale;
}

export interface Locale {
  /** 搜索按钮文本 */
  search?: string;
  /** 重置按钮文本 */
  reset?: string;
  noMore?: string;
  total?: string;
  items?: string;
}

export enum Language {
  en = 'en',
  zh_Hans = 'zh_Hans',
}

export interface SearchParams {
  pageNum?: number;
  pageSize?: number;
}

/** 组件ref属性 */
export interface RefProps<D> {
  /** 搜索至指定页, 不传为当前页 */
  search: (searchParams?: SearchParams) => Promise<void>;
  /** 重置至第一页 */
  reSearchFirstPage: () => void;
  /** 搜索至第一页 */
  searchFirstPage: () => void;
  /** 获取搜索到的数据 */
  getData: () => D[];
  /** 手动设置搜索到的数据 */
  setData: (data: D[]) => void;
  /** 获取当前页码 */
  getPageNum: () => number;
  /** 获取当前是第几页 */
  setPageNum: (num: number) => void;
  /** 获取总数 */
  getPageTotal: () => number;
  /** 设置总数 */
  setPageTotal: (total: number) => void;
  /** 获取一页的数据量 */
  getPageSize: () => number;
  /** 设置一页的数据量 */
  setPageSize: (num: number) => void;
  /** 滚动到列表顶部，仅在listScroll模式下生效 */
  scrollToListTop: () => void;
  /** 滚动到列表，仅在listScroll模式下生效 */
  scrollToList: (top: number) => void;
  /** 获取当前列表的scrollTop，仅在listScroll模式下生效 */
  getListScrollTop: () => number;
}
