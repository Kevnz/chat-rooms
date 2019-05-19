import React from 'react'
import PropTypes from 'prop-types'
import { Form, TextBox, EmailInput, Button } from 'react-form-elements'

const LoginInput = ({ onSubmit, classes }) => {
  return (
    <div className={classes.formBase}>
      <Form onSubmit={onSubmit}>
        <EmailInput name="email" label="Email" />
        <TextBox name="password" label="Password" type="password" />
        <Button>Login</Button>
      </Form>
    </div>
  )
}

LoginInput.propTypes = {
  onSubmit: PropTypes.func,
}

LoginInput.defaultProps = {
  onSubmit: () => {},
}

export { LoginInput }

export default LoginInput
