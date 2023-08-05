'use client'

import useConversation from '@/hooks/useConversation'
import { FullMessageType } from '@/types'
import { useEffect, useRef, useState } from 'react'
import MessageBox from './message-box'
import axios from 'axios'
import { pusherClient } from '@/libs/pusher'
import { find } from 'lodash'

interface ConversationBodyProps {
  initialMessages: FullMessageType[]
}

const ConversationBody: React.FC<ConversationBodyProps> = ({
  initialMessages,
}) => {
  const [messages, setMessages] = useState(initialMessages)
  const bottomRef = useRef<HTMLDivElement>(null)

  const { conversationId } = useConversation()

  useEffect(() => {
    axios.post(`/api/conversations/${conversationId}/seen`)
  }, [conversationId])

  useEffect(() => {
    pusherClient.subscribe(conversationId)
    bottomRef?.current?.scrollIntoView()

    const handleMessages = (message: FullMessageType) => {
      axios.post(`/api/conversations/${conversationId}/seen`)
      setMessages((current) => {
        if (find(current, { id: message.id })) {
          return current
        }

        return [...current, message]
      })
      bottomRef?.current?.scrollIntoView()
    }

    const updateMessageHandler = (newMessage: FullMessageType) => {
      setMessages((current) =>
        current.map((currentMessage) => {
          if (currentMessage.id === newMessage.id) {
            return newMessage
          }

          return currentMessage
        })
      )
    }

    pusherClient.bind('messages:new', handleMessages)
    pusherClient.bind('message:update', updateMessageHandler)

    return () => {
      pusherClient.unsubscribe(conversationId)
      pusherClient.unbind('messages:new', handleMessages)
      pusherClient.unbind('message:update', updateMessageHandler)
    }
  }, [conversationId])

  return (
    <div className="flex-1 overflow-y-auto">
      {messages.map((message, i) => (
        <MessageBox
          isLast={i === messages.length - 1}
          key={message.id}
          data={message}
        />
      ))}
      <div
        ref={bottomRef}
        className="pt-24"
      />
    </div>
  )
}

export default ConversationBody
