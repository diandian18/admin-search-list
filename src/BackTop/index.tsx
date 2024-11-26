import { useCallback } from 'react';
import { SearchListProps } from '../types';
import classNames from 'classnames';
import { FloatButton } from 'antd';
import './index.less';

/**
 * 回到顶部: 
 * (这是一个扩展功能)
 */
const BackTop = <T extends Record<string, any>, D>(props: SearchListProps<T, D>) => {
  const {
    listScroll,
    enableBackTop = false,
    scrollContainer = window as Window,
  } = props;

  const finalBackTopTarget = useCallback(() => {
    if (typeof scrollContainer === 'string') {
      const backTopTargetDom = document.querySelector(scrollContainer) as HTMLElement;
      return backTopTargetDom;
    } else {
      return scrollContainer;
    }
  }, [scrollContainer]);
  
  if (!enableBackTop) return null;

  return (
    <FloatButton.BackTop
      className={classNames('searchList__backtop', {
        listScroll,
      })}
      target={finalBackTopTarget}
      // visibilityHeight={50}
    />
  );
};

export default BackTop;
