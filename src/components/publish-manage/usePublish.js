import axios from 'axios'
import { useEffect, useState } from 'react'
import { notification , Modal,} from 'antd'
import {ExclamationCircleOutlined } from '@ant-design/icons';
const { confirm } = Modal;
function usePublish(number, props) {
  const { username } = JSON.parse(localStorage.getItem('token'))
  const [dataSource, setdataSource] = useState([])

  useEffect(() => {
    axios(`/news?author=${username}&publishState=${number}&_expand=category`).then(
      res => {
        console.log(res.data)
        setdataSource(res.data)
      }
    )
  }, [username, number])
  
  function handleSunset(id) {
    axios.patch(`/news/${id}`, { publishState: 3 }).then(
      res => {
        props.history.replace('/publish-manage/sunset')
        notification.info({
          message: `通知`,
          description:
            `下线成功`,
          placement: 'bottomRight',
        });
      }
    )
  }
  function handlePublish(id) {
    axios.patch(`/news/${id}`, { publishState: 2, publishTime: Date.now() }).then(
      res => {
        props.history.replace('/publish-manage/published')
        notification.info({
          message: `通知`,
          description:
            `发布成功`,
          placement: 'bottomRight',
        });
      }
    )
  }
  function handleDelete(id) {

    confirm({
      title: '你确定要删除吗?',
      icon: <ExclamationCircleOutlined />,
      onOk() {
        setdataSource(dataSource.filter((data) => { return data.id !== id }))
        axios.delete(`/news/${id}`).then(
          res => {
            notification.info({
              message: `通知`,
              description:
                `删除成功`,
              placement: 'bottomRight',
            });
          }
        )
      },
      onCancel() {

      },
    });
  }
  return { dataSource, handleSunset, handlePublish, handleDelete }
}
export default usePublish
