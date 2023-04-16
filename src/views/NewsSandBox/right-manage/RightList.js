import React, { useState, useEffect } from 'react'
import { Table, Tag, Button, Modal, Switch, Popover } from 'antd'
import axios from 'axios'
import { EditOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
export default function RightList() {

  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    //获得menu数据
    axios.get('/rights?_embed=children').then(
      res => {
        let newList = res.data
        newList.forEach((item) => {
          if (item.children.length === 0) {
            item.children = ''
          }
        })
        setdataSource(newList)
      }
    )
  }, [])

  //删除权限
  function deleteRight(item) {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {

        if (item.grade === 1) {
          setdataSource(dataSource.filter(data => data.id !== item.id))
          axios.delete(`/rights/${item.id}`)
        }
        else {
          let list = dataSource.filter((data) => (data.id === item.rightId))
          list[0].children = list[0].children.filter((data) => (data.id !== item.id))
          setdataSource([...dataSource])
          axios.delete(`/children/${item.id}`)
        }

      },
      onCancel() {
        
      },
    });
  }
  //修改配置项
  function changePermission(item){
    item.pagepermisson = item.pagepermisson ===1?0:1
    setdataSource([...dataSource])
    if (item.grade === 1) {
      axios.patch(`/rights/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
    else {
      axios.patch(`/children/${item.id}`,{
        pagepermisson:item.pagepermisson
      })
    }
  }

  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }

    },
    {
      title: '权限名称',
      dataIndex: 'title',
      key: 'title',
    },
    {
      title: '权限路径',
      dataIndex: 'key',
      key: 'key',
      render: (key) => {
        return <Tag color='blue'>{key}</Tag>
      }
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div >
            <Popover content={
            <div>
              <Switch checked={item.pagepermisson} onClick={()=>{changePermission(item)}}></Switch>
            </div>} 
            title="配置项" trigger={item.pagepermisson===undefined?'':'click'}>
              <Button type="primary" shape="circle" icon={<EditOutlined />} disabled={item.pagepermisson===undefined}/>
            </Popover>
            <Button type="danger" onClick={() => deleteRight(item)} shape="circle" icon={<DeleteOutlined />} />


          </div>
        )
      }
    },
  ];
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} pagination={{ pageSize: 5 }} />
    </div>
  )
}
