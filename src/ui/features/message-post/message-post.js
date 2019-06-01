import React from 'react'

import { usePost } from '@brightleaf/react-hooks'
import { Button, Form, TextArea } from 'react-form-elements'

function MessagePost({ username, url }) {
  const { postData } = usePost(url)
  return (
    <Form
      name="chatText"
      onSubmit={mdata => {
        console.log('post')
        postData({
          ...mdata,
          user: username,
        })
      }}
    >
      <TextArea label="Message" name="message" />
      <Button>Send</Button>
    </Form>
  )
}

export default MessagePost
