import React from 'react'
import { Layout, Dropdown,Menu,Avatar} from 'antd';
import { withRouter } from 'react-router-dom';
import { connect } from 'react-redux'
import { change } from '../../redux/actions/sideMenu'
import {
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserOutlined
} from '@ant-design/icons';
const { Header } = Layout;

function TopHeader(props) {
  // const [collapsed, setCollapsed] = useState(false);
  const user = JSON.parse(localStorage.getItem('token'))
  const menu = (
    <Menu
      items={[
        {
          key: '1',
          label: (
           user.role.roleName
          ),
        },
        {
          key: '4',
          danger: true,
          label: '退出登录',
          onClick:(()=>{
            localStorage.removeItem('token')
            props.history.replace('/login')
          })
        },
      ]}
    />
  );
  return (
    <Header
      className="site-layout-background"
      style={{
        padding: '0 16px',
      }}
    >
      {React.createElement(props.collapsed ? MenuUnfoldOutlined : MenuFoldOutlined, {
        className: 'trigger',
        onClick: () => props.change(props.collapsed),
      })}
      <div style={{ float: 'right' }}>
        <span>欢迎<span style={{color:'#1890ff'}}>{user.username}</span>回来</span>
        <Dropdown overlay={menu}>
          <Avatar size="large" icon={<UserOutlined />} />
        </Dropdown>
      </div>
    </Header>
  )
}
export default connect(
  state => ({collapsed:state.SideMenu}),
  {
    change
  }
)(withRouter(TopHeader))
