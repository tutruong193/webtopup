import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Space, Dropdown, message, Upload } from 'antd';
import { DeleteOutlined, EditOutlined, DownOutlined, AudioOutlined, UploadOutlined } from '@ant-design/icons'
import { WrapperHeader } from '../StudentPostBlog/style';
import { WrapperAction } from '../StudentPostBlog/style';
import TableComponent from '../../TableComponent/TableComponent';
import * as EventService from '../../../services/EventService'
import InputComponent from '../../InputComponent/InputComponent';
import { useMutationHooks } from '../../../hooks/useMutationHook';
import * as ContributionService from '../../../services/ContributionService'
import { Card, Col, Row } from 'antd';
import DrawerComponent from '../../DrawerComponent/DrawerComponent';
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
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  /////// nop bai
  let uploadFile = []
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [stateContribution, setStateContribution] = useState({
    // studentId: '',
    // title: '',
    // content: '',
    // submission_date: '',
    // lastupdated_date: '',
    // eventId: '',
    // facultyId: '',
    // status: ''
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
  const handleRemove = (file) => {
    const updatedFiles = uploadFile.filter(item => item !== file);
    uploadFile = updatedFiles;
  };
  const props = {
    name: 'file',
    multiple: true,
    action: 'http://localhost:3001/upload-files',
    onRemove: handleRemove,
    beforeUpload: (file) => {
      const isDoc = file.type === 'application/msword' || file.type === 'application/pdf' ||// .doc 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // .docx
      const isImage = file.type === 'image/jpeg' || // .jpeg
        file.type === 'image/png' || // .png
        file.type === 'image/bmp';  // .bmp
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!isDoc && !isImage) {
        message.error(`${file.name} is not a valid file. Please upload Word document (doc, docx) or high-quality image (jpg, jpeg, png, bmp).`);
      } else if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
      }
      return (isDoc || isImage) ? true : Upload.LIST_IGNORE;
    },
    onChange(info, event) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        uploadFile.length = 0
        message.success(`${info.file.name} file uploaded successfully.`);
        for (let i = 0; i < info.fileList.length; i++) {
          uploadFile[i] = info.fileList[i]
        }
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };

  const handleOnchange = (e) => {
    setStateContribution({
      ...stateContribution,
      [e.target.name]: e.target.value
    })
  }
  const mutationAdded = useMutationHooks(
    data => ContributionService.createContribution(data)
  )
  const handleOk = () => {
    // const data = {
    //   files: uploadedFiles.map(file => file.name)
    // };
    // mutationAdded.mutate({ data })
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
        <Row gutter={16}>
          {itemsEvent?.map(event => (
            <Col span={8} key={event.key}> {/* Sử dụng event.key làm key */}
              <Card title={event.label} bordered={false} hoverable>
                <p>Open Date: {event.openDate}</p>
                <p>First Close Date: {event.firstCloseDate}</p>
                <p>Final Close Date: {event.finalCloseDate}</p>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
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
              <InputComponent value={stateContribution['title']} name="title" onChange={handleOnchange} />
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
              <Upload {...props}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <DrawerComponent title='Chi tiết event' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>

        </DrawerComponent>
      </div>
    </div>

  )
}

export default StudentPostBlog
