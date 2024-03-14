import React, {useState} from 'react';
import { Button, Modal, DatePicker } from 'antd';
import {PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined} from '@ant-design/icons'
// import TableComponent from '../TableComponent/TableComponent';
import { Space, Table, Tag } from 'antd';
import { WrapperHeader } from './style';
const columns = [
  {
    title: 'Name',
    dataIndex: 'name',
    key: 'name',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'Age',
    dataIndex: 'age',
    key: 'age',
  },
  {
    title: 'Address',
    dataIndex: 'address',
    key: 'address',
  },
  {
    title: 'Tags',
    key: 'tags',
    dataIndex: 'tags',
    render: (_, { tags }) => (
      <>
        {tags.map((tag) => {
          let color = tag.length > 5 ? 'geekblue' : 'green';
          if (tag === 'loser') {
            color = 'volcano';
          }
          return (
            <Tag color={color} key={tag}>
              {tag.toUpperCase()}
            </Tag>
          );
        })}
      </>
    ),
  },
  {
    title: 'Action',
    key: 'action',
    // render: renderAction
  },
];
const data = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
    tags: ['nice', 'developer'],
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
    tags: ['loser'],
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
    tags: ['cool', 'teacher'],
  },
];

const renderAction = (record) => {
    return (
      
    <div style={{ padding: '10px', display: 'flex', flexDirection: 'row'}}>
        
        <div>
            <DeleteOutlined style={{color:'red', fontSize: '30px', cursor: 'pointer'}}/>
        </div>
        <div>
            <EditOutlined style={{color:'green', fontSize: '30px', cursor: 'pointer'}}/>
        </div>
    </div>
    
    )
}

const AdminEvent = () => { 
  return (
    <div>
      <WrapperHeader> Quản lý sự kiện</WrapperHeader>
      <Table columns={columns} dataSource={data} />
    </div>
  )
}

export default AdminEvent;