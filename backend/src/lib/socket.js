import express from 'express'
import http from 'http'
import { Server } from 'socket.io'

const app = express()
const server = http.createServer(app)

const io = new Server(server, {
	cors: {
		origin: 'http://localhost:5173',
		credentials: true,
	},
})

export const getReceiverSocketId = (userId) => {
	//Return the socket id of the user
	return userSocketMap[userId]
}

//Socket store online users
const userSocketMap = {} //{ userId: socketId }
io.on('connection', (socket) => {
	console.log('A user connected:', socket.id)

	const userId = socket.handshake.query.userId

	if (userId) {
		userSocketMap[userId] = socket.id
	}
	//Send event to all connected clients
	io.emit('onlineUsers', Object.keys(userSocketMap))

	socket.on('disconnect', () => {
		console.log('User disconnected:', socket.id)
		delete userSocketMap[userId]
		io.emit('onlineUsers', Object.keys(userSocketMap))
	})
})

export { app, io, server }
