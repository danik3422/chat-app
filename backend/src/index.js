import cookieParser from 'cookie-parser'
import cors from 'cors'
import dotenv from 'dotenv'
import express from 'express'
import path from 'path'
import { connectDB } from './lib/db.js'
import { app, server } from './lib/socket.js'
import authRoutes from './routes/auth.route.js'
import messageRoutes from './routes/message.route.js'
dotenv.config()

const PORT = process.env.PORT
const __dirname = path.resolve()
app.use(express.json())
app.use(cookieParser())
app.use(
	cors({
		origin: 'http://localhost:5173',
		credentials: true,
	})
)

app.use('/api/auth', authRoutes)
app.use('/api/message', messageRoutes)

server.listen(PORT, () => {
	console.log('Server is running on port ' + PORT)
	connectDB()
})
