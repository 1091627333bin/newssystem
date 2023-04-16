import React, { useEffect ,useState} from 'react'
import axios from 'axios'
import { Link } from 'react-router-dom';
import { PageHeader, Card, Col, Row,List } from 'antd';
import _ from 'lodash'
export default function News() {
    const [newsList, setnewsList] = useState([])
    useEffect(() => {
        axios.get('/news?publishState=2&_expand=category').then(
            res => {
                console.log(Object.entries(_.groupBy(res.data, item => item.category.title)))
                setnewsList(Object.entries(_.groupBy(res.data, item => item.category.title)))

            }
        )

    }, [])
    return (
        <div>
            <PageHeader
                className="site-page-header"
                title="全球大新闻"
                subTitle="查看新闻"
            />
            <div style={{ width: '95%', margin: '0 auto' }}>
                <Row gutter={[16,16]}>
                    {/* <Col span={8}>
                        <Card title="Card title" bordered={true} hoverable >
                            <List
                                pagination={{pageSize:3}}
                                dataSource={[1,2,3]}
                                renderItem={(item) => (
                                    <List.Item>
                                       {item}
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col> */}
                    {newsList.map((item)=>{
                        return <Col span={8} key={item[0]}>
                        <Card title={item[0]} bordered={true} hoverable  >
                            <List
                                pagination={{pageSize:3}}
                                dataSource={item[1]}
                                renderItem={(item2) => (
                                    <List.Item>
                                       <Link to={`/detail/${item2.id}`}>{item2.title}</Link>
                                    </List.Item>
                                )}
                            />
                        </Card>
                    </Col>
                    })}
                   
                </Row>
            </div>
        </div>
    )
}
