import React,{useEffect,useState} from 'react'
import axios from 'axios'
import './index.css'
import { Link } from 'react-router-dom';
import { Table, Button,notification} from 'antd'
import {CheckOutlined,CloseOutlined } from '@ant-design/icons';
export default function Audit() {
  const [dataSource, setdataSource] = useState([])//用户数据
  const {roleId,region} = JSON.parse(localStorage.getItem('token'))
  useEffect(()=>{
    axios.get(`/news?auditState=1&_expand=category`).then(
      res => {
        let newList = res.data
        console.log(res.data)
        setdataSource(roleId===1?newList:[...newList.filter(item=>item.region===region && item.roleId===3)])
      }
    ) 
  },[roleId,region])

  const columns = [
    {
      title: '新闻标题',
      dataIndex: 'title',
      render:(title,item)=>{
        return <Link to={`/news-manage/preview/${item.id}`}>{title}</Link>
      }
    },
    {
      title: '作者',
      dataIndex: 'author',
    },
    {
      title: '新闻分类',
      dataIndex: 'category',
      render: (category) => {
        return <div>{category.title}</div>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type='primary' onClick={()=>{handleSuccess(item)}} icon={<CheckOutlined />}></Button>
           <Button type='danger' onClick={()=>{handleFail(item)}} icon={<CloseOutlined />}></Button>
          
        </div>
      }
    }, 
  ];
  function handleSuccess(item){
    setdataSource(dataSource.filter((data)=>{return data.id!==item.id}))
    axios.patch(`/news/${item.id}`,{auditState:2,publishState:1}).then(
      res=>{
        notification.info({
          message: `通知`,
          description:
          `审核成功`,
          placement:'bottomRight',
        });
      }
    )
  }
  function handleFail(item){
    setdataSource(dataSource.filter((data)=>{return data.id!==item.id}))
    axios.patch(`/news/${item.id}`,{auditState:3}).then(
      res=>{
        notification.info({
          message: `通知`,
          description:
          `审核成功`,
          placement:'bottomRight',
        });
      }
    )
  }
  return (
    <div><Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/></div>
  )
}
