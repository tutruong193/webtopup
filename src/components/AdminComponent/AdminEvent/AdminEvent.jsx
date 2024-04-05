import React, { useEffect, useState } from 'react';
import { Button, Modal, DatePicker, Form, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import InputComponent from '../../InputComponent/InputComponent';
import { WrapperHeader } from './style';
import { WrapperAction } from '../AdminUser/style';
import TableComponent from '../../TableComponent/TableComponent';
import DateTimePicker from 'react-datetime-picker';
import 'react-datetime-picker/dist/DateTimePicker.css';
import 'react-calendar/dist/Calendar.css';
import { format } from 'date-fns';
import { utcToZonedTime } from 'date-fns-tz';
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as EventService from '../../../services/EventService'
import { useQuery } from '@tanstack/react-query';
import * as Message from '../../../components/Message/Message'
import ModalComponent from '../../ModalComponent/ModalComponent';
import { useCookies } from 'react-cookie';
import DrawerComponent from '../../DrawerComponent/DrawerComponent'

const AdminEvent = () => {
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const renderAction = (record) => {
    return (
      <div>
        <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={() => setIsModalOpenDelete(true)} />
        <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} onClick={() => handleDetailEvent(record)} />
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
      title: 'Open Date',
      dataIndex: 'openDate',
      key: 'openDate',
    },
    {
      title: 'First Close Date',
      dataIndex: 'firstCloseDate',
      key: 'firstCloseDate',
    },
    {
      title: 'Final Close Date',
      dataIndex: 'finalCloseDate',
      key: 'finalCloseDate',
    },
    {
      title: 'Action',
      key: 'action',
      render: renderAction
    },
    
  ];
  ///getall event
  const fetchEventAll = async () => {
    const res = await EventService.getAllEvent()
    return res
  }

  const eventQuerry = useQuery({
    queryKey: ['events'],
    queryFn: fetchEventAll,
    config: { retry: 3, retryDelay: 1000 }
  });
  const { data: events } = eventQuerry

  const dataTable = events?.data?.map((event) => {
    const vietnamTimezone = 'Asia/Ho_Chi_Minh';
    const openDate = utcToZonedTime(event.openDate, vietnamTimezone);
    const firstCloseDate = utcToZonedTime(event.firstCloseDate, vietnamTimezone);
    const finalCloseDate = utcToZonedTime(event.finalCloseDate, vietnamTimezone);
    const formattedOpenDate = format(openDate, 'HH:mm:ss yyyy/MM/dd', { timeZone: vietnamTimezone });
    const formattedFirstCloseDate = format(firstCloseDate, 'HH:mm:ss yyyy/MM/dd', { timeZone: vietnamTimezone });
    const formattedFinalCloseDate = format(finalCloseDate, 'HH:mm:ss yyyy/MM/dd', { timeZone: vietnamTimezone });
    return {
      key: event._id,
      name: event.name,
      openDate: formattedOpenDate,
      firstCloseDate: formattedFirstCloseDate,
      finalCloseDate: formattedFinalCloseDate
    };
  });
  ///setup add event
  const currentYear = new Date().getFullYear();
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [stateEvent, setStateEvent] = useState({
    name: '',
    openDate: '',
    firstCloseDate: '',
    finalCloseDate: ''
  })
  const handleOnchangeEventName = (e) => {
    setStateEvent({
      ...stateEvent,
      [e.target.name]: e.target.value
    })
  }
  const handleOnChange = (name, value) => {
    let formattedValue = value;
    if (value instanceof Date) {
      const vietnamTimezone = 'Asia/Ho_Chi_Minh';
      const zonedTime = utcToZonedTime(value, vietnamTimezone); // Chuyển múi giờ sang múi giờ của Việt Nam
      formattedValue = format(zonedTime, 'yyyy/MM/dd HH:mm:ss', { timeZone: vietnamTimezone }); // Định dạng lại ngày tháng và múi giờ
    }


    setStateEvent({
      ...stateEvent,
      [name]: formattedValue,
    });
  };
  const showModal = () => {
    setIsModalOpen(true);
  };
  const handleCancel = () => {
    setIsModalOpen(false);
  };
  const mutationAdded = useMutationHooks(
    data => EventService.createEvent(data)
  )
  const [form] = Form.useForm()
  const handleOk = () => {
    mutationAdded.mutate({ ...stateEvent }, {
      onSettled: () => {
        eventQuerry.refetch()
      }
    })
    if (dataAdded?.status == 'OK') {
      setStateEvent({
        name: '',
        openDate: '',
        firstCloseDate: '',
        finalCloseDate: ''
      })
      setIsModalOpen(false)
    }
    form.resetFields()
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
  //delete event
  const [rowSelected, setRowSelected] = useState('')
  const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
  const handleCancelDelete = () => {
    setIsModalOpenDelete(false)
  }
  const mutationDeleted = useMutationHooks(
    (data) => {
      const { id, token } = data
      const res = EventService.deleteEvent(id, token)
      return res
    },
  )
  const handleDeleteEvent = () => {
    mutationDeleted.mutate({ id: rowSelected, token: cookies['access_token'].split(' ')[1] }, {
      onSettled: () => {
        eventQuerry.refetch()
      }
    })
    setIsModalOpenDelete(false)
  }
  const { data: dataDeleted, isLoading: isLoadingDeleted, isSuccess: isSuccessDelected, isError: isErrorDeleted } = mutationDeleted
  useEffect(() => {
    if (isSuccessDelected && dataDeleted?.status === 'OK') {
      Message.success()
      handleCancelDelete()
    } else if (isErrorDeleted) {
      Message.error()
    }
  }, [isSuccessDelected])
  // ////update event
  const [formUpdate] = Form.useForm()
  const [isOpenDrawer, setIsOpenDrawer] = useState(false)
  const [stateDetailEvent, setStateDetailEvent] = useState({
    name: '',
    openDate: '',
    firstCloseDate: '',
    finalCloseDate: ''
  })
  useEffect(() => {
    formUpdate.setFieldsValue(stateDetailEvent)
  }, [formUpdate, stateDetailEvent])
  const handleDetailEvent = (record) => {
    const selectedId = record?.key;
    setRowSelected(selectedId);
    if (rowSelected) {
      setIsOpenDrawer(true)
      // setIsLoadingUpdate(true)
    }
    fetchGetEventDetail(selectedId);
  }
  const handleOnchangeEventDetailName = (e) => {
    setStateDetailEvent({
      ...stateDetailEvent,
      [e.target.name]: e.target.value
    })
  }
  const handleOnChangeDetail = (name, value) => {
    let formattedValue = value;
    if (value instanceof Date) {
      const vietnamTimezone = 'Asia/Ho_Chi_Minh';
      const zonedTime = utcToZonedTime(value, vietnamTimezone); // Chuyển múi giờ sang múi giờ của Việt Nam
      formattedValue = format(zonedTime, 'yyyy/MM/dd HH:mm:ss', { timeZone: vietnamTimezone }); // Định dạng lại ngày tháng và múi giờ
    }


    setStateDetailEvent({
      ...stateDetailEvent,
      [name]: formattedValue,
    });
  };
  const fetchGetEventDetail = async (selectedID) => {
    const res = await EventService.getDetailsEvent(selectedID, cookies['access_token'].split(' ')[1])
    if (res?.data) {
      setStateDetailEvent({
        name: res?.data?.name,
        openDate: res?.data?.openDate,
        firstCloseDate: res?.data?.firstCloseDate,
        finalCloseDate: res?.data?.finalCloseDate
      })
    }
  }
  const mutationUpdate = useMutationHooks(
    (data) => {
      const { stateDetailEvent } = data
      const token = cookies['access_token'].split(' ')[1]
      const res = EventService.updateEvent(rowSelected, token, stateDetailEvent)
      return res
    }
  )

  const updateEvent = () => {
    mutationUpdate.mutate({ rowSelected, token: cookies['access_token'].split(' ')[1], stateDetailEvent }, {
      onSettled: () => {
        eventQuerry.refetch()
      }
    })
    setIsOpenDrawer(false)
  }
  const { data: dataUpdated, isLoading: isLoadingUpdated, isSuccess: isSuccessUpdated, isError: isErrorUpdated } = mutationUpdate
  useEffect(() => {
    if (isSuccessUpdated && dataUpdated?.status === 'OK') {
      Message.success()
      handleCancelDelete()
    } else if (isErrorUpdated) {
      Message.error()
    }
  }, [isSuccessUpdated])
  // //
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
        <TableComponent dataSource={dataTable} columns={columns} onRow={(record, rowIndex) => {
          return {
            onClick: event => {
              setRowSelected(record?.key)
            }
          };
        }} />
      </div>
      <div>
        <div>
          <Modal title="Thêm Sự Kiện" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
            {dataAdded?.status == 'ERR' && <p style={{ color: 'red' }}>{dataAdded?.message}</p>}
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

              autoComplete="off"
              form={form}
            >
              <Form.Item
                label="Name of event"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <InputComponent value={stateEvent['name']} onChange={handleOnchangeEventName} name="name" />
              </Form.Item>
              <Form.Item
                label="Open date"
                name="openDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent['openDate']} onChange={(value) => handleOnChange('openDate', value)}
                />
              </Form.Item>
              <Form.Item
                label="First close date"
                name="firstCloseDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent['firstCloseDate']} onChange={(value) => handleOnChange('firstCloseDate', value)}
                />
              </Form.Item>
              <Form.Item
                label="Final close date"
                name="finalCloseDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateEvent['finalCloseDate']} onChange={(value) => handleOnChange('finalCloseDate', value)}
                />
              </Form.Item>
            </Form>
          </Modal>
          <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteEvent}>
            <div>Bạn có chắc xóa tài khoản này không? </div>
          </ModalComponent>
          <DrawerComponent title='Chi tiết event' isOpen={isOpenDrawer} onClose={() => setIsOpenDrawer(false)} width='90%'>
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
              onFinish={updateEvent}
              autoComplete="off"
              form={formUpdate}
            >
              <Form.Item
                label="Name of event"
                name="name"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <InputComponent value={stateDetailEvent['name']} onChange={handleOnchangeEventDetailName} name="name" />
              </Form.Item>
              <Form.Item
                label="Open date"
                name="openDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent['openDate']} onChange={(value) => handleOnChangeDetail('openDate', value)}
                />
              </Form.Item>
              <Form.Item
                label="First close date"
                name="firstCloseDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent['firstCloseDate']} onChange={(value) => handleOnChangeDetail('firstCloseDate', value)}
                />
              </Form.Item>
              <Form.Item
                label="Final close date"
                name="finalCloseDate"
                rules={[
                  {
                    required: true,
                    message: 'Please input name',
                  },
                ]}
              >
                <DateTimePicker
                  clearIcon={null}
                  format="yyyy-MM-dd HH:mm" // HH is used for 24-hour format
                  disableClock
                  locale="en-US"
                  value={stateDetailEvent['finalCloseDate']} onChange={(value) => handleOnChangeDetail('finalCloseDate', value)}
                />
              </Form.Item>
              <Form.Item wrapperCol={{ offset: 20, span: 16 }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Form.Item>
            </Form>
          </DrawerComponent>
        </div>
      </div>
    </div>
  )
}

export default AdminEvent;
