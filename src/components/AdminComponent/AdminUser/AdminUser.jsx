import React, { useState } from 'react'
import { Button, Modal, DatePicker, Dropdown, Space, message, Form } from 'antd'
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined } from '@ant-design/icons'
import TableComponent from '../../TableComponent/TableComponent'
import { WrapperHeader, WrapperAction, WrapperInput } from './style'
import InputComponent from '../../InputComponent/InputComponent'

const dataSource = [
    {
        key: '1',
        name: 'Mike',
        age: 32,
        address: '10 Downing Street',
    },
    {
        key: '2',
        name: 'John',
        age: 42,
        address: '10 Downing Street',
    },
];
const renderAction = (record) => {
    return (
        <div style={{ padding: '10px', display: 'flex', flexDirection: 'row' }}>
            <div>
                <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
            </div>
            <div>
                <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />
            </div>

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
        dataIndex: 'Action',
        render: renderAction
    }
];
const items = [
    {
        label: 'IT',
        key: 'IT',
        icon: <UserOutlined />,
    },
    {
        label: 'Design',
        key: 'Design',
        icon: <UserOutlined />,
    },
];
const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const showModal = () => {
        setIsModalOpen(true);
    };

    const handleOk = () => {
        setIsModalOpen(false);
    };

    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const handleMenuClick = ({ key }) => {
        console.log('click', key);
    };
    const menuProps = {
        items,
        onClick: handleMenuClick,
    };
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
                <TableComponent dataSource={dataSource} columns={columns} />
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
                        <InputComponent />
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
                        <Dropdown menu={menuProps}>
                            <Button>
                                <Space>
                                    
                                    <DownOutlined />
                                </Space>
                            </Button>
                        </Dropdown>
                    </Form.Item>
                    <Form.Item
                        label="Faculty"
                        name="faculty"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your email!',
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
                        <InputComponent />
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
                        <InputComponent />
                    </Form.Item>

                    <Form.Item
                        label="Re-Password"
                        name="rewritepassword"
                        rules={[
                            {
                                required: true,
                                message: 'Please input your password!',
                            },
                        ]}
                    >
                        <InputComponent />
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
    )
}

export default AdminUser