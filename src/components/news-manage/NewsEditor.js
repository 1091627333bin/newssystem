import React, { useState, useEffect } from 'react'
import { Editor } from 'react-draft-wysiwyg'
import 'react-draft-wysiwyg/dist/react-draft-wysiwyg.css'
import { convertToRaw, EditorState, ContentState } from 'draft-js'
import draftToHtml from 'draftjs-to-html'
import HtmlTodraft from 'html-to-draftjs'
export default function NewsEditor(props) {
  const [editorState, seteditorState] = useState('')
  useEffect(() => {
    if (props.content) {
      const html = props.content
      const contentBlock = HtmlTodraft(html)
      if (contentBlock) {
        const contentState = ContentState.createFromBlockArray(contentBlock.contentBlocks)
        const editorState = EditorState.createWithContent(contentState)
        seteditorState(editorState)
      }
    }


  }, [props.content])

  return (
    <div>
      <Editor
        editorState={editorState}
        onEditorStateChange={(editorState) => { seteditorState(editorState) }}
        onBlur={() => {
          // console.log(draftToHtml(convertToRaw(editorState.getCurrentContent())))
          props.getContent(draftToHtml(convertToRaw(editorState.getCurrentContent())))
        }}
      />
    </div>
  )
}
