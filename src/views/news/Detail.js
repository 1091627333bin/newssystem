import React, { useEffect, useState } from 'react'
import { Descriptions, message, PageHeader } from 'antd';
import axios from 'axios';
import {HeartTwoTone} from '@ant-design/icons';
import moment from 'moment';
export default function Detail(props) {
    const [newsInfo, setnewsInfo] = useState({})
    const [starState, setstarState] = useState(0)
    useEffect(() => {
        axios.get(`/news/${props.match.params.id}?_expand=category`).then(
            res => {
                setnewsInfo({
                    ...res.data,
                    view:res.data.view+1
                })
                return res.data
            }).then(
                res=>{
                    axios.patch(`/news/${props.match.params.id}?_expand=category`,{view:res.view+1})
                }
            )
    }, [props.match.params.id])

    function handleStar(){
        if(starState===0){
            setstarState(1)
            setnewsInfo({
                ...newsInfo,
                star:newsInfo.star+1
            })
            axios.patch(`/news/${props.match.params.id}?_expand=category`,{star:newsInfo.star+1}).then(
                res=>{
                    message.success('点赞成功');
                }
            )
        }
        else{
            message.warning('你已经点过赞了');
        }
        
    }
    return (
        <div>
            <PageHeader
                onBack={() => window.history.back()}
                title={newsInfo.title}
                subTitle={<div>
                        {newsInfo.category?.title}
                        <HeartTwoTone twoToneColor='#eb2f96' onClick={()=>{handleStar()}}></HeartTwoTone>
                </div>}
            >
                <Descriptions size="small" column={3}>
                    <Descriptions.Item label="创建者">{newsInfo.author}</Descriptions.Item>
                    <Descriptions.Item label="发布时间">{newsInfo.publishTime ? moment(newsInfo.publishTime).format('YYYY/MM/DD HH:mm:ss') : '-'}</Descriptions.Item>
                    <Descriptions.Item label="区域">{newsInfo.region}</Descriptions.Item>
                    <Descriptions.Item label="访问数量">{newsInfo.view}</Descriptions.Item>
                    <Descriptions.Item label="点赞数量">{newsInfo.star}</Descriptions.Item>
                    <Descriptions.Item label="评论数量">0</Descriptions.Item>
                </Descriptions>
            </PageHeader>

            <div dangerouslySetInnerHTML={{ __html: newsInfo.content }} style={{ margin: '0 24px' }}></div>
        </div>
    )
}
