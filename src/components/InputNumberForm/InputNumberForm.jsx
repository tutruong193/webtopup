import { InputNumber } from 'antd'
import React from 'react'
const InputNumberForm = (props) => {
    const { min, max, placeholder = 'Nhập text', ...rests } = props
    const handleOnchangeInput = (e) => {
        props.onChange(e.target.value)
    }
  return (
    <InputNumber
        placeholder={placeholder} 
        {...rests} 
        min={min} // Sử dụng min như được cung cấp hoặc năm hiện tại nếu không có min
      max={max}
    />
  )
}

export default InputNumberForm