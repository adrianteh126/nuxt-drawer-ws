import { Server } from 'socket.io'
import type { DrawLine } from './types/typing'
const PORT = process.env.PORT || '3001'

const io = new Server(parseInt(PORT), {
  cors: {
    origin:
      process.env.NODE_ENV === 'production'
        ? '*:*'
        : `http://localhost:${PORT}`,
    methods: ['GET', 'POST']
  },
  pingInterval: 5000,
  pingTimeout: 10000,
  connectionStateRecovery: {
    maxDisconnectionDuration: 30000
  }
})

console.log(`✔️ Server listening on port ${PORT}`)

io.on('connection', (socket) => {
  console.log(`Someone joined. Listener: ${io.engine.clientsCount}`)

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
  socket.on('disconnect', () => {
    console.log(`Someone leave. Listener: ${io.engine.clientsCount}`)
  })
})
