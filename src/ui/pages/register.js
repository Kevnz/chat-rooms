import React, { useContext } from 'react'
import { Form, TextBox, EmailInput, Button } from 'react-form-elements'
import { navigate } from '@reach/router'
import { useMutation } from '@brightleaf/react-hooks'
import { AuthContext } from '../core/context/auth'

const REGISTER_MUTATION = `
  mutation Register($newUserInput: NewUserInput!) {
    signup(newUserInput: $newUserInput) {
      token
      user {
        firstName
        lastName
        username
        email
      }
    }
  }
`

const RegisterForm = () => {
  console.info({ Form, TextBox, EmailInput, Button })
  console.info(useMutation)
  console.info(useContext)
  console.info(AuthContext)

  const { data, makeQuery } = useMutation('/graphql', REGISTER_MUTATION)
  const { state, dispatch } = useContext(AuthContext)
  if (!Array.isArray(data)) {
    console.info('the data is not an array', data)
    dispatch({ type: 'login', payload: data })
    navigate('/')
  }
  if (state.isLoggedIn) {
    return <div>Account already exists</div>
  }
  return (
    <main>
      <section>
        <h2>Create your account</h2>
        <div>
          <Form
            name="registerForm"
            onSubmit={({ firstName, lastName, email, password, username }) => {
              makeQuery({
                newUserInput: {
                  firstName,
                  lastName,
                  email,
                  password,
                  username,
                },
              })
            }}
          >
            <TextBox name="firstName" label="First Name" initialValue="" />
            <TextBox name="lastName" label="Last Name" initialValue="" />
            <EmailInput
              type="email"
              name="email"
              label="Your Email"
              initialValue=""
            />
            <TextBox name="username" label="Username" initialValue="" />
            <TextBox
              name="password"
              label="Password"
              initialValue=""
              type="password"
            />
            <TextBox
              name="verifyPassword"
              label="Verify Password"
              initialValue=""
              type="password"
            />
            <Button>Register</Button>
          </Form>
        </div>
      </section>
    </main>
  )
}

export default RegisterForm
