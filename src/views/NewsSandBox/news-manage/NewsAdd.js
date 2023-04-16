import React, { useState,useEffect,useRef } from 'react'
import { Button, PageHeader, Steps, Form, Input ,Select,message,notification} from 'antd';
import axios from 'axios'
import NewsEditor from '../../../components/news-manage/NewsEditor'
const { Step } = Steps;
const { Option } = Select;

export default function NewsAdd(props) {
  const NewsForm = useRef(null)
  const [current, setcurrent] = useState(0)
  const [categoryList, setcategoryList] = useState([])
  const [formInfo, setformInfo] = useState({})
  const [content, setcontent] = useState('')
  const User = JSON.parse(localStorage.getItem('token'))
  useEffect(() => {
    axios.get('/categories').then(
      res=>{
        setcategoryList(res.data)
      }
    )
  }, [])
  
  //下一步
  function handleNext(){
    if(current===0){
      NewsForm.current.validateFields().then( 
        value=>{
          setcurrent(current+1)
          setformInfo(value)
        }
      ).catch(err=>{
        console.log(err)
      })
    }
    else{
      if(content===''|| content.trim()==='<p></p>'){
        message.error('新闻内容不能为空')
      }
      else{
        setcurrent(current+1)
      }
      
    }
  }
  //上一步
  function handlePre(){
    setcurrent(current-1)
  }
  //获得文本内容
  function getContent(value){
    setcontent(value)
  }
  //保存草稿箱或审核
  function handleSave(auditState){
      axios.post('/news',{
        ...formInfo,
        "content":content,
        "region":User.region?User.region:'全球',
        "author":User.username,
        "roleId":User.roleId,
        "auditState":auditState,
        "publishState":0,
        "createTime":Date.now(),
        "star":0,
        "view":0,
        // "publishTime":0
      }).then(
        res=>{
          props.history.replace(auditState===0?'/news-manage/draft':'/audit-manage/list')
          notification.info({
            message: `通知`,
            description:
            `${auditState===0?'保存草稿箱':'审核提交'}成功`,
            placement:'bottomRight',
          });
        }
      )
  }
  return (
    <div>
      <PageHeader
        title="撰写新闻"
      />
      <Steps current={current}>
        <Step title="基本信息" description="新闻标题，新闻分类" />
        <Step title="新闻内容" description="新闻主题内容" />
        <Step title="新闻提交" description="保存草稿或者提交审核" />
      </Steps>

      <div style={{ display: current === 0 ? 'block' : 'none', marginTop: '50px' }}>

        <Form
        ref={NewsForm}
        >
          <Form.Item
            name="title"
            label="新闻标题"
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
            name="categoryId"
            label="新闻分类"
            rules={[
              {
                required: true,
                message: 'Please input the title of collection!',
              },
            ]}
          >
            <Select >
              {
                categoryList.map((item)=>{
                  return <Option key={item.id} value={item.id}>{item.title}</Option>
                })
              }
            </Select>
          </Form.Item>


        </Form>
      </div>
          
      <div style={{ display: current === 1 ? 'block' : 'none', marginTop: '50px' }}>
      <NewsEditor getContent={getContent}></NewsEditor>
      </div>
      
      <div style={{ display: current === 2 ? 'block' : 'none', marginTop: '50px' }}>

      </div>
      
      <div style={{ marginTop: '50px' }}>
        {
          current === 2 && <span>
            <Button type='primary' onClick={()=>{handleSave(0)}}>保存草稿箱</Button>
            <Button type='danger' onClick={()=>{handleSave(1)}}>提交审核</Button>
          </span>
        }

        {
          current < 2 && <Button type='primary' onClick={handleNext}>下一步</Button>
        }
        {
          current > 0 && <Button type='primary' onClick={handlePre}>上一步</Button>
        }

      </div>
    </div>
  )
}
