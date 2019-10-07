import React, { useContext, useEffect } from 'react'
import { Form, TextBox, Password, Button } from 'react-form-elements'
import { navigate } from '@reach/router'
import { Container, Section } from '@brightleaf/elements'
import { useMutation } from '../hooks/use-mutation'
import { AuthContext } from '../core/context/auth'

const LOGIN_MUTATION = `
  mutation Login($loginInput: LoginInput!) {
    login(loginInput: $loginInput) {
      token
      user {
        id
        firstName
        lastName
        username
        email
      }
    }
  }
`

export const LoginPage = () => {
  const { loading, error, data, complete, makeQuery: loginUser } = useMutation(
    '/graphql',
    LOGIN_MUTATION
  )
  console.log('loading', { loading, error, data, complete })
  const { state, dispatch } = useContext(AuthContext)

  if (state.isLoggedIn) {
    navigate('/', {
      message: 'Logged In',
    })
  }
  useEffect(() => {
    console.log('use eff')
    if (complete && data && data.login) {
      const { token, user } = data.login

      dispatch({
        type: 'login',
        payload: { token, user },
      })
    }
  }, [complete, data])
  console.log('complete && data ', complete, data)
  return (
    <Container>
      <Section>
        <Form
          className="form"
          name="loginForm"
          onSubmit={formData => {
            loginUser({ loginInput: formData })
          }}
        >
          <TextBox
            type="email"
            label="Email"
            name="email"
            className="field control"
            inputClassName="input"
            labelClassName="label"
          />
          <Password
            label="Password"
            name="password"
            className="field control"
            inputClassName="input"
            labelClassName="label"
          />
          <Button>Login</Button>
        </Form>
      </Section>
    </Container>
  )
}

export default LoginPage
