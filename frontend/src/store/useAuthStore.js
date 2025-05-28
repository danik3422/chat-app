import toast from 'react-hot-toast'
import { io } from 'socket.io-client'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

const SOCKET_URL =
	import.meta.env.MODE === 'development' ? 'http://localhost:5001' : '/'

export const useAuthStore = create((set, get) => ({
	authUser: null,
	isSigningUp: false,
	isLoggingIn: false,
	isUpdatingProfile: false,
	onlineUsers: [],
	isCheckingAuth: true,
	socket: null,

	checkAuth: async () => {
		try {
			const res = await axiosInstance.get('/auth/get-user')
			set({
				authUser: res.data,
			})
			get().connectToSocket()
		} catch (error) {
			console.log('Error checking auth', error)
			set({
				authUser: null,
			})
		} finally {
			set({
				isCheckingAuth: false,
			})
		}
	},

	signup: async (data) => {
		set({ isSigningUp: true })
		try {
			const res = await axiosInstance.post('/auth/signup', data)
			toast.success('Account created successfully')
			set({
				authUser: res.data,
			})
			get().connectToSocket()
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({
				isSigningUp: false,
			})
		}
	},

	logout: async () => {
		try {
			await axiosInstance.post('/auth/logout')
			set({
				authUser: null,
			})
			toast.success('Logged out successfully')
			get().disconnectFromSocket()
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},

	login: async (data) => {
		set({ isLoggingIn: true })

		try {
			const res = await axiosInstance.post('/auth/login', data)

			toast.success('Account logged in successfully')
			set({
				authUser: res.data,
			})

			get().connectToSocket()
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isLoggingIn: false })
		}
	},

	updateProfile: async (data) => {
		set({ isUpdatingProfile: true })

		try {
			const res = await axiosInstance.put('/auth/update-profile', data)
			set((state) => ({
				authUser: {
					...state.authUser,
					...res.data,
				},
			}))
			toast.success('Profile updated successfully')
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isUpdatingProfile: false })
		}
	},
	updateFullName: async (data) => {
		set({ isUpdatingProfile: true })
		try {
			const res = await axiosInstance.patch('/auth/full-name', data)
			set((state) => ({
				authUser: {
					...state.authUser,
					...res.data,
				},
			}))
			toast.success('Profile name updated successfully')
		} catch (error) {
			toast.error(error.response.data.message)
		} finally {
			set({ isUpdatingProfile: false })
		}
	},
	connectToSocket: () => {
		const { authUser } = get()
		if (!authUser || get().socket?.connected) return
		const socket = io(SOCKET_URL, {
			query: {
				userId: authUser._id,
			},
		})
		socket.connect()
		set({ socket: socket })

		socket.on('onlineUsers', (userId) => {
			set({ onlineUsers: userId })
		})
	},
	disconnectFromSocket: () => {
		if (get().socket?.connected) get().socket.disconnect()
	},
}))
