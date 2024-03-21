import React, { useState } from 'react'
import { getItem } from '../../utilis';
import { UserOutlined, FormOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import * as UserService from '../../services/UserService'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import CoordinatorAccount from '../../components/CoordinatorComponent/CoordinatorAccount/CoordinatorAccount';
import CoordinatorEvent from '../../components/CoordinatorComponent/CoordinatorEvent/CoordinatorEvent';

const CoordinatorPage = () => {
  const items = [
    getItem('Marketing Coordinator', 'grp', null, [getItem('Logout', 'logout', <LogoutOutlined />)], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Thông tin cá nhân', 'user', <UserOutlined />), getItem('Danh sách duyệt', 'listBlog', <FormOutlined />)], 'group'),
  ];
  const renderPage = (key) => {
    switch (key) {
      case 'user':
        return (
          <CoordinatorAccount />
          
        )
      case 'listBlog':
        return (
          <CoordinatorEvent />
          
        )

      case 'logout':
        return (
          <div onClick={handleLogout}>logout</div>
        )
      default:
        return <></>
    }
  }
  const [keySelected, setKeySelected] = useState('')

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }
  const [cookies, setCookie, removeCookie] = useCookies(['access_token']);
  const navigate = useNavigate()
  const handleLogout = async () => {
    await UserService.logoutUser()
    removeCookie('access_token')
    navigate('/')
  }
  return (
    <>
      <div style={{ display: 'flex' }}>
        <Menu
          mode="inline"
          style={{
            width: 256,
            boxShadow: '1px 1px 2px #ccc',
            height: '100vh',
          }}
          items={items}
          onClick={handleOnCLick}
        />
        <div style={{ flex: 1, padding: '15px' }}>
          {renderPage(keySelected)}
        </div>
      </div>

    </>
  )
}

export default CoordinatorPage
