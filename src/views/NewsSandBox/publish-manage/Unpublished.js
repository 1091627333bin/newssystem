import { Button} from 'antd'
import React from 'react'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
export default function Unpublished(props) {
  const {dataSource,handlePublish} = usePublish(1,props)
  return (
    <div>
      <NewsPublish dataSource={dataSource}  button={(id)=><Button  onClick={()=>handlePublish(id)} type='primary'>发布</Button>}></NewsPublish>
    </div>
  )
}
