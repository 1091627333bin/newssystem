import React, { forwardRef, useEffect, useState } from 'react'
import { Form, Input, Select } from 'antd'
const { Option } = Select;
const UserForm = forwardRef((props, ref) => {
  const [isDisable, setisDisable] = useState(false)
  useEffect(() => {
    setisDisable(props.isCurrentDisable)
  }, [props.isCurrentDisable])
  const {roleId,region} = JSON.parse(localStorage.getItem('token'))
  
  const checkRegionDisable=(item)=>{
    if(props.isUpdate){
      if(roleId===1){
        return false
      }
      else{
        return true
      }
    }
    else{
      if(roleId===1){
        return false
      }
      else{
        return item.value!==region
      }
    }
  }
  const checkRoleDisable=(item)=>{
    if(props.isUpdate){
      if(roleId===1){
        return false
      }
      else{
        return true
      }
    }
    else{
      if(roleId===1){
        return false
      }
      else{
        return item.id!==3
      }
    }
  }
  return (
    <Form
      layout="vertical"
      ref={ref}
    >
      <Form.Item
        name="username"
        label="用户名"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input />
      </Form.Item>

      <Form.Item
        name="password"
        label="密码"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Input type='password' />
      </Form.Item>
      <Form.Item
        name="region"
        label="区域"
        rules={
          isDisable ? [] : [{
            required: true,
            message: 'Please input the title of collection!',
          }]
        }
      >
        <Select disabled={isDisable}>
          {
            props.regionList.map(item => {
              return <Option key={item.id} disabled={checkRegionDisable(item)} value={item.value}>{item.title}</Option>
            })
          }
        </Select>
      </Form.Item>
      <Form.Item
        name="roleId"
        label="角色"
        rules={[
          {
            required: true,
            message: 'Please input the title of collection!',
          },
        ]}
      >
        <Select onChange={(value) => {
          value === 1 ? setisDisable(true) : setisDisable(false)
          if (value === 1) {
            setisDisable(true)
            ref.current.setFieldsValue({ region: '' })
          }
        }}>
          {
            props.roleList.map(item => {
              return <Option key={item.id} disabled={checkRoleDisable(item)} value={item.id}>{item.roleName}</Option>
            })
          }
        </Select>
      </Form.Item>

    </Form>
  )
})
export default UserForm
