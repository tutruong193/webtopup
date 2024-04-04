import React, { useEffect, useState } from 'react'
import { Button, Modal, DatePicker, Form, Input, Space, Table, Tag, Dropdown, message, Tooltip } from 'antd';
import { PlusOutlined, DeleteOutlined, EditOutlined, SearchOutlined, DownOutlined, UserOutlined, AudioOutlined } from '@ant-design/icons'
import { WrapperHeader } from '../StudentAccount/style'
import InputComponent from '../../InputComponent/InputComponent';
import { jwtTranslate } from '../../../utilis';
import { useCookies } from 'react-cookie';
import * as UserService from '../../../services/UserService';
const onFinish = () => {
  console.log('finish')
}

const StudentAccount = () => {
  const [cookiesAccessToken, setCookieAccessToken] = useCookies('');
  const user = jwtTranslate(cookiesAccessToken);
  useEffect(() => {
    try {
      const fetch = async () => {
        // const res = await UserService.
      }
    }
    catch (e) {
      console.log('error', e)
    }
  })
  return (
    <div style={{ padding: '30px', }}>
      <WrapperHeader><p>User Profile</p></WrapperHeader>
      <div style={{ justifyContent: 'center' }}>
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
          >
            <InputComponent disabled/>
          </Form.Item>
          <Form.Item
            label="Faculty"
            name="faculty"
          >
            <InputComponent disabled/>
          </Form.Item>
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
            <Button style={{}} >Upload</Button>
          </Form.Item>
          <Form.Item
            name="btnAction"
          >
            <Button style={{ display: 'flex', marginLeft: "330px", width: '80px', justifyContent: 'center' }} type="primary" >Save</Button>
          </Form.Item>

        </Form>
      </div>
    </div>
  )
}

export default StudentAccount
