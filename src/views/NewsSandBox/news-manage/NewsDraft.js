import React, { useState, useEffect } from 'react'
import { Table, Button,Modal,notification} from 'antd'

import axios from 'axios'
import {DeleteOutlined,EditOutlined,UploadOutlined ,ExclamationCircleOutlined } from '@ant-design/icons';
import { Link } from 'react-router-dom';
const { confirm } = Modal;
export default function NewsDraft(props) {
  const {username} = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    //获得menu数据
    axios.get(`/news?auditState=0&author=${username}&_expand=category`).then(
      res => {
        setdataSource(res.data)
      }
    )
  }, [username])
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }
    },
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
      render:(category)=>{
        return category.title
      }
    },
    {
      title: '操作',
      render:(item)=>{
        return <div >
              <Button  shape="circle" onClick={()=>{
                props.history.push(`/news-manage/update/${item.id}`)
              }} icon={<EditOutlined />} />
             <Button danger shape="circle" onClick={() => handleDelete(item)} icon={<DeleteOutlined />} />
             <Button type="primary" shape="circle" onClick={() => handleCheck(item)} icon={<UploadOutlined />} />
        </div>
      }
    },
  ];
  //提交审核
  function handleCheck(item){
    axios.patch(`/news/${item.id}`,{auditState:1}).then(
      res=>{
        props.history.replace('/audit-manage/list')
        notification.info({
          message: `通知`,
          description:
          `审核提交成功`,
          placement:'bottomRight',
        });
      }
    )
  }
  //删除
  function handleDelete(item){
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/news/${item.id}`)
      },
      onCancel() {
       
      },
    });
  }
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
    </div>
  )
}
