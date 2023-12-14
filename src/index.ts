import express from 'express'
import http from 'node:http'
import { Server } from 'socket.io'
import type { DrawLine } from './types/typing'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
  cors: {
    origin:
      process.env.NODE_ENV === 'production' ? false : 'http://localhost:3000' // TODO: modify to target origin
  }
})

io.on('connection', (socket) => {
  socket.on('client-ready', () => {
    socket.broadcast.emit('get-canvas-state')
  })

  socket.on('canvas-state', (state) => {
    socket.broadcast.emit('canvas-state-from-server', state)
  })

  socket.on(
    'draw-line',
    ({ previousPoint, currentPoint, lineColor }: DrawLine) => {
      socket.broadcast.emit('draw-line', {
        previousPoint,
        currentPoint,
        lineColor
      })
    }
  )
  socket.on('clear', () => socket.broadcast.emit('clear'))
})

server.listen(3001, () => {
  console.log('✔️ Server listening on port 3001')
})
