import React, { useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { SendOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import ButtonComponent from '../../ButtonComponent/ButtonComponent';
import { WrapperHeader } from '../ManagerEvent/style';
import TableComponent from '../../TableComponent/TableComponent';

const renderAction = (record) => {
    return (

        <div style={{ padding: '30px', display: 'flex', flexDirection: 'row' }}>
            <div>
                <SendOutlined style={{ color: 'blue', fontSize: '30px', cursor: 'pointer', padding: '10px' }} />
            </div>

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
        key: 'timedangbai',
    },
    {
        title: 'Falcuty',
        dataIndex: 'falcuty',
        key: 'falcuty',
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
        falcuty: "Business",
        comment: "This is a comment"
    },
    {
        key: '2',
        title: 'Tại sao Long đẹp trai thế?',
        file: 'longdeptrai.pdf',
        duedate: '23:59  21/04/2024',
        timedangbai: '13:59 20/04/2024',
        falcuty: "IT",
        comment: "Nói quá chuẩn không có gì phải bàn cãi"
    },

];

const ManagerEvent = () => {

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
        </div>

    )
}

export default ManagerEvent
