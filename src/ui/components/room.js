import React from 'react'
import PropTypes from 'prop-types'

const Room = ({ name, description }) => {
  return (
    <div>
      <h3>{name}</h3>
      <div>{description}</div>
    </div>
  )
}

Room.propTypes = {
  name: PropTypes.string,
  description: PropTypes.string,
}

Room.defaultProps = {
  name: 'ROOM NAME',
  description: 'ROOM DESCRIPTION',
}

export default Room
