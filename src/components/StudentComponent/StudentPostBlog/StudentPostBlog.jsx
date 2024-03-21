import React, { useEffect, useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined, InboxOutlined } from '@ant-design/icons'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { WrapperHeader } from '../StudentPostBlog/style';
import { WrapperAction } from '../StudentPostBlog/style';
import TableComponent from '../../TableComponent/TableComponent';
import * as EventService from '../../../services/EventService'
import InputComponent from '../../InputComponent/InputComponent';
import Dragger from 'antd/es/upload/Dragger';
const StudentPostBlog = () => {
  ////setup
  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />
      </div>
    )
  }
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
    {
      title: 'Action',
      key: 'action',
      render: renderAction
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

  const onFinish = () => {
    console.log('finish')
  }
  ///lay cai nop
  const [itemsEvent, setItemsEvent] = useState([]);
  useEffect(() => {
    const fetchEventData = async () => {
      try {
        const res = await EventService.getAllEventValid();
        // Chuyển đổi dữ liệu từ API thành định dạng mong muốn và cập nhật state
        const formattedData = res.data.map(event => ({
          key: event._id, // Gán id vào key
          label: event.name, // Gán name vào name
          openDate: event.openDate,
          firstCloseDate: event.firstCloseDate,
          finalCloseDate: event.finalCloseDate
        }));
        setItemsEvent(formattedData);
      } catch (error) {
        console.error('Error fetching Event data:', error);
      }
    };

    fetchEventData();
  }, []);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleOk = () => {
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  /////// nop bai
  const [stateContribution, setStateContribution] = useState({
    studentId: '',
    title: '',
    content: '',
    submission_date: '',
    lastupdated_date: '',
    eventId: '',
    facultyId: '',
    status: ''
  });
  const eventLabel = (eventId) => {
    const event = itemsEvent.find(event => event.key === eventId);
    return event ? event.label : '';
  };
  const handleEventClick = ({ key }) => {
    setStateContribution({
      ...stateContribution,
      eventId: key ? key : null
    })
  };
  const menuPropsEvent = {
    items: itemsEvent,
    onClick: handleEventClick,
  };
  const props = {
    accept: '.doc,.docx,.jpg, .jpeg, .png, .bmp',
    name: 'file',
    multiple: true,
    action: 'https://run.mocky.io/v3/435e224c-44fb-4773-9faf-380c5e6a2188',
    beforeUpload(file) {
      const isLt5MB = file.size / 1024 / 1024 < 5;
      if (!isLt5MB) {
        message.error('File must be smaller than 5MB!');
      }
      return isLt5MB;
    },
    onChange(info) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
    onDrop(e) {
      console.log('Dropped files', e.dataTransfer.files);
    },
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
          <Modal width={800} title="Thêm Bài Blog" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            <Form
              name="basic"
              labelCol={{
                span: 8,
              }}
              wrapperCol={{
                span: 16,
              }}
              style={{
                maxWidth: 800,
              }}
              initialValues={{
                remember: true,
              }}
              onFinish={onFinish}
              autoComplete="off"
            >
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
                <Dropdown menu={menuPropsEvent}>
                  <Button>
                    <Space>
                      {stateContribution['eventId'] ? (
                        <span>{eventLabel(stateContribution['eventId'])} <DownOutlined /></span>
                      ) : (
                        <span>Select<DownOutlined /></span>
                      )}
                    </Space>
                  </Button>
                </Dropdown>
              </Form.Item>
              <Form.Item
                label="Title"
                name="title"
                rules={[
                  {
                    required: true,
                    message: 'Please input title',
                  },
                ]}
              >
                <InputComponent value={stateContribution['title']} name="title" />
              </Form.Item>
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
                <Dragger {...props} >
                  <p className="ant-upload-drag-icon">
                    <InboxOutlined />
                  </p>
                  <p className="ant-upload-text">Click or drag file to this area to upload</p>
                  <p className="ant-upload-hint">
                    Support for a single or bulk upload. Strictly prohibited from uploading company data or other
                    banned files.
                  </p>
                </Dragger>
              </Form.Item>
            </Form>
          </Modal>
        </div>
      </div>
    </div>

  )
}

export default StudentPostBlog
