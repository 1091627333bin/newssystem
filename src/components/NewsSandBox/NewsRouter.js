import React, { useEffect, useState } from 'react'
import Home from '../../views/NewsSandBox/Home'
import UserList from '../../views/NewsSandBox/UserList'
import NoPermission from '../../views/NewsSandBox/NoPermission'
import RoleList from '../../views/NewsSandBox/right-manage/RoleList'
import RightList from '../../views/NewsSandBox/right-manage/RightList'
import { Redirect, Route, Switch } from 'react-router-dom'
import NewsAdd from '../../views/NewsSandBox/news-manage/NewsAdd'
import NewsDraft from '../../views/NewsSandBox/news-manage/NewsDraft'
import Newscategory from '../../views/NewsSandBox/news-manage/Newscategory'
import NewsPreview from '../../views/NewsSandBox/news-manage/NewsPreview'
import NewsUpdate from '../../views/NewsSandBox/news-manage/NewsUpdate'
import Audit from '../../views/NewsSandBox/audit-manage/Audit'
import AuditList from '../../views/NewsSandBox/audit-manage/AuditList'
import Unpublished from '../../views/NewsSandBox/publish-manage/Unpublished'
import Published from '../../views/NewsSandBox/publish-manage/Published'
import Sunset from '../../views/NewsSandBox/publish-manage/Sunset'
import axios from 'axios'
import { Spin } from 'antd'
import { connect } from 'react-redux'


 function NewsRouter(props) {
    const { role: { rights } } = JSON.parse(localStorage.getItem('token'))
    const [BackRouteList, setBackRouteList] = useState([])
    useEffect(() => {
        Promise.all([
            axios.get('/rights'),
            axios.get('/children'),
        ]).then(
            res => {
                setBackRouteList([...res[0].data, ...res[1].data])
            }

        )
    }, [])


    const LocalRouterMap = {
        '/home': Home,
        '/user-manage/list': UserList,
        '/right-manage/role/list': RoleList,
        '/right-manage/right/list': RightList,
        '/news-manage/add': NewsAdd,
        '/news-manage/draft': NewsDraft,
        '/news-manage/category': Newscategory,
        '/news-manage/preview/:id': NewsPreview,
        '/news-manage/update/:id': NewsUpdate,
        '/audit-manage/audit': Audit,
        '/audit-manage/list': AuditList,
        '/publish-manage/unpublished': Unpublished,
        '/publish-manage/published': Published,
        '/publish-manage/sunset': Sunset,
    }
    function checkRoute(item) {
        return LocalRouterMap[item.key] && (item.pagepermisson || item.routepermisson)
    }
    function CheckUserPermisson(item) {
        return rights.includes(item.key)
    }
    return (
        <Spin size='large' spinning={props.spinning}>
            <Switch>
                {
                    //限制通过地址栏去其他页面
                    BackRouteList.map((item) => {
                        if (checkRoute(item) && CheckUserPermisson(item)) {
                            return <Route path={item.key} key={item.key} component={LocalRouterMap[item.key]} exact></Route>
                        }
                        return null
                    })
                }
                <Redirect path="/" to='/home' exact></Redirect>
                {
                    BackRouteList.length > 0 && <Route path="*" component={NoPermission}></Route>
                }
            </Switch>
        </Spin>
    )
}

export default connect(
    state=>({spinning:state.spinning}),
)(NewsRouter)
