import React, { useEffect, useRef, useState } from 'react'
import {  Card, Col, Row, List, Avatar, Drawer } from 'antd';
import { Link } from 'react-router-dom';
import { EditOutlined, EllipsisOutlined, SettingOutlined } from '@ant-design/icons';
import axios from 'axios';
import * as echarts from 'echarts'
import _ from 'lodash'
const { Meta } = Card;
export default function Home() {
    const [viewList, setviewList] = useState([])
    const [starList, setstarList] = useState([])
    const [allList, setallList] = useState([])
    const [visible, setVisible] = useState(false);
    const [myCharts, setmyCharts] = useState(null);
    const BarRef = useRef()
    const PieRef = useRef()
    const User = JSON.parse(localStorage.getItem('token'))
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=view&_order=desc&_limit=6').then(
            res => {
                setviewList(res.data)
            }
        )

    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category&_sort=star&_order=desc&_limit=6').then(
            res => {
                setstarList(res.data)
            }
        )
    }, [])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(
            res => {
                console.log(_.groupBy(res.data, item => item.category.title))
                renderBarView(_.groupBy(res.data, item => item.category.title))
                setallList(res.data)
            }
        )
        return () => {
            window.onresize = null
        }

    }, [])

    function renderBarView(obj) {
        

        let barCharts = echarts.init(BarRef.current)
        barCharts.setOption({
            title: {
                text: '新闻分类图示'
            },
            legend: {
                data: ['数量']
            },
            xAxis: {
                data: Object.keys(obj),
                axisLabel: {
                    rotate: '45'
                }
            },
            yAxis: {
                minInterval: 1
            },
            series: [
                {
                    name: '数量',
                    type: 'bar',
                    data: Object.values(obj).map(item => {
                        return item.length
                    }),

                }
            ],
            tooltip: {}
        })
        window.onresize = () => {
            barCharts.resize()
        }
    }

    function renderPieView() {
        let currentList = allList.filter((item)=>{return item.author===User.username})
        // console.log(allList)
       let obj =  _.groupBy(currentList, item => item.category.title)
       let list = []
       
       for(var i in obj){
        list.push({
            value:obj[i].length,
            name:i
        })
       }
        let pieCharts
        if(!myCharts){
            pieCharts = echarts.init(PieRef.current)
            setmyCharts(pieCharts)
        }
        else{
            pieCharts=myCharts
        }
        pieCharts.setOption({
            title: {
              text: '当前用户新闻图示',
              left: 'center'
            },
            tooltip: {
              trigger: 'item'
            },
            legend: {
              orient: 'vertical',
              left: 'left'
            },
            series: [
              {
                name: '发布数量',
                type: 'pie',
                radius: '50%',
                data: list,
                emphasis: {
                  itemStyle: {
                    shadowBlur: 10,
                    shadowOffsetX: 0,
                    shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
                }
              }
            ]
          });
    }
    
    const onClose = () => {
        setVisible(false);
    };
    return (
        <div className="site-card-wrapper">
            <Row gutter={16}>
                <Col span={8}>
                    <Card title="用户常用浏览" bordered={true}>
                        <List
                            dataSource={viewList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card title="用户点赞最多" bordered={true}>
                        <List
                            dataSource={starList}
                            renderItem={(item) => (
                                <List.Item>
                                    <Link to={`/news-manage/preview/${item.id}`}>{item.title}</Link>
                                </List.Item>
                            )}
                        />
                    </Card>
                </Col>
                <Col span={8}>
                    <Card
                        cover={
                            <img
                                alt="example"
                                src="https://gw.alipayobjects.com/zos/rmsportal/JiqGstEfoWAOHiTxclqi.png"
                            />
                        }
                        actions={[
                            <SettingOutlined key="setting" onClick={async() => {
                                await setVisible(true)
                                renderPieView()
                            }} />,
                            <EditOutlined key="edit" />,
                            <EllipsisOutlined key="ellipsis" />,
                        ]}
                    >
                        <Meta
                            avatar={<Avatar src="https://joeschmoe.io/api/v1/random" />}
                            title={User.username}
                            description={
                                <div>
                                    <b>{User.region === '' ? '全球' : User.region}</b>
                                    <span style={{ marginLeft: '30px' }}>{User.role.roleName}</span>
                                </div>
                            }
                        />
                    </Card>

                </Col>
            </Row>
            <div ref={BarRef} id="main" style={{ height: '400px', marginTop: '30px' }}> </div>
            <Drawer width='500px' title="个人新闻分类" placement="right" onClose={onClose} visible={visible}>
                <div ref={PieRef} style={{ height: '400px', marginTop: '30px' }}> </div>
            </Drawer>

        </div>

    )
}
