import React from 'react'
import { WrapperHeader } from './style'
import { Button, Modal, Form } from 'antd'
import TableComponent from '../../TableComponent/TableComponent';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined } from '@ant-design/icons'
import { useState } from 'react'
import InputComponent from '../../InputComponent/InputComponent';

const AdminUser = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const handleOk = () => {

    };
    const handleCancel = () => {
        setIsModalOpen(false);
    };

    const onFinish = () => {
        console.log('finish')
    }
    return (
        <div>
            <WrapperHeader> Quản lý người dùng</WrapperHeader>
            <Button style={{ height: '45px', width: '50px', fontSize: '20px', background: 'white', marginTop: '10px' }} onClick={() => setIsModalOpen(true)}><PlusOutlined /> </Button>
            <div style={{ marginTop: '20px' }}>
                <TableComponent />
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
                    onFinish={onFinish}
                    autoComplete="off"
                >
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
                        <InputComponent/>
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
    )
}

export default AdminUser
