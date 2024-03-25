import { Input } from 'antd'
import React from 'react'

const InputComponent = ({ size, placeholder, bordered, style, value, ...rests }) => {
  return (
    <Input
      size={size}
      placeholder={placeholder}
      style={style}
      value={value}
      {...rests}
    />
  )
}

export default InputComponent