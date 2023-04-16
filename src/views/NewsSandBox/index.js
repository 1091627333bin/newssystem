import React, { useEffect } from 'react'

import { Layout } from 'antd';
import SideMenu from '../../components/NewsSandBox/SideMenu'
import TopHeader from '../../components/NewsSandBox/TopHeader'
import NewsRouter from '../../components/NewsSandBox/NewsRouter';
import './index.css'
//引入进度条
import nProgress from "nprogress";

//引入进度条样式
import 'nprogress/nprogress.css'
const {Content } = Layout;
export default function NewsSandBox() {
  nProgress.start()
  useEffect(()=>{
    nProgress.done()
  })
  return (
    <Layout >
      <SideMenu></SideMenu>

      <Layout className="site-layout">
        <TopHeader></TopHeader>

        <Content
          className="site-layout-background"
          style={{
            margin: '24px 16px',
            padding: 24,
            minHeight: 280,
            overflow:'auto'
          }}
        >
        <NewsRouter></NewsRouter>
        </Content>
      </Layout>

    </Layout >
  )
}
