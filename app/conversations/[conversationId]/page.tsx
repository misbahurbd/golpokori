import getConversationById from '@/actions/getConversationById'
import getMessages from '@/actions/getMessages'
import ConversationBody from '@/components/conversation-body'
import ConversationForm from '@/components/conversation-form'
import { EmptyState } from '@/components/empty-state'
import Header from '@/components/header'

interface IParams {
  conversationId: string
}

const ConversationPage = async ({ params }: { params: IParams }) => {
  const conversation = await getConversationById(params.conversationId)
  const messages = await getMessages(params.conversationId)

  if (!conversation) {
    return (
      <div className="lg:pl-80 h-full">
        <div className="h-full flex flex-col">
          <EmptyState />
        </div>
      </div>
    )
  }

  return (
    <div className="lg:pl-80 h-full">
      <div className="h-full flex flex-col">
        <Header conversation={conversation} />
        <ConversationBody initialMessages={messages} />
        <ConversationForm />
      </div>
    </div>
  )
}

export default ConversationPage
