import React, { useState } from 'react';
import { Button, Modal, DatePicker, Form } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
// import TableComponent from '../TableComponent/TableComponent';
import InputComponent from '../../InputComponent/InputComponent';
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
const onFinish = () => {
  console.log('finish')
}

const renderAction = (record) => {
  return (

    <div style={{ padding: '10px', display: 'flex', flexDirection: 'row' }}>

      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
      </div>
      <div>
        <EditOutlined style={{ color: 'green', fontSize: '30px', cursor: 'pointer' }} />
      </div>
    </div>

  )
}

const AdminEvent = () => {

  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (
    <div>
      <WrapperHeader> Quản lý sự kiện</WrapperHeader>
      <Button style={{ height: '45px', width: '50px', fontSize: '20px', background: 'white', marginTop: '10px' }} onClick={() => setIsModalOpen(true)}><PlusOutlined /> </Button>
      <Table columns={columns} dataSource={data} />
      <div>
        <div>
          <Modal title="Basic Modal" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
          <Form
                    name="basic"
                    labelCol={{
                        span: 8,
                    }}
                    wrapperCol={{
                        span: 16,
                    }}
                    style={{
                        maxWidth: 600,
                    }}
                    initialValues={{
                        remember: true,
                    }}
                    onFinish={onFinish}
                    autoComplete="off"
                >
                    <Form.Item
                        label="Title"
                        name="title"
                        rules={[
                            {
                                required: true,
                                message: 'Please input title!',
                            },
                        ]}
                    >
                        <InputComponent />
                    </Form.Item>

                    <Form.Item
                        label="caigi do"
                        name="gido"
                        rules={[
                            {
                                required: true,
                                message: 'Please input caigido',
                            },
                        ]}
                    >
                        <InputComponent/>
                    </Form.Item>

                    <Form.Item
                        label="Falcuty"
                        name="falcuty"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <InputComponent/>
                    </Form.Item>

                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                        <Button type="primary" htmlType="submit">
                            Submit
                        </Button>
                    </Form.Item>
                </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default AdminEvent;