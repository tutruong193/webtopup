import React, { useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { WrapperHeader } from '../StudentPostBlog/style';
import { WrapperAction } from '../StudentPostBlog/style';
import TableComponent from '../../TableComponent/TableComponent';


const columns = [
  {
    title: 'Title',
    dataIndex: 'title',
    key: 'title',
    render: (text) => <a>{text}</a>,
  },
  {
    title: 'File Submissions',
    dataIndex: 'file',
    key: 'file',
    render: (file) => <a>{file}</a>,
  },
  {
    title: 'Due date',
    dataIndex: 'duedate',
    key: 'duedate',
  },
  {
    title: 'Thời gian đăng bài',
    dataIndex: 'timedangbai',
    key: 'timeremaining',
  },
  {
    title: 'Status',
    dataIndex: 'status',
    key: 'status',
  },
  {
    title: 'Comment',
    dataIndex: 'comment',
    key: 'comment',
  },
];
const dataSource = [
  {
    key: '1',
    title: 'Bài đăng về thế giới',
    file: 'abcxyz.pdf',
    duedate: '23:59  21/04/2024',
    timedangbai: '13:59 20/04/2024',
    status: "Đã Duyệt",
    comment: "This is a comment"
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
    label: 'Bài đăng về thế giới',
    key: '1',
    icon: <UserOutlined />,
  },
  {
    label: 'Học Tập Khoa Học Máy Tính Để Đổi Đời?',
    key: '2',
    icon: <UserOutlined />,
  },
  {
    label: 'Kinh Tế Vi Mô',
    key: '3',
    icon: <UserOutlined />,

  },
  {
    label: 'Vẽ Đẹp Sẽ Học Design Tốt?',
    key: '4',
    icon: <UserOutlined />,
  },
];
const menuProps = {
  items,
  onClick: handleMenuClick,
};
const onFinish = () => {
  console.log('finish')
}
const StudentPostBlog = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {

  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };

  const { Search } = Input;
  const suffix = (
    <AudioOutlined
      style={{
        fontSize: 16,
        color: '#1677ff',
      }}
    />
  );
  const onSearch = (value, _e, info) => console.log(info?.source, value);

  return (
    <div>
      <WrapperHeader><p>Danh sách bài đăng</p></WrapperHeader>
      <WrapperAction>
        <div style={{
          paddingLeft: '20px'
        }}>
          <Button style={{ width: '100px' }} type="primary" onClick={showModal}>Add</Button>
        </div>
        <div style={{
          paddingLeft: '20px'
        }}>
          <Button style={{ width: '100px' }} danger >Delete</Button>
        </div>
      </WrapperAction>
      <div>
        <Space direction="vertical">
          <Search
            placeholder="Search by title"
            onSearch={onSearch}
            style={{
              width: 200,
            }}
          />
        </Space>
      </div>
      <div>
        <TableComponent dataSource={dataSource} columns={columns} />
      </div>
      <div>
        <div>
          <Modal title="Thêm Bài Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                label="Upload File"
                name="btnuploadfile"
                rules={[
                  {
                    required: true,
                    message: 'Please input File!',
                  },
                ]}
              >
                <Button style={{ width: '100px' }} type="primary" >Input Here</Button>
              </Form.Item>
              <Form.Item
                label="Chủ Đề"
                name="chude"
                rules={[
                  {
                    required: true,
                    message: 'Please choose title',
                  },
                ]}
              >
                <Dropdown menu={menuProps}>
                  <Button>
                    <Space>

                      <DownOutlined />
                    </Space>
                  </Button>
                </Dropdown>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>

  )
}

export default StudentPostBlog
