import { Button} from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
export default function Sunset(props) {
  const {dataSource,handleDelete} = usePublish(3,props)
  return (
    <div>
      <NewsPublish dataSource={dataSource}  button={(id)=><Button onClick={()=>handleDelete(id)} danger>删除</Button>}></NewsPublish>
    </div>
  )
}
