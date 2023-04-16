UseRef与forwardRef

JsonServer
登录时：该角色状态 && 账号密码 && 获得该用户与拥有的角色数据作为token
后台数据中有该用户所拥有的权限，在登录时存进token，然后根据token中的值与总权限相比较,筛选出侧边栏

设置映射表，因为后端不知道你的组件名字，需要动态设置路由

设置权限路由：总路由表格的pagepermission为1 && 角色拥有该路由
进度条：nprogress
时间：moment
富文本编辑器:
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
<Editor
        editorState={editorState}
        onEditorStateChange={(editorState)=>{seteditorState(editorState)}}
        onBlur={()=>{
            // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
            props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
/>
Form表格中的ref方法：作验证与修改

redux-persist:redux的持久化