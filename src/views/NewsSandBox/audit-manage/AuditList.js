import axios from 'axios'
import React,{useEffect,useState} from 'react'
import { Table, Button,notification,Tag} from 'antd'
import { Link } from 'react-router-dom';
export default function AuditList(props) {
  const User = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios(`/news?author=${User.username}&auditState_ne=0&publishState_lte=1&_expand=category`).then(
      res=>{
        console.log(res.data)
        setdataSource(res.data)
      }
    )
  }, [User.username])

  const auditList = ['未审核', '审核中', '已通过', '未通过']
  const colorList = ['black', 'orange', 'green', 'red']
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
      title: '审核状态',
      dataIndex: 'auditState',
      render: (auditState) => {
        return <Tag color={colorList[auditState]}>{auditList[auditState]}</Tag>
      }
    },
    {
      title: '操作',
      dataIndex: 'auditState',
      render: (auditState,item) => {
        return <div>
          {
            auditState===2 && <Button type='primary' onClick={()=>{handlePublish(item)}}>发布</Button>
          }
          {
            auditState===1 && <Button type='primary' onClick={()=>{handleBack(item)}}>撤销</Button>
          }
          {
            auditState===3 && <Button type='primary' onClick={()=>{handleUpdate(item)}}>更新</Button>
          }
        </div>
      }
    }, 
  ];
  //撤销功能
function handleBack(item){
  axios.patch(`/news/${item.id}`,{auditState:0}).then(
    res=>{
      props.history.replace('/news-manage/draft')
      notification.info({
        message: `通知`,
        description:
        `撤销成功`,
        placement:'bottomRight',
      });
    }
  )
}
  //更新
  function handleUpdate(item){
    props.history.push(`/news-manage/update/${item.id}`)
  }
  //发布
  function handlePublish(item){
    axios.patch(`/news/${item.id}`,{publishState:2,publishTime:Date.now()}).then(
      res=>{
        props.history.replace('/publish-manage/published')
        notification.info({
          message: `通知`,
          description:
          `发布成功`,
          placement:'bottomRight',
        });
      }
    )
  }
  return (
    <div> <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id}/></div>
  )
}
