import React from 'react'
import { WrapperHeader } from './style'
import { Button } from 'antd'
import {PlusCircleOutlined} from '@ant-design/icons';
import TableComponent from '../../TableComponent/TableComponent';

const AdminUser = () => {
  return (
    <div>
      <WrapperHeader> Quản lý người dùng</WrapperHeader>
      <Button style={{height:'45px', width:'50px', fontSize:'20px', background:'white', marginTop:'10px'}}><PlusCircleOutlined /> </Button>
      <div style={{marginTop: '20px'}}>
      <TableComponent />    
      </div>
    </div>
  )
}

export default AdminUser
