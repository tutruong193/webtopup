import { Button, Input } from 'antd';
import React, { useEffect, useState } from 'react';
import * as UserService from '../../services/UserService';
import { useParams } from 'react-router-dom';
import * as Message from '../../components/Message/Message'
import { useNavigate } from 'react-router-dom';
const ActivePage = () => {
    const { id } = useParams();
    const [code, setCode] = useState('');
    const handleOnchangeCode = (e) => {
        setCode(e.target.value);
    }
    const navigate = useNavigate()
    const handleVerify = async () => {
        try {
            const res = await UserService.verifyActivationCode(id, code);
            if (res.status === 'ERR') {
                Message.error('Code is not correct')
            } else {
                Message.success('Verified');
                setTimeout(() => {
                    navigate('/signin');
                    window.location.reload();
                }, 2000);
            }
        } catch (error) {
            console.error('Error verifying activation code:', error);
        }
    }

    const handleResendCode = async () => {
        try {
            const res = await UserService.sendActivationCode(id);
            if (res.status === 'OK') {
                Message.success('Resend successful');
            }
        } catch (error) {
            console.error('Error resending activation code:', error);
        }
    }

    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            height: '100vh',
            backgroundColor: 'rgb(233, 236, 239)'
        }}>
            <div style={{ background: 'white', height: '50vh', width: '100vh', padding: '1.2rem', borderTop: '3px solid #d4dadf' }}>
                <h1 style={{ margin: 0, fontSize: '32px', fontWeight: 700, letterSpacing: '-1px', lineHeight: '48px' }}>Confirm Your Email Address</h1>
                <p style={{ margin: '20px 0px' }}>Tap the button below to confirm your email address. If you didn't create an account with Paste, you can safely delete this email.</p>
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    alignItems: 'center',
                    flexDirection: 'column',
                    width: '100%',
                    padding: '30px 0px'
                }}>
                    <div style={{
                        display: 'flex',
                        justifyContent: 'center',
                        alignItems: 'center',
                        flexDirection: 'column',
                        gap: "20px",
                    }}>
                        <Input placeholder="Enter activation code" style={{ height: '3rem', width: '12rem', fontSize: '20px' }} value={code} onChange={handleOnchangeCode} />
                        <Button style={{ height: '3rem', width: '6rem' }} type='primary' onClick={handleVerify}>Submit</Button>
                    </div>
                </div>
                <p style={{ margin: '20px 0px' }}>If you don't receive the code, <span style={{ cursor: 'pointer', color: 'blue' }} onClick={handleResendCode}>resend</span></p>
            </div>
        </div >
    );
};

export default ActivePage;
