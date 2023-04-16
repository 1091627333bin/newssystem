import React,{useEffect,useState,useRef,useContext} from 'react'
import axios from 'axios'
import { Table, Button,Modal,Form,Input} from 'antd'
import {DeleteOutlined,ExclamationCircleOutlined} from '@ant-design/icons';
const { confirm } = Modal;
const EditableContext = React.createContext(null);
export default function Newscategory() {
  
  const [dataSource, setdataSource] = useState([])
  useEffect(() => {
    axios(`/categories`).then(
      res=>{
        console.log(res.data)
        setdataSource(res.data)
      }
    )
  }, [])
  const EditableRow = ({ index, ...props }) => {
    const [form] = Form.useForm();
    return (
      <Form form={form} component={false}>
        <EditableContext.Provider value={form}>
          <tr {...props} />
        </EditableContext.Provider>
      </Form>
    );
  };
   function handleSave(record){
    setdataSource(dataSource.map((item)=>{
      if(item.id===record.id){
        return {title:record.title,id:record.id,value:record.title}
      }
      return item
    }))
    axios.patch(`/categories/${record.id}`,{title:record.title,value:record.title})
   }
  const EditableCell = ({
    title,
    editable,
    children,
    dataIndex,
    record,
    handleSave,
    ...restProps
  }) => {
    const [editing, setEditing] = useState(false);
    const inputRef = useRef(null);
    const form = useContext(EditableContext);
    useEffect(() => {
      if (editing) {
        inputRef.current.focus();
      }
    }, [editing]);
  
    const toggleEdit = () => {
      setEditing(!editing);
      form.setFieldsValue({
        [dataIndex]: record[dataIndex],
      });
    };
  
    const save = async () => {
      try {
        const values = await form.validateFields();
        toggleEdit();
        handleSave({ ...record, ...values });
      } catch (errInfo) {
        console.log('Save failed:', errInfo);
      }
    };
  
    let childNode = children;
  
    if (editable) {
      childNode = editing ? (
        <Form.Item
          style={{
            margin: 0,
          }}
          name={dataIndex}
          rules={[
            {
              required: true,
              message: `${title} is required.`,
            },
          ]}
        >
          <Input ref={inputRef} onPressEnter={save} onBlur={save} />
        </Form.Item>
      ) : (
        <div
          className="editable-cell-value-wrap"
          style={{
            paddingRight: 24,
          }}
          onClick={toggleEdit}
        >
          {children}
        </div>
      );
    }
  
    return <td {...restProps}>{childNode}</td>;
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
      title: '栏目名称',
      dataIndex: 'title',
      onCell: (record) => ({
        record,
        editable: true,
        dataIndex: 'title',
        title: '栏目名称',
        handleSave,
      }),
    },
    {
      title: '操作',
      render: (item) => {
        return <div>
          <Button type="danger" onClick={() => handleDelete(item)} shape="circle" icon={<DeleteOutlined />} />
          
        </div>
      }
    }, 
  ];
  function handleDelete(item){
    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setdataSource(dataSource.filter(data=>data.id!==item.id))
        axios.delete(`/categories/${item.id}`)

      },
      onCancel() {
        
      },
    });
  }
  return (
    <div><Table dataSource={dataSource} columns={columns}  rowKey={(item) => item.id} components={{
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    }}/></div>
  )
}
