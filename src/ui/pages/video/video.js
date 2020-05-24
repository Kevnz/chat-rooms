import React, { useContext, useEffect, useState } from 'react'

import {
  useGet,
  usePost,
  usePut,
  useTitle,
  useAsync,
} from '@brightleaf/react-hooks'
import {
  Button,
  Container,
  Hero,
  HeroBody,
  Title,
  SubTitle,
} from '@brightleaf/elements'

import { useNes } from '../../hooks/use-nes'
import { AuthContext } from '../../core/context/auth'
import MessageForm from '../../features/message-post'
import Room from '../../components/room'
import Message from '../../components/message'

const getStream = async constraints => {
  return await navigator.mediaDevices.getUserMedia(constraints)
}

let localStream
let remoteStream
let rtcPeerConnection

const iceServers = {
  iceServers: [
    {
      url: 'stun:stun.services.mozilla.com',
    },
    {
      url: 'stun:stun.l.google.com:19302',
    },
  ],
}
const streamConstraints = {
  audio: true,
  video: true,
}

const VideoPage = ({ slug }) => {
  console.info('the video page', slug)
  const ctx = useContext(AuthContext)
  const user = ctx.user
  console.log('the user', user)
  console.log('the others', ctx)
  const url = `/api/videos/${slug}`
  const [inRoom, setInRoom] = useState(false)
  const [isCaller, setIsCaller] = useState(false)
  const [streamDetails, setStreamDetails] = useState(undefined)
  const { data, getUrl } = useGet(`/api/videos/${slug}`)
  const { messages, action, error, connecting, connected, client } = useNes(
    'ws://localhost:4567/',
    `/api/videos/${slug}`
  )

  const { putData } = usePut(`/api/videos/${slug}`)
  const { putData: startVideo } = usePut(`/api/video-start/${slug}`)

  const createVideoChat = isOwner => async () => {
    const stream = await getStream(streamConstraints)
    setStreamDetails({
      localStream: stream,
      videoSrc: URL.createObjectURL(stream),
      isOwner: isOwner,
    })
  }

  const createRTCPeerConnection = () => {
    const peer = new RTCPeerConnection(iceServers)
    peer.onicecandidate = () => {}
    peer.onaddstream = () => {}
    peer.addStrem(streamDetails.localStream)

    peer.createOffer()
  }
  const onOffer = event => {
    if (!isCaller) {
      rtcPeerConnection = new RTCPeerConnection(iceServers)
      rtcPeerConnection.onicecandidate = onIceCandidate
      rtcPeerConnection.ontrack = onAddStream
      rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream)
      rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream)
      rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
      rtcPeerConnection
        .createAnswer()
        .then(sessionDescription => {
          rtcPeerConnection.setLocalDescription(sessionDescription)
          socket.emit('answer', {
            type: 'answer',
            sdp: sessionDescription,
            room: roomNumber,
          })
        })
        .catch(error => {
          console.log(error)
        })
    }
  }

  const onAnswer = function(event) {
    rtcPeerConnection.setRemoteDescription(new RTCSessionDescription(event))
  }
  function onIceCandidate(event) {
    if (event.candidate) {
      console.log('sending ice candidate')

      socket.emit('candidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        room: slug,
      })
    }
  }
  const startVideoChat = createVideoChat(true)
  const joinVideoChat = createVideoChat(false)
  useEffect(() => {
    getUrl()
    return function cleanup() {
      console.log('cleanup', inRoom)
      if (inRoom) {
        // putData({ user: user.username, message: 'Left room' })
        setInRoom(false)
      }
    }
  }, [slug])

  console.info('NES MEssages', messages)
  console.info('data Messages', data.messages)

  console.log('room data', data)
  if (!streamDetails && messages.length > 0) {
    console.info('do something')
  }

  return (
    <Container>
      <Hero>
        <Container>
          <Title is="4">{data.room && data.room.name}</Title>
          <Button
            disabled={inRoom}
            onClick={e => {
              e.preventDefault()
              console.log('join call')
              putData({ user: user.username, message: 'Joined room' })
              setInRoom(true)
            }}
          >
            Join Call
          </Button>
          <Button
            disabled={inRoom}
            onClick={e => {
              e.preventDefault()
              console.log('join call')
              startVideo({ user: user.username, message: 'Started room' })
              setInRoom(true)
            }}
          >
            Start Call
          </Button>
        </Container>
      </Hero>

      <br />
      <hr />
      <Container>
        <br />
        <hr />

        {streamDetails && (
          <div>
            <video autoPlay />
            <video autoPlay />
          </div>
        )}
      </Container>
    </Container>
  )
}
export default VideoPage
