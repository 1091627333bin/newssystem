
import React from 'react'
import { Button} from 'antd'
import NewsPublish from '../../../components/publish-manage/NewsPublish'
import usePublish from '../../../components/publish-manage/usePublish'
export default function Published(props) {
  const {dataSource,handleSunset} = usePublish(2,props)
  return (
    <div>
      <NewsPublish dataSource={dataSource} button={(id)=><Button onClick={()=>handleSunset(id)} type='primary'>下线</Button>}></NewsPublish>
    </div>
  )
}
