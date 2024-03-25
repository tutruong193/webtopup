import React, { useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { CheckOutlined, CloseOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { WrapperHeader } from '../ManagerFalcuty/style';
import { WrapperAction } from '../ManagerFalcuty/style';
import TableComponent from '../../TableComponent/TableComponent';
import InputComponent from '../../InputComponent/InputComponent'

const renderAction = (record) => {
    return (

        <div style={{ padding: '30px', display: 'flex', flexDirection: 'row' }}>
            <DeleteOutlined style={{ color: 'red', fontSize: '30px', cursor: 'pointer' }} />
            <EditOutlined style={{ color: 'orange', fontSize: '30px', cursor: 'pointer' }} />

        </div>

    )
}
const columns = [
    {
        title: 'Name Falcuty',
        dataIndex: 'namefalcuty',
        key: 'namefalcuty',
        render: (text) => <a>{text}</a>,
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
        namefalcuty: 'IT',
    },
    {
        key: '2',
        namefalcuty: 'Business',
    },
    {
        key: '3',
        namefalcuty: 'Design',
    },
    {
        key: '4',
        namefalcuty: 'Marketing',
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
const onFinish = () => {
    console.log('finish')
}
const ManagerFalcuty = () => {
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
                    <Button style={{ width: '100px' }} danger>Delete</Button>
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
            <Modal title="Create Falcuty" open={isModalOpen} onOk={handleOk} onCancel={handleCancel}>
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
                        label="Name of falcuty"
                        name="namefalcuty"
                        rules={[
                            {
                                required: true,
                                message: 'Please input name of falcuty',
                            },
                        ]}
                    >
                        <InputComponent name="falcuty" />
                    </Form.Item>
                </Form>
            </Modal>
        </div>

    )
}

export default ManagerFalcuty
