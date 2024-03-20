import React, { useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import { WrapperHeader } from '../CoordinatorAccount/style'
import InputComponent from '../../InputComponent/InputComponent';

const onFinish = () => {
    console.log('finish')
  }
const CoordinatorAccount = () => {
    const size = useState('middle');
    return (
      <div style={{ padding: '30px',  }}>
        <WrapperHeader><p>User Profile</p></WrapperHeader>
        <div style={{  justifyContent: 'center'}}>
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
            label="Name"
            name="name"
            rules={[
              {
                required: true,
                message: 'Please input your name!',
              },
            ]}
          >
            <InputComponent />
          </Form.Item>
          <Form.Item
                  label="Birthday"
                  name="birthday"
                >
                  <Space direction="vertical" size={12}>
                  <DatePicker size={size} placeholder='Your Birthday' />
                  </Space>
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
            label="Phone Number"
            name="phonenumber"
            rules={[
              {
                required: true,
                message: 'Please input your phone number!',
              },
            ]}
          >
            <InputComponent />
          </Form.Item>
          <Form.Item
            label="Image"
            name="image"
          >
            <Button style={{  }} >Upload</Button>
          </Form.Item>
          <Form.Item
            label="Address"
            name="address"
          >
            <InputComponent />
          </Form.Item>
          <Form.Item
            name="btnAction"
          >
            <Button style={{ display:'flex', marginLeft:"330px", width:'80px', justifyContent:'center' }} type="primary" >Save</Button>
          </Form.Item>
          
        </Form>
        </div>
      </div>
    )
}

export default CoordinatorAccount
