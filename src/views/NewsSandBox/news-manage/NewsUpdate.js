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
  useEffect(() => {
    axios.get('/categories').then(
      res=>{
        setcategoryList(res.data)
      }
    )
  }, [])
  useEffect(() => {
    axios.get(`/news/${props.match.params.id}?_expand=category`).then(
      res => {
        let {title,categoryId,content} = res.data
        NewsForm.current?.setFieldsValue({
          title,
          categoryId
        })
        setcontent(content)
      }
    )
  }, [props.match.params.id])
  
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
      axios.patch(`/news/${props.match.params.id}`,{
        ...formInfo,
        "content":content,
        "auditState":auditState,
        
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
        title="更新新闻"
        onBack={()=>{props.history.goBack()}}
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
      <NewsEditor getContent={getContent} content={content}></NewsEditor>
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
