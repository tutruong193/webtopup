import React, { useEffect, useState } from 'react'
import ButtonComponent from '../../components/ButtonComponent/ButtonComponent'
import InputForm from '../../components/InputForm/InputForm'
import { WrapperContainerLeft, WrapperContainerRight, WrapperTextLight } from './style'
import imageLogo from '../../assets/images/logo-login.png'
import { Image } from 'antd'
import { EyeFilled, EyeInvisibleFilled } from '@ant-design/icons'
import { useNavigate } from 'react-router-dom'
import { useMutationHooks } from '../../hooks/useMutationHook'
import * as UserService from '../../services/UserService'
import { useCookies } from 'react-cookie'
import { jwtTranslate } from '../../utilis'
const SignInPage = () => {
    const [isShowPassword, setIsShowPassword] = useState(false)
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [cookiesAccessToken, setCookieAccessToken] = useCookies('')
    const mutation = useMutationHooks(
        data => UserService.loginUser(data),
    )
    const { data, isSuccess } = mutation
    console.log('mutation', mutation)
    const navigate = useNavigate()

    const handleNavigateHomePage = () => {
        navigate('/')
    }
    const handleOnchangeEmail = (value) => {
        setEmail(value)
    }
    const handleOnchangePassword = (value) => {
        setPassword(value)
    }
    const handleLogin = () => {
        mutation.mutate({
            email,
            password
        })
    }
    useEffect(() => {
        if (isSuccess && data?.status == 'OK') {
            setCookieAccessToken('access_token', `Bearer ${data?.access_token}`, { path: '/', encode: String })
            const user = jwtTranslate(cookiesAccessToken);
            console.log('user', user)
            switch (user?.role) {
                case 'Admin':
                    navigate('/system/admin');
                    break;
                case 'Student':
                    navigate('/system/student');
                    break;
                default:
                    navigate('/signin');
            }
        }
    }, [isSuccess])
    return (
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', background: 'rgba(0, 0, 0, 0.53)', height: '100vh' }}>
            <div style={{ width: '800px', height: '445px', borderRadius: '6px', background: '#fff', display: 'flex' }}>
                <WrapperContainerLeft>
                    <h1>LOGIN</h1>
                    <p>Đăng nhập vào tạo tài khoản</p>
                    {data?.status == 'ERR' ? <span style={{ color: 'red' }}>{data?.message}</span> : <></>}
                    <InputForm style={{ marginBottom: '10px' }} placeholder="abc@gmail.com" value={email} onChange={handleOnchangeEmail} />
                    <div style={{ position: 'relative' }}>
                        <span
                            onClick={() => setIsShowPassword(!isShowPassword)}
                            style={{
                                zIndex: 10,
                                position: 'absolute',
                                top: '4px',
                                right: '8px'
                            }}
                        >{
                                isShowPassword ? (
                                    <EyeFilled />
                                ) : (
                                    <EyeInvisibleFilled />
                                )
                            }
                        </span>
                        <InputForm
                            placeholder="password"
                            type={isShowPassword ? "text" : "password"}
                            value={password}
                            onChange={handleOnchangePassword}
                        />
                    </div>
                    {/* {data?.status === 'ERR' && <span style={{ color: 'red' }}></span>} */}
                    <ButtonComponent
                        disabled={!email.length || !password.length}
                        size={40}
                        onClick={handleLogin}
                        styleButton={{
                            background: 'rgb(255, 57, 69)',
                            height: '48px',
                            width: '100%',
                            border: 'none',
                            borderRadius: '4px',
                            margin: '26px 0 10px'
                        }}
                        textButton={'Đăng nhập'}
                        styleTextButton={{ color: '#fff', fontSize: '15px', fontWeight: '700' }}
                    ></ButtonComponent>
                    <p><WrapperTextLight>Quên mật khẩu?</WrapperTextLight></p>
                    <p>Quay về <WrapperTextLight onClick={handleNavigateHomePage}>Trang chủ</WrapperTextLight></p>
                </WrapperContainerLeft>
                <WrapperContainerRight>
                    <Image src={imageLogo} preview={false} alt="iamge-logo" height="203px" width="203px" />
                </WrapperContainerRight>
            </div>
        </div >
    )
}

export default SignInPage