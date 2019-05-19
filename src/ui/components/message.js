import React from 'react'
import PropTypes from 'prop-types'
/*
message: "Hi there from the other user"
​​​postedAt: 1558296805829
​​​​type: "message"
​​​user: "Other User"
*/
const Message = ({ message, user, type, postedAt, currentUser }) => {
  const happened = new Date(postedAt)
  if (type === 'system') {
    return (
      <div>
        <div
          style={{
            paddingLeft: `15px`,
          }}
        >
          <em>
            {user} at {happened.toDateString()}: {type}
          </em>
        </div>
      </div>
    )
  }
  return (
    <div
      style={{
        paddingLeft: `15px`,
      }}
    >
      {user}: {message}
    </div>
  )
}

Message.propTypes = {
  user: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
  postedAt: PropTypes.number,
}

Message.defaultProps = {
  message: 'MESSAGE',
  user: 'MESSAGE BY',
  type: 'message',
  postedAt: 1558296805829,
}

export default Message
