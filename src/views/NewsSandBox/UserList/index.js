import React, { useState, useEffect,useRef } from 'react'
import { Table, Button, Modal, Switch} from 'antd'
import axios from 'axios'
import UserForm from '../../../components/User_manage/UserForm';
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;

export default function UserList() {
  const [dataSource, setdataSource] = useState([])//用户数据
  const [isAddVisible, setisAddVisible] = useState(false)//添加用户弹出框显示
  const [isUpdateVisible, setisUpdateVisible] = useState(false)//更新用户弹出框显示
  const [isCurrentDisable, setisCurrentDisable] = useState(false)//更新用户弹出框显示
  const [roleList, setroleList] = useState([])//角色数据
  const [regionList, setregionList] = useState([])//区域数据
  const [currentId, setcurrentId] = useState(null)//当前用户数据
  const addForm = useRef(null)
  const updateForm = useRef(null)
  const {roleId,region,username} = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    //获得用户数据
    axios.get('/users?_expand=role').then(
      res => {
        let newList = res.data
        
        setdataSource(roleId===1?newList:[...newList.filter(item=>item.username===username),...newList.filter(item=>item.region===region && item.roleId===3)])
      }
    ) 
  }, [roleId,region,username])
  useEffect(()=>{
    axios.get('/regions').then(
      res => {
        let newList = res.data
        setregionList(newList)
      }
    )
  },[])
  useEffect(()=>{
    axios.get('/roles').then(
      res => {
        let newList = res.data
        setroleList(newList)
      }
    )
  },[])
  //删除用户
  function deleteUser(item){
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setdataSource(dataSource.filter(data=>{
          return data.id!==item.id
        }))
        axios.delete(`/users/${item.id}`)
      },
      onCancel() {
        
      },
    });
  }

  function handleState(item){
    item.roleState = !item.roleState
    setdataSource([...dataSource])
    
    axios.patch(`/users/${item.id}`,{roleState:item.roleState})
  }

  const  handleUpdate = async (item)=>{
    
      await setisUpdateVisible(true)
      if(item.roleId===1){
        setisCurrentDisable(true)
      }
      else{
        setisCurrentDisable(false)
      }
      setcurrentId(item.id)
      updateForm.current?.setFieldsValue(item)
     
  }

  const columns = [
    {
      title: '区域',
      filters: [...regionList.map((item)=>{
        return {text:item.title,value:item.value}
      }),{text:'全球',value:''}],
      
      dataIndex: 'region',
      render: (region) => {
        return <b>{region === '' ? '全球' : region}</b>
      },
      onFilter: (value, record) => record.region ===value,

    },
    {
      title: '角色名称',
      dataIndex: 'role',
      render: (role) => {
        return role?.roleName
      }
    },
    {
      title: '用户名',
      dataIndex: 'username',

    },
    {
      title: '用户状态',
      dataIndex: 'roleState',
      render: (roleState, item) => {
        return <Switch checked={roleState} onChange={()=>{handleState(item)}} disabled={item.default}></Switch>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div>
            <Button type="primary" shape="circle" disabled={item.default}  onClick={()=>handleUpdate(item)} icon={<EditOutlined />} />
            <Button type="danger" shape="circle" onClick={()=>deleteUser(item)} disabled={item.default} icon={<DeleteOutlined />} />


          </div>
        )
      }
    },
  ];
  return (
    <div>
      <Button type="primary" onClick={()=>{
        setisAddVisible(true)
        addForm.current?.resetFields()
      }}>添加用户</Button>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} pagination={{ pageSize: 5 }} />


      {/* 添加用户表单 */}
      <Modal
        visible={isAddVisible}
        title="添加用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setisAddVisible(false)
          
        }}
        onOk={() => {
          addForm.current.validateFields().then(
            value=>{
              setisAddVisible(false)
              // addForm.current.resetFields()
              axios.post('/users',{...value,default:false,roleState:true}).then(
                res=>{
                  
                  setdataSource([...dataSource,{...res.data,role:roleList.filter((item)=>item.id===value.roleId)[0]}])
                }
              ) 
              
            }
          ).catch(err=>{
            console.log(err)
          })
        }}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={addForm} ></UserForm>
      </Modal>

      {/* 添加用户表单 */}
      <Modal
        visible={isUpdateVisible}
        title="更新用户"
        okText="确定"
        cancelText="取消"
        onCancel={()=>{
          setisUpdateVisible(false)
          setisCurrentDisable(!isCurrentDisable)
        }}
        onOk={() => {
          updateForm.current.validateFields().then(
            value=>{
              setisUpdateVisible(false)
              // addForm.current.resetFields()
              setdataSource(dataSource.map((item)=>{
                if(item.id===currentId){
                  return {...item,...value,role:roleList.filter((data)=>data.id===value.roleId)[0]}
                }
                return item
              }))
              setisCurrentDisable(!isCurrentDisable)
              axios.patch(`/users/${currentId}`,value)
              
              
            }
          )
        }}
      >
        <UserForm roleList={roleList} regionList={regionList} ref={updateForm} isCurrentDisable={isCurrentDisable} isUpdate={true}></UserForm>
      </Modal>
    </div>
  )
}
