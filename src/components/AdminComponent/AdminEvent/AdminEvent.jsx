import React, { useState } from 'react';
import { Button, Modal, DatePicker, Form, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import InputComponent from '../../InputComponent/InputComponent';
import { WrapperHeader } from './style';
import { WrapperAction } from '../AdminUser/style';
import TableComponent from '../../TableComponent/TableComponent';

const { RangePicker } = DatePicker;
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
    title: 'Action',
    key: 'action',
    render: renderAction
  },
];
const dataSource = [
  {
    key: '1',
    name: 'John Brown',
    age: 32,
    address: 'New York No. 1 Lake Park',
  },
  {
    key: '2',
    name: 'Jim Green',
    age: 42,
    address: 'London No. 1 Lake Park',
  },
  {
    key: '3',
    name: 'Joe Black',
    age: 32,
    address: 'Sydney No. 1 Lake Park',
  },
];

const handleButtonClick = (e) => {
  message.info('Click on left button.');
  console.log('click left button', e);
};
const handleMenuClick = (e) => {
  message.info('Click on menu item.');
  console.log('click', e);
};
const items = [
  {
    label: 'IT',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: 'Design',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: 'Marketing',
    key: '3',
    icon: <UserOutlined />,
    danger: true,
  },
  {
    label: 'Business',
    key: '4',
    icon: <UserOutlined />,
    danger: true,
    disabled: true,
  },
];
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const onFinish = () => {
  console.log('finish')
}

const AdminEvent = () => {
  const [stateEvent, setStateEvent] = useState({
    name: '',
    email: '',
    password: '',
    role: '',
    faculty: ''
})
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };

  return (

    <div style={{ padding: '30px' }}>
      <WrapperHeader><p>Quản lý Sự Kiện</p></WrapperHeader>
      <WrapperAction>
        <div style={{
          paddingLeft: '20px'
        }}>
          <Button style={{ width: '100px' }} type="primary" onClick={showModal}>Add</Button>
        </div>
        <div style={{
          paddingLeft: '20px'
        }}>
          <Button style={{ width: '100px' }} danger>Delete</Button>
        </div>
      </WrapperAction>
      <div>
        <TableComponent dataSource={dataSource} columns={columns} />
      </div>
      <div>
        <div>
          <Modal title="Thêm Sự Kiện" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                label="Time start"
                name="time"
                rules={[
                  {
                    required: true,
                    message: 'Please input Time!',
                  },
                ]}
              >
                <Space direction="vertical" size={12}>
                  <DatePicker showTime placeholder='Open Date' />
                </Space>
              </Form.Item>
              <Form.Item
                label="Times"
                name="time"
                rules={[
                  {
                    required: true,
                    message: 'Please input Time!',
                  },
                ]}
              >
                <Space direction="vertical" size={12}>
                  <RangePicker showTime placeholder={['First close date', 'Final close date']} />
                </Space>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>
  )
}

export default AdminEvent;