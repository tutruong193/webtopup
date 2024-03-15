import { Button } from 'antd'
import React from 'react'

const ButtonComponent = ({ size, styleButton, styleTextButton, textButton, disabled, ...rests }) => {
    return (
        <Button

            style={{
                ...styleButton,
                background: disabled ? '#ccc' : styleButton.background,
                justifyContent: 'center',
                alignItems: 'center',
                display: 'flex'
            }}
            size={size}
            {...rests}
        >
            <span style={styleTextButton}>{textButton}</span>
        </Button>
    )
}

export default ButtonComponent