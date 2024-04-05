import React, { useState } from 'react'
import { getItem } from '../../utilis';
import { UserOutlined, FormOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import * as UserService from '../../services/UserService'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import CoordinatorAccount from '../../components/CoordinatorComponent/CoordinatorAccount/CoordinatorAccount';
import CoordinatorEvent from '../../components/CoordinatorComponent/CoordinatorEvent/CoordinatorEvent';
import CoordinatorContribution from '../../components/CoordinatorComponent/CoordinatorContribution/CoordinatorContribution';

const CoordinatorPage = () => {
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] = useCookies('')
  const items = [
    getItem('Marketing Coordinator', 'grp', null, [getItem('Logout', 'logout', <LogoutOutlined />)], 'group'),
    getItem('Item 2', 'g2', null, [getItem('Account', 'account', <UserOutlined />), getItem('Danh sách duyệt', 'listBlog', <FormOutlined />)], 'group'),
  ];
  const renderPage = (key) => {
    switch (key) {
      case 'account':
        return (
          <CoordinatorAccount />
        )
      case 'listBlog':
        return (
          <CoordinatorEvent />
        )
      case 'contribution':
        return (
          <CoordinatorContribution />
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
  const navigate = useNavigate()
  const handleLogout = async () => {
    await UserService.logoutUser()
    navigate('/')
    window.location.reload();
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
