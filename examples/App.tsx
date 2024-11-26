import { Button, Form, Input, Table } from 'antd';
import SearchListComponent from './SearchListComponent';
import { GridAction, GridForm, GridFormItem } from '../dist-lib/index';

import '../dist-lib/style.css';

interface SearchModel {
  name: string;
  age: number;
}

interface ListItem {
  name: string;
  age: number;
}

const columns = [
  {
    title: 'name',
    dataIndex: 'name',
    key: 'name',
  },
  {
    title: 'age',
    dataIndex: 'age',
    key: 'age',
  },
];

const App = () => {
  const [form] = Form.useForm<SearchModel>();
  return (
    <SearchListComponent<SearchModel, ListItem>
      url="xxxx"
      searchRender={({ SearchBtnComponent }) => {
        return (
          <GridForm
            form={form}
          >
            <GridFormItem name="name" label="姓名">
              <Input placeholder="输入姓名" />
            </GridFormItem>
            <GridFormItem name="age" label="年龄">
              <Input placeholder="输入年龄" />
            </GridFormItem>
            <SearchBtnComponent />
            <GridAction>
              <Button type="primary">新增</Button>
              <Button type="primary">编辑</Button>
            </GridAction>
          </GridForm>
        );
      }}
      listRender={({ data }) => {
        return (
          <Table
            bordered
            dataSource={data}
            columns={columns}
            pagination={false}
            key="name"
            rowKey="name"
          />
        );
      }}
    />
  );
}

export default App;
