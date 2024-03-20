import React, { useState } from 'react'
import { Button, Modal, DatePicker, Dropdown, Space, message, Form } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import TableComponent from '../../TableComponent/TableComponent'
import { WrapperHeader, WrapperAction, WrapperInput } from './style'
import InputComponent from '../../InputComponent/InputComponent'
import * as FacultyService from '../../../services/FacultyService'
import { useQuery } from '@tanstack/react-query'
import { useMutationHooks } from '../../../hooks/useMutationHook'
import * as UserService from '../../../services/UserService'
import ModalComponent from '../../ModalComponent/ModalComponent'

const AdminUser = () => {
    //setup
    const renderAction = () => {
        return (
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} onClick={ () => setIsModalOpenDelete(true)} />
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />
            </div>
        )
    }
    const columns = [
        {
            title: 'Name',
            dataIndex: 'name',
            key: 'name',
        },
        {
            title: 'Email',
            dataIndex: 'email',
            key: 'email',
        },
        {
            title: 'Role',
            dataIndex: 'role',
            key: 'role',
        },
        {
            title: 'Faculty',
            dataIndex: 'faculty',
            key: 'faculty',
        },
        {
            title: 'Action',
            dataIndex: 'Action',
            render: renderAction
        }
    ];
    const itemsRole = [
        {
            label: 'Student',
            key: 'Student',
        },
        {
            label: 'Marketing Manager',
            key: 'MarketingManager',
        },
        {
            label: 'Marketing Coordinator',
            key: 'MarketingCoordinator',
        },
    ];
    const [stateUser, setStateUser] = useState({
        name: '',
        email: '',
        password: '',
        role: '',
        faculty: ''
    })
    //mỗi khi thay đổi input nhập vào, sẽ lưu luôn vào biến bằng useState
    const handleOnchangeUser = (e) => {
        setStateUser({
            ...stateUser,
            [e.target.name]: e.target.value
        })
    }
    //modal add user
    const [isModalOpen, setIsModalOpen] = useState(false);
    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };
    //set role khi click
    const handleRoleClick = ({ key }) => {
        setStateUser({
            ...stateUser,
            role: key
        })
    };
    const menuPropsRole = {
        items: itemsRole,
        onClick: handleRoleClick,
    };
    /// lấy dữ riệu faculty
    const fetchFacultyAll = async () => {
        const res = await FacultyService.getAllFaculty()
        return res
    }
    const { data: faculties } = useQuery({
        queryKey: ['faculties'],
        queryFn: fetchFacultyAll,
        config: { retry: 3, retryDelay: 1000 }
    });
    const itemsFaculty = faculties?.data?.map(faculty => ({
        label: faculty.name,
        key: faculty._id,
    }));
    //set faculty khi click
    const handleFacultyClick = ({ key }) => {
        setStateUser({
            ...stateUser,
            faculty: key
        })
    };
    const menuPropsFaculty = {
        items: itemsFaculty,
        onClick: handleFacultyClick,
    };
    ///
    const mutation = useMutationHooks(
        data => UserService.createUser(data)
    )
    const handleOk = () => {
        mutation.mutate({ ...stateUser })
    };
    //getalluser
    const fetchUserAll = async () => {
        const res = await UserService.getAllUser()
        return res
    }

    const { data: users } = useQuery({
        queryKey: ['users'],
        queryFn: fetchUserAll,
        config: { retry: 3, retryDelay: 1000 }
    });


    const itemsUser = users?.data?.filter(user => user.role !== 'Admin') // Loại bỏ người dùng có vai trò là 'Admin'
        .map((user) => ({
            key: user._id,
            name: user.name,
            email: user.email,
            role: user.role,
            faculty: user.faculty
        }));
    ///delete user
    const [rowSelected, setRowSelected] = useState('')
    const [isModalOpenDelete, setIsModalOpenDelete] = useState(false);
    const handleCancelDelete = () => {
        setIsModalOpenDelete(false)
    }
    const handleDeleteUser = () => {

    }
    return (
        <div style={{ padding: '30px' }}>
            <WrapperHeader><p>Quản Lý Người Dùng</p></WrapperHeader>
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
                <TableComponent dataSource={itemsUser} columns={columns} onRow={(record, rowIndex) => {
                    return {
                        onClick: event => {
                            setRowSelected(record.key)
                        }
                    };
                }}/>
            </div>
            <Modal title="Tạo tài khoản người dùng" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                >
                    <Form.Item
                        label="Name"
                        name="name"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUser['name']} onChange={handleOnchangeUser} name="name" />
                    </Form.Item>
                    <Form.Item
                        label="Role"
                        name="role"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Dropdown menu={menuPropsRole}>
                            <Button>
                                <Space>
                                    {stateUser['role'] ? (
                                        <span>{stateUser['role']} <DownOutlined /></span>
                                    ) : (
                                        <span>Select<DownOutlined /></span>
                                    )}
                                </Space>

                            </Button>
                        </Dropdown>
                    </Form.Item>
                    {(stateUser['role'] === 'Student' || stateUser['role'] === 'MarketingCoordinator') ? (<Form.Item
                        label="Faculty"
                        name="faculty"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <Dropdown menu={menuPropsFaculty}>
                            <Button>
                                <Space>
                                    {stateUser['faculty'] ? (
                                        <span>{stateUser['faculty']} <DownOutlined /></span>
                                    ) : (
                                        <span>Select<DownOutlined /></span>
                                    )}
                                </Space>
                            </Button>
                        </Dropdown>
                    </Form.Item>) : (<></>)}

                    <Form.Item
                        label="Email"
                        name="email"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUser['email']} onChange={handleOnchangeUser} name="email" />
                    </Form.Item>

                    <Form.Item
                        label="Password"
                        name="password"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <InputComponent value={stateUser['password']} onChange={handleOnchangeUser} name="password" />
                    </Form.Item>
                    <Form.Item
                        wrapperCol={{
                            offset: 8,
                            span: 16,
                        }}
                    >
                    </Form.Item>
                </Form>
            </Modal>
            <ModalComponent title="Xóa người dùng" open={isModalOpenDelete} onCancel={handleCancelDelete} onOk={handleDeleteUser}>
                <div>Bạn có chắc xóa tài khoản này không? </div>
            </ModalComponent>
        </div>
    )
}

export default AdminUser