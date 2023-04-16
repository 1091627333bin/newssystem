import React, { useState, useEffect } from 'react'
import { Table, Button, Modal,Tree } from 'antd'
import axios from 'axios'
import { UnorderedListOutlined, DeleteOutlined, ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
export default function RoleList() {
  const [dataSource, setdataSource] = useState([])//角色数据
  const [rightList, setrightList] = useState([])//权限列表数据
  const [currentRight, setcurrentRight] = useState([])//当前角色权限
  const [currentId, setcurrentId] = useState(0)//当前角色id
  const [isModalVisible, setisModalVisible] = useState(false)
  useEffect(() => {
    //获得角色数据
    axios.get('/roles').then(
      res => {
        
        setdataSource(res.data)
      }
    )
    //获得权限数据
    axios.get('/rights?_embed=children').then(
      res => {
       
        setrightList(res.data)
      }
    )
  }, [])
  //删除角色
  function deleteRole(item) {
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setdataSource(dataSource.filter(data => data.id !== item.id))
        axios.delete(`/roles/${item.id}`)
      },
      onCancel() {
       
      },
    });
  }
  //点击修改角色
  const showModal = (item) => {
    setcurrentRight(item.rights)
    setcurrentId(item.id)
    
    setisModalVisible(true);
  };
  //点击修改确定
  const handleOk = () => {
    // let list = dataSource.filter(item=>item.id===currentId)
    // list[0].rights = currentRight
    // setdataSource([...dataSource])

    //修改角色权限
    setdataSource(dataSource.map((item)=>{
      if(item.id===currentId){
        return {...item,rights:currentRight}
      }
      return item
    }))
    axios.patch(`/roles/${currentId}`,{
        rights:currentRight
      })
    setisModalVisible(false);
  };
  //点击修改取消
  const handleCancel = () => {
    setisModalVisible(false);
  };
  const columns = [
    {
      title: 'ID',
      dataIndex: 'id',
      render: (id) => {
        return <b>{id}</b>
      }

    },
    {
      title: '角色名称',
      dataIndex: 'roleName',
    },
    {
      title: '操作',
      render: (item) => {
        return (
          <div >
            <Button type="primary" shape="circle" onClick={()=>showModal(item)} icon={<UnorderedListOutlined />} />
            <Button type="danger" shape="circle" onClick={() => deleteRole(item)} icon={<DeleteOutlined />} />
          </div>
        )
      }
    },
  ];
  const onCheck = (checkedKeys) => {
    setcurrentRight(checkedKeys.checked)
  };
  return (
    <div>
      <Table dataSource={dataSource} columns={columns} rowKey={(item) => item.id} />
      <Modal title="权限分配" visible={isModalVisible} onOk={handleOk} onCancel={handleCancel}  >
        <Tree
          checkable
          onCheck={onCheck}
          checkStrictly={true}
          checkedKeys={currentRight}
          treeData={rightList}
        />
      </Modal>
    </div>
  )
}
