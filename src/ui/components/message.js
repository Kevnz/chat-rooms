import React from 'react'
import PropTypes from 'prop-types'
import {
  Content,
  MediaContent,
  MediaObject,
  MediaLeft,
  Image,
} from '@brightleaf/elements'
/*
message: "Hi there from the other user"
​​​postedAt: 1558296805829
​​​​type: "message"
​​​user: "Other User"
*/
const Message = ({ message, user, type, postedAt, currentUser, fullUser }) => {
  const happened = new Date(postedAt)
  if (type === 'system') {
    return (
      <MediaObject>
        <MediaLeft>
          <Image is64 src={fullUser.avatar} />
        </MediaLeft>
        <MediaContent>
          <Content>
            <strong>{user}</strong>
            <p>
              <em>
                {user} {message || '?'} at {happened.toDateString()}
              </em>
            </p>
          </Content>
        </MediaContent>
      </MediaObject>
    )
  }
  return (
    <MediaObject>
      <MediaLeft>
        <Image is64 src={fullUser.avatar} />
      </MediaLeft>
      <MediaContent>
        <Content>
          <strong>{user}</strong>
          <p>{message}</p>
        </Content>
      </MediaContent>
    </MediaObject>
  )
}

Message.propTypes = {
  user: PropTypes.string,
  message: PropTypes.string,
  type: PropTypes.string,
  postedAt: PropTypes.number,
}

Message.defaultProps = {
  type: 'message',
  postedAt: 1558296805829,
}

export default Message
