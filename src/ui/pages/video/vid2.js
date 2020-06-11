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

import { useNesEvents } from '../../hooks/use-nes-events'
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
const onOffer = () => {}
const onReady = () => {}
const onAnswer = () => {}
const VideoPage = ({ slug }) => {
  console.info('the video page', slug)
  const ctx = useContext(AuthContext)
  const user = ctx.user

  const url = `/api/videos/${slug}`

  const [inRoom, setInRoom] = useState(false)
  const [isCaller, setIsCaller] = useState(false)
  console.log('isCaller', isCaller)

  const [localSrc, setLocalSrc] = useState(null)

  const [remoteSrc, setRemoteSrc] = useState(null)
  const [streamDetails, setStreamDetails] = useState(undefined)
  const { data, getUrl } = useGet(`/api/videos/${slug}`)
  const { emitter, client } = useNesEvents('ws://localhost:4567/', url)

  useEffect(() => {
    console.log('bind events')
    emitter.on('connecting', () => {
      console.info('connecting event')
    })

    emitter.on('connected', () => {
      console.info('connected event')
    })

    emitter.on('disconnected', () => {
      console.info('disconnected event')
    })

    emitter.on('created', function(room) {
      navigator.mediaDevices
        .getUserMedia(streamConstraints)
        .then(function(stream) {
          localStream = stream
          setLocalSrc(stream)
          // setIsCaller(true)
        })
        .catch(function(err) {
          console.log('An error ocurred when accessing media devices', err)
        })
    })

    emitter.on('joined', function(room) {
      navigator.mediaDevices
        .getUserMedia(streamConstraints)
        .then(function(stream) {
          localStream = stream

          setLocalSrc(stream)
          emitter.emit('ready', slug)
        })
        .catch(function(err) {
          console.log('An error ocurred when accessing media devices', err)
        })
    })

    emitter.on('candidate', function(event) {
      var candidate = new RTCIceCandidate({
        sdpMLineIndex: event.label,
        candidate: event.candidate,
      })
      rtcPeerConnection.addIceCandidate(candidate)
    })

    emitter.on('ready', () => {
      console.info('ready event')
    })

    emitter.on('offer', function(event) {
      console.info('THE OFFER EVENT', event.data)
      console.info('func offer', user)
      console.log(user.username === event.data.user)
      if (user.username !== event.data.user) {
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
            emitter.emit('answer', {
              type: 'answer',
              sdp: sessionDescription,
              room: slug,
            })
          })
          .catch(error => {
            console.log(error)
          })
      }
    })

    emitter.on('answer', () => {
      console.info('ready event')
    })

    return () => {
      console.log('cleanup events')
      /*
      emitter
        .removeAllListeners('offer')
        .removeAllListeners('ready')
        .removeAllListeners('candidate')
        .removeAllListeners('joined')
        .removeAllListeners('created')
        .removeAllListeners('connected')
        .removeAllListeners('connecting')
        .removeAllListeners('disconnected')
        */
    }
  }, [isCaller])

  function onIceCandidate(event) {
    if (event.candidate) {
      console.log('sending ice candidate')
      emitter.emit('candidate', {
        type: 'candidate',
        label: event.candidate.sdpMLineIndex,
        id: event.candidate.sdpMid,
        candidate: event.candidate.candidate,
        room: slug,
      })
    }
  }

  function onAddStream(event) {
    setRemoteSrc(event.streams[0])

    remoteStream = event.stream
  }

  const { putData } = usePut(`/api/videos/${slug}`)
  const { putData: startVideo } = usePut(`/api/video-start/${slug}`)

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

  const { data: startData, execute: startCall } = useAsync(async obj => {
    console.log('start call async method called')
    return client.request({
      path: `/api/video-start/${slug}`,
      method: 'PUT',
      payload: obj,
    })
  })

  const { data: startData, execute: startCall } = useAsync(async obj => {
    console.log('start call async method called')

    rtcPeerConnection = new RTCPeerConnection(iceServers)
    rtcPeerConnection.onicecandidate = onIceCandidate
    rtcPeerConnection.ontrack = onAddStream
    rtcPeerConnection.addTrack(localStream.getTracks()[0], localStream)
    rtcPeerConnection.addTrack(localStream.getTracks()[1], localStream)
    rtcPeerConnection
      .createOffer()
      .then(sessionDescription => {
        rtcPeerConnection.setLocalDescription(sessionDescription)
        socket.emit('offer', {
          type: 'offer',
          sdp: sessionDescription,
          room: roomNumber,
        })
      })
      .catch(error => {
        console.log(error)
      })
    await client.connect()

    return client.request({
      path: `/api/video-start/${slug}`,
      method: 'PUT',
      payload: obj,
    })
  })
  console.info('start data', startData)

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
              console.log('start call button pressed')

              startCall({ user: user.username, message: 'Started room' })
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
            <video autoPlay src={remoteSrc} />
            <video src={localSrc} autoPlay />
          </div>
        )}
      </Container>
    </Container>
  )
}
export default VideoPage
