import React, { useState } from 'react'
import { getItem } from '../../utilis';
import { UserOutlined, FormOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import * as UserService from '../../services/UserService'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import ManagerDashboard from '../../components/ManagerComponent/ManagerDashboard/ManagerDashboard';
import ManagerContribution from '../../components/ManagerComponent/ManagerContribution/ManagerContribution';
import AccountDetailComponent from '../../components/AccountDetailComponent/AccountDetailComponent';

const ManagerPage = () => {

  const items = [
    getItem('Functions', 'g2', null, [getItem('Account', 'account', <UserOutlined />),getItem('Dashboard', 'dashboard', <UserOutlined />), getItem('List Contribution', 'listContribution', <FormOutlined />)], 'group'),
  ];
  const renderPage = (key) => {
    switch (key) {
      case 'account':
        return <AccountDetailComponent accesstoken={cookiesAccessToken.access_token}/>;
      case 'dashboard':
        return (
          <ManagerDashboard />

        )
      case 'listContribution':
        return (
          <ManagerContribution />
        )
      default:
        return <></>
    }
  }
  const [keySelected, setKeySelected] = useState('dashboard')

  const handleOnCLick = ({ key }) => {
    setKeySelected(key)
  }
  const [cookiesAccessToken, setCookieAccessToken, removeCookie] = useCookies('')
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
          defaultSelectedKeys={['dashboard']}
        />
        <div style={{ flex: 1, padding: '15px' }}>
          {renderPage(keySelected)}
        </div>
      </div>

    </>
  )
}

export default ManagerPage
