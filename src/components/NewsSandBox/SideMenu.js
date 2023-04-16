import React, { useEffect } from 'react'
import './index.css'
import { Layout, Menu } from 'antd';
import { useState } from 'react';
import { withRouter } from 'react-router-dom';
import axios from 'axios';
import { connect } from 'react-redux'


const { Sider } = Layout;

function SideMenu(props) {

  const [menu, setmenu] = useState([]);
  const {role:{rights}} = JSON.parse(localStorage.getItem('token'))
  //模拟数组结构 动态创建侧边栏
  function renderMenu(menuList) {
    return menuList.map(item => {
        if (item.children && item.children.length !== 0 && item.pagepermisson===1 && rights.includes(item.key)) {
          return {
            key: item.key, icon: item.icon, label: item.title, children: renderMenu(item.children)
          }
        }
          return item.pagepermisson===1 && rights.includes(item.key)&& {
            key: item.key, icon: item.icon, label: item.title, onClick: () => {
              props.history.push(item.key)
            }
          }
    })
  }
  useEffect(() => {
    //获得menu数据
    axios.get(`/rights?_embed=children`).then(
      res => {
        // let newArr = res.data
        // newArr.forEach(element => {
        //   let sum = 0
        //   if(element.children.length>0){
        //     element.children.forEach(element2=>{
              
        //       if(element2.pagepermisson===undefined ||element2.pagepermisson===0){
        //         sum +=1
        //         if(sum === element.children.length){
        //           element.children=''
        //         }
        //       }
        //     })
        //   }
        // });
        setmenu(res.data)
      }
    )
  },[])//中括号
  return (
    <Sider trigger={null} collapsible collapsed={props.collapsed}>
      <div className="logo">仲恺新闻发布系统</div>
      <Menu
        theme="dark"
        mode="inline"
        selectedKeys={[props.location.pathname]}
        defaultOpenKeys={['/'+props.location.pathname.split('/')[1]]}
        items={renderMenu(menu)}
      />
    </Sider>
  )
}
export default connect(
  state => ({collapsed:state.SideMenu}),
)(withRouter(SideMenu))