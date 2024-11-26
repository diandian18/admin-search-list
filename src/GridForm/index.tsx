import { Col, GetProps, Row, Form } from 'antd';
import { PropsWithChildren } from 'react';
import './index.less';

type FormProps<T> = GetProps<typeof Form<T>>;

export const GridForm: <T>(props: PropsWithChildren<FormProps<T>>) => JSX.Element = (props) => {
  return (
    <Form
      // form={form}
      // layout={inSize(AntdGridSize.md) ? 'vertical' : 'horizontal'}
      // layout="horizontal" // 默认，不用设
      // labelCol={labelCol}
      // wrapperCol={wrapperCol}
      // labelAlign="right"
      {...props}
    >
      <Row gutter={24}>
        {props.children}
      </Row>
    </Form>
  );
};

const spanStyle = {
  xs: 24,
  sm: 24,
  md: 12,
  lg: 8,
  xl: 8,
  xxl: 6,
};
const { Item } = Form;
type FormItemProps = GetProps<typeof Item>;

export const GridFormItem = (props: PropsWithChildren<FormItemProps>) => {
  return (
    <Col {...spanStyle}>
      <Item {...props}>
        {props.children}
      </Item>
    </Col>
  );
};

export const GridAction = (props: PropsWithChildren) => {
  return (
    <div className="search-list__grid-action" {...spanStyle}>
      {props.children}
    </div>
  );
};
