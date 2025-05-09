# Admin search list

React component for Creating search list in admin project.

## Features

- Encapsulates most of the logic (collecting search data, searching, resetting, pagination, scroll loading, requests, etc.), requiring only a url, search area, and list area at minimum. Essentially, you only need to write the styles.
- The search area is responsive, adapting to devices of various widths. You can simply place styled components without much thought.
- The list area can render any element, whether it's tables, lists, cards, or other components.
- Supports both scroll loading and pagination bar modes.
- Automatically synchronizes pagination data to the URL, preserving pagination state upon page refresh.
- Supports sticky search areas and sticky table headers.
- Executes searches when external parameters change, useful for using data outside the component as search criteria.
- Supports formatting search parameters.
- Allows customization of search and reset button styles.
- Supports delayed requests, useful for not loading data immediately when the page loads.
- Includes a back-to-top feature.
- Supports prefilling some search data before the component loads.
- Allows for custom multilingual support.
- Complete TypeScript type hints.

[📒Documentation](https://doc.react-antd-console.site/development/search-list.html#%E7%BB%84%E4%BB%B6%E6%B3%9B%E5%9E%8B) | [🔗Live Preview](https://template.react-antd-console.site/table/tablePage)

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
