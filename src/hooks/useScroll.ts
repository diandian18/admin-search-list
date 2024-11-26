import { useEffect } from 'react';

interface UseScrollParams {
  /** 滚动的容器 */
  wrap: string;
  /** 到达底部回调 */
  arrivedCb: () => void;
}

export function useScroll(params: UseScrollParams) {
  const { wrap, arrivedCb } = params;
  useEffect(() => {
    const wrapDom = document.querySelector(wrap);
    let preScrollTop = 0;
    async function onScroll() {
      const { scrollTop, clientHeight, scrollHeight } = wrapDom ?? {};
      if (
        (scrollTop && clientHeight && scrollHeight) &&
        preScrollTop < scrollTop && clientHeight + scrollTop >= scrollHeight
      ) {
        arrivedCb();
      }
      preScrollTop = scrollTop ?? 0;
    }
    wrapDom?.addEventListener('scroll', onScroll);
    return () => {
      wrapDom?.removeEventListener('scroll', onScroll);
    };
  }, []);
}
