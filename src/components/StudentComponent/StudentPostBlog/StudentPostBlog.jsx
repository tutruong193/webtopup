import React, { useEffect, useState } from 'react'
import { Button, Modal, Form, Input, Space, Dropdown, message, Upload, Divider, Descriptions } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, AudioOutlined, UploadOutlined } from '@ant-design/icons'
import { WrapperHeader, WrapperCard } from '../StudentPostBlog/style';
import TableComponent from '../../TableComponent/TableComponent';
import * as EventService from '../../../services/EventService'
import InputComponent from '../../InputComponent/InputComponent';
import { useMutationHooks } from '../../../hooks/useMutationHook';
import * as ContributionService from '../../../services/ContributionService'
import { Card, Col, Row } from 'antd';
import DrawerComponent from '../../DrawerComponent/DrawerComponent';
import { getBase64, jwtTranslate } from '../../../utilis';
import { useCookies } from 'react-cookie';
import * as Message from '../../../components/Message/Message'
import { useQuery } from '@tanstack/react-query';
import ModalComponent from '../../ModalComponent/ModalComponent';

const StudentPostBlog = () => {
  ////setup
  const [cookiesAccessToken, setCookieAccessToken] = useCookies('')
  const [updateForm, setUpdateForm] = useState({
    studentId: "",
    title: "",
    wordFile: "",
    imageFiles: "",
    submission_date: "",
    lastupdated_date: "",
    eventId: "",
    facultyId: "",
    status: ""
  })
  //lấy danh sách bài đã nộp
  const fetchSubmitedContribution = async (studentId) => {
    const res = await ContributionService.getSubmitedContribution(studentId);
    return res.data;
  };
  const user = jwtTranslate(cookiesAccessToken);
  const submitedQuerry = useQuery({
    queryKey: ['submited', user?.id],
    queryFn: () => fetchSubmitedContribution(user?.id),
    config: {
      retry: 3,
      retryDelay: 1000,
    },
  });
  const { data: submited } = submitedQuerry;
  ///lấy dữ liệu về event đang valid
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
  //modal add
  const [isModalOpen, setIsModalOpen] = useState(false);
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  ///// card và hành động ấn vào card
  const [eventDetail, setEventDetail] = useState(null);
  const handleCardClick = async (eventId) => {
    try {
      const res = await EventService.getDetailsEvent(eventId);
      setEventDetail(res.data);
      fetchData(eventId);
    } catch (error) {
      console.error('Error fetching event details:', error);
    }
    setIsOpenDrawer(true)
  };

  /////// hiển hị thông tin của event qua drawer
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  ////lấy tên của event qua id
  const eventLabel = (eventId) => {
    const event = itemsEvent.find(event => event.key === eventId);
    return event ? event.label : '';
  };
  const [selectedFiles, setSelectedFiles] = useState();
  //word
  const propsWord = {
    name: 'file',
    multiple: true,
    action: 'https://webtopup-be.onrender.com/upload-files',
    beforeUpload: (file) => {
      const isDoc = file.type === 'application/msword' || file.type === 'application/pdf' ||// .doc 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'; // .docx
      const isLt5M = file.size / 1024 / 1024 < 5;
      if (!file) {
        message.error('Vui lòng chọn tệp!');
        return false;
      } else if (!isDoc) {
        message.error(`${file.name} is not a valid file. Please upload Word document (doc, docx)`);
      } else if (!isLt5M) {
        message.error('File phải nhỏ hơn 5MB!');
      }
      return (isDoc) ? true : Upload.LIST_IGNORE;
    },
    onChange(info, event) {
      const { status } = info.file;
      if (status !== 'uploading') {
        console.log(info.file, info.fileList);
      }
      if (status === 'done') {
        message.success(`${info.file.name} file uploaded successfully.`);
        setSelectedFiles(info.fileList[0]);
      } else if (status === 'error') {
        message.error(`${info.file.name} file upload failed.`);
      }
    },
  };
  //image upload
  const [fileListImage, setFileListImage] = useState([])
  const beforeUpload = (file) => {
    const isImage = file.type === 'image/jpeg' || // .jpeg
      file.type === 'image/png' || // .png
      file.type === 'image/bmp';  // .bmp
    const isLt5M = file.size / 1024 / 1024 < 5;
    if (!isImage) {
      message.error(`${file.name} is not a valid file. Please upload high-quality image (jpg, jpeg, png, bmp).`);
      return Upload.LIST_IGNORE;
    } else if (!isLt5M) {
      message.error('File phải nhỏ hơn 5MB!');
      return Upload.LIST_IGNORE;
    }
    return false
  }
  const handleChange = async ({ fileList }) => {
    const previews = fileList.map(async file => {
      if (!file.url && !file.preview) {
        file.preview = await getBase64(file.originFileObj);
      }
      return file.preview;
    });
    Promise.all(previews).then(previews => {
      setFileListImage(previews);
    });
  };
  ////set title
  const [title, setTitle] = useState('')
  const handleOnchange = (e) => {
    setTitle(e.target.value)
  }
  ///add button
  const mutationAdded = useMutationHooks(
    data => ContributionService.createContribution(data)
  )
  const handleOk = async () => {
    const user = jwtTranslate(cookiesAccessToken);
    const formData = new FormData();
    formData.append('studentId', user?.id);
    formData.append('title', title);
    formData.append('submission_date', Date.now());
    formData.append('lastupdated_date', Date.now());
    formData.append('eventId', eventDetail?._id);
    formData.append('facultyId', user?.faculty);
    formData.append('status', 'Pending');
    formData.append('wordFile', selectedFiles);
    console.log('selectedfiles', selectedFiles)
    const imageUrls = fileListImage.map(file => file);
    imageUrls.forEach((url, index) => {
      formData.append(`image_${index}`, url);
    });
    mutationAdded.mutate({ formData }, {
      onSettled: () => {
        submitedQuerry.refetch()
      }
    })
  };
  const { data: dataAdded, isLoading: isLoadingAdded, isSuccess: isSuccessAdded, isError: isErrorAdded } = mutationAdded
  useEffect(() => {
    if (isSuccessAdded && dataAdded?.status === 'OK') {
      Message.success()
      setIsModalOpen(false)
    } else if (isErrorAdded && dataAdded?.status === 'ERR') {
      Message.error()
    }
  }, [isSuccessAdded])
  ///lấy dữ liệu của bài đã nộp
  const [detailContribution, setDetailContribution] = useState([]);
  const fetchData = async (eventId) => {
    try {
      const result = await ContributionService.getDetailContributionByEvent(eventId, cookiesAccessToken);
      if (result && result.data) {
        setDetailContribution(result.data);
        setUpdateForm(result.data)
      } else {
        setDetailContribution([]); // Nếu không có dữ liệu, setDetailContribution thành mảng rỗng
      }
    } catch (error) {
      console.error('Error fetching contribution data:', error);
    }
  };
  console.log('updateform', updateForm)
  console.log('detail', detailContribution);
  ///delete contribution
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  const handleDeleteContribution = async () => {
    setIsModalOpenDelete(true)
  }
  const mutationDeleted = useMutationHooks(
    ({ id, accessToken }) => {
      const res = ContributionService.deleteContribution(id, accessToken);
      return res;
    },
  );
  const handleDeleteUser = () => {
    const id = detailContribution?._id;
    const accessToken = cookiesAccessToken;

    mutationDeleted.mutate({ id, accessToken }, {
      onSettled: () => {
        submitedQuerry.refetch();
      },
    });
    setIsModalOpenDelete(false);
    setIsOpenDrawer(false);
  };
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      Message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      Message.error()
    }
  }, [isSuccessDelected])
  ////update
  const [isModalUpdateOpen, setIsModalUpdateOpen] = useState(false);
  const handleUpdateCancel = () => {
    setIsModalUpdateOpen(false);
  };
  const showUpdateModal = () => {
    setIsModalUpdateOpen(true);
  };
  const [titleUpdate, setTitleUpdate] = useState(detailContribution?.title);
  const handleOkUpdate = async () => {
    // Thực hiện logic cập nhật ở đây
    console.log('Updated title:', titleUpdate);
    // Đóng modal sau khi cập nhật thành công
    setIsModalUpdateOpen(false);
  };

  ///
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
    <div style={{ padding: '50px' }}>
      <WrapperHeader><p>Danh sách bài đăng</p></WrapperHeader>
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
      <div style={{ paddingTop: '50px' }}>
        <Row gutter={16}>
          {itemsEvent?.map(event => (
            <Col span={8} key={event.key} > {/* Sử dụng event.key làm key */}
              <WrapperCard
                title={
                  <div style={{ display: 'flex', alignItems: 'center' }}>
                    <div style={{ marginRight: '5px', verticalAlign: 'middle' }}>{event.label}</div>
                    {submited && submited.some(item => item.eventId === event.key) ? (
                      <CheckCircleOutlined style={{ color: 'green', verticalAlign: 'middle' }} />
                    ) : (
                      <CloseCircleOutlined style={{ color: 'red', verticalAlign: 'middle' }} />
                    )}
                  </div>
                }
                bordered={false}
                hoverable
                onClick={() => handleCardClick(event.key)} >
                <p>Open Date: {event.openDate}</p>
                <p>First Close Date: {event.firstCloseDate}</p>
                <p>Final Close Date: {event.finalCloseDate}</p>
              </WrapperCard>
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
              <div onChange={handleOnchange}>{eventDetail?._id ? eventLabel(eventDetail._id) : ''}</div>
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
              <InputComponent value={title} name="title" onChange={handleOnchange} />
            </Form.Item>
            <Form.Item
              label="Upload File Word"
              name="uploadFileWord"
              rules={[
                {
                  required: true,
                  message: 'Please input File!',
                },
              ]}
            >
              <Upload {...propsWord} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="Upload File Image"
              name="uploadFileImg"
            >
              <>
                <Upload
                  onChange={handleChange}
                  maxCount={3}
                  listType="picture"
                  beforeUpload={beforeUpload}
                  showRemoveIcon={true}
                  showPreviewIcon={false} // Ẩn nút xem trước
                >
                  <Button icon={<UploadOutlined />} disabled={fileListImage.length >= 3}>
                    Upload
                  </Button>
                </Upload>
              </>
            </Form.Item>
          </Form>
        </Modal>
      </div>
      <div>
        <DrawerComponent title='Chi tiết event' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
          <div style={{ padding: '0px 200px' }}>
            <Descriptions title="User Info" bordered contentStyle={{ width: '70%' }} label={{ width: '30%' }} column={1} size='middle'>
              <Descriptions.Item label="Name of Event">{eventDetail?.name}</Descriptions.Item>
              <Descriptions.Item label="Open Date">{eventDetail?.openDate}</Descriptions.Item>
              <Descriptions.Item label="First close date">{eventDetail?.firstCloseDate}</Descriptions.Item>
              <Descriptions.Item label="Final close date">{eventDetail?.finalCloseDate}</Descriptions.Item>
              <Descriptions.Item label="Status">{detailContribution?.status || 'none'}</Descriptions.Item>
              <Descriptions.Item label="Title">{detailContribution?.title || 'none'}</Descriptions.Item>
              <Descriptions.Item label="Last Updated">{detailContribution?.lastupdated_date || 'none'}</Descriptions.Item>
              <Descriptions.Item label="File Word">{detailContribution?.wordFile || 'none'}</Descriptions.Item>
              <Descriptions.Item label="File Image">
                {detailContribution?.imageFiles ? (
                  <div style={{ display: 'flex', flexWrap: 'wrap' }}>
                    {detailContribution?.imageFiles.map((image, index) => (
                      <img key={index} src={image} alt={`Image ${index}`} style={{ marginRight: '10px', marginBottom: '10px', maxHeight: '100px' }} />
                    ))}
                  </div>
                ) : 'none'}
              </Descriptions.Item>
              {/* <Descriptions.Item label="FileImage">{detailContribution?.imageFiles || 'none'}</Descriptions.Item> */}
            </Descriptions>
            <div style={{
              width: '100%',
              display: 'flex',
              justifyContent: 'center',
              marginTop: '25px',
              paddingTop: '25px',
              borderTop: '1px solid',
              gap: '10px'
            }}>
              {submited && submited.some(item => item.eventId === eventDetail?._id) ? (
                <>
                  <Button style={{ width: '100px' }} type="dashed" onClick={showUpdateModal}>Update</Button>
                  <Button style={{ width: '100px' }} type="dashed" onClick={handleDeleteContribution}>Remove</Button>
                </>
              ) : (
                <Button style={{ width: '100px' }} type="dashed" onClick={showModal}>Add</Button>
              )}
            </div>
          </div>
        </DrawerComponent>
        <ModalComponent title="Xóa contribution" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
          <div>Bạn có chắc xóa tài khoản này không? </div>
        </ModalComponent>
        <Modal width={800} title="Update" open={isModalUpdateOpen} onCancel={handleUpdateCancel} onOk={handleOkUpdate}>
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
              <div onChange={handleOnchange}>{updateForm ? eventLabel(updateForm?.eventId) : ''}</div>
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
              <div>{updateForm['title']}</div>
            </Form.Item>
            <Form.Item
              label="Upload File Word"
              name="uploadFileWord"
              rules={[
                {
                  required: true,
                  message: 'Please input File!',
                },
              ]}
            >
              <Upload {...propsWord} maxCount={1}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item
              label="File Word"
              name="fileWord"
            >
              {updateForm.wordFile ? (
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                  {/* Thay FileWordIcon bằng biểu tượng file word của bạn */}
                  <span>{updateForm.wordFile}</span>
                </div>
              ) : (
                <span>No file uploaded</span>
              )}
            </Form.Item>
            <Form.Item
              label="Upload File Image"
              name="uploadFileImg"
            >
              <>
                <Upload
                  onChange={handleChange}
                  maxCount={3}
                  listType="picture"
                  beforeUpload={beforeUpload}
                  showRemoveIcon={true}
                  showPreviewIcon={false} // Ẩn nút xem trước
                  defaultFileList={updateForm?.imageFiles ?
                    updateForm.imageFiles.map((file, index) => ({
                      uid: index,
                      name: file,
                      status: 'done',
                      url: file,
                    })) : []
                  }
                >
                  <Button icon={<UploadOutlined />} disabled={fileListImage.length >= 3}>
                    Upload
                  </Button>
                </Upload>
              </>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>

  )
}

export default StudentPostBlog
