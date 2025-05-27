import toast from 'react-hot-toast'
import { create } from 'zustand'
import { axiosInstance } from '../lib/axios'

export const useChatStore = create((set, get) => ({
	messages: [],
	users: [],
	selectedUser: null,
	isUsersLoading: false,
	isMessagesLoading: false,

	getUsers: async () => {
		set({ isUsersLoading: true })
		try {
			const res = await axiosInstance.get('/message/users')

			set({ users: res.data })
		} catch (error) {
			toast.error(error.response.data.message || 'Error fetching users')
		} finally {
			set({ isUsersLoading: false })
		}
	},

	getMessages: async (userId) => {
		set({ isMessagesLoading: true })
		try {
			const res = await axiosInstance.get(`/message/${userId}`)
			set({ messages: res.data })
		} catch (error) {
			toast.error(error.response.data.message || 'Error fetching messages')
		} finally {
			set({ isMessagesLoading: false })
		}
	},

	sendMessage: async (messageData) => {
		const { selectedUser, messages } = get()

		try {
			const res = await axiosInstance.post(
				`/message/send/${selectedUser._id}`,
				messageData
			)
			set({ messages: [...messages, res.data] })
		} catch (error) {
			toast.error(error.response.data.message)
		}
	},

	setSelectedUser: (selectedUser) => {
		set({ selectedUser })
	},
}))
