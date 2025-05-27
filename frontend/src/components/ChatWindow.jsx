import { useEffect } from 'react'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'

const ChatWindow = () => {
	const { messages, getMessages, selectedUser, isMessagesLoading } =
		useChatStore()

	useEffect(() => {
		getMessages(selectedUser._id)
	}, [selectedUser, getMessages])

	if (isMessagesLoading)
		return (
			<div className='flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)

	return (
		<div className='flex-1 flex flex-col overflow-auto'>
			<ChatHeader />
			<p>messages..</p>
			<MessageInput />
		</div>
	)
}

export default ChatWindow
