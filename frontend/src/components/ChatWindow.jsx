import { useEffect, useRef } from 'react'
import { formatMessageTime } from '../lib/utils'
import { useAuthStore } from '../store/useAuthStore'
import { useChatStore } from '../store/useChatStore'
import ChatHeader from './ChatHeader'
import MessageInput from './MessageInput'
import MessageSkeleton from './skeletons/MessageSkeleton'

const ChatWindow = () => {
	const {
		messages,
		getMessages,
		selectedUser,
		isMessagesLoading,
		subscribeToNewMessages,
		unsubscribeFromNewMessages,
	} = useChatStore()

	const { authUser } = useAuthStore()
	const messagesEndRef = useRef(null)

	useEffect(() => {
		getMessages(selectedUser._id)
		subscribeToNewMessages()

		return () => unsubscribeFromNewMessages()
	}, [
		selectedUser,
		getMessages,
		subscribeToNewMessages,
		unsubscribeFromNewMessages,
	])

	useEffect(() => {
		if (messagesEndRef.current && messages) {
			messagesEndRef.current.scrollIntoView({ behavior: 'smooth' })
		}
	}, [messages])

	if (isMessagesLoading)
		return (
			<div className='flex-1 flex flex-col overflow-auto'>
				<ChatHeader />
				<MessageSkeleton />
				<MessageInput />
			</div>
		)

	return (
		<div className='flex-1 flex flex-col overflow-auto '>
			<ChatHeader />
			<div className='flex-1 overflow-y-auto p-4 space-y-4'>
				{messages.map((messages) => (
					<div
						key={messages._id}
						className={`chat ${
							messages.senderId === authUser._id ? 'chat-end' : 'chat-start'
						}`}
						ref={messagesEndRef}
					>
						<div className='chat-image avatar'>
							<div className='size-10 rounded-full border'>
								<img
									alt='Profile picture'
									src={
										messages.senderId === authUser._id
											? authUser.avatar || '/avatar.png'
											: selectedUser.avatar || '/avatar.png'
									}
								/>
							</div>
						</div>
						<div className='chat-header mb-1'>
							<time className='text-xs opacity-50 ml-1'>
								{formatMessageTime(messages.createdAt)}
							</time>
						</div>
						<div className='chat-bubble flex flex-col'>
							{messages.image && (
								<img
									src={messages.image}
									alt='Attachment'
									className='sm:max-w-[200px] rounded-md mb-2'
								/>
							)}
							{messages.text && <p>{messages.text}</p>}
						</div>
					</div>
				))}
			</div>
			<MessageInput />
		</div>
	)
}

export default ChatWindow
