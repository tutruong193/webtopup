import React, { useState } from 'react'
import { getItem } from '../../utilis';
import { UserOutlined, FormOutlined, LogoutOutlined, MailOutlined, SettingOutlined } from '@ant-design/icons'
import { Menu } from 'antd'
import * as UserService from '../../services/UserService'
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router-dom'
import StudentPostBlog from '../../components/StudentComponent/StudentPostBlog/StudentPostBlog';
import AccountDetailComponent from '../../components/AccountDetailComponent/AccountDetailComponent';
const StudentPage = () => {
    const [cookiesAccessToken, setCookieAccessToken, removeCookie] = useCookies('')
    const items = [
        getItem('Functions', 'g2', null, [getItem('User Profile', 'user', <UserOutlined />), getItem('Post Contributions', 'postBlog', <FormOutlined />)], 'group'),
    ];
    const renderPage = (key) => {
        switch (key) {
            case 'user':
                return <AccountDetailComponent accesstoken={cookiesAccessToken.access_token}/>;
            case 'postBlog':
                return (
                    <StudentPostBlog />

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

export default StudentPage
