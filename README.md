# React search list

React component for Creating search list in admin project.

## Install

```shell
npm i -S admin-search-list
```

## Usage

```tsx
import SearchList, { GridAction, GridForm, GridFormItem } from 'admin-search-list';
import 'admin-search-list/dist-lib/style.css';

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
    <SearchList<SearchModel, ListItem>
      url="myHttpGetUrl"
      searchRender={({ SearchBtnComponent }) => {
        return (
          // GridAction, GridForm, GridFormItem are antd helpers for grid layout form
          // They are not necessary
          <GridForm
            form={form}
          >
            <GridFormItem name="name" label="name">
              <Input />
            </GridFormItem>
            <GridFormItem name="age" label="age">
              <Input />
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
          // You can render anything you want
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
```
