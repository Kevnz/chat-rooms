import React, { useRef } from 'react'
import { Form, TextArea, Button } from 'react-form-elements'

function MessagePost({ username, onSubmit }) {
  const formRef = useRef(null)
  return (
    <Form
      ref={formRef}
      name="chatText"
      className="form"
      onSubmit={mdata => {
        onSubmit(
          {
            ...mdata,
            user: username,
          },
          formRef
        )
      }}
    >
      <TextArea
        label="Message"
        name="message"
        inputClassName="textarea"
        className="field control"
        labelClassName="label"
      />
      <Button className="button is-primary">Send</Button>
    </Form>
  )
}

export default MessagePost
