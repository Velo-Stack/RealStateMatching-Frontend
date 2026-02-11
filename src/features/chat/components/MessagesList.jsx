import MessageItem from "./MessageItem";

const MessagesList = ({ msgsLoading, messages, user, messagesEndRef }) => (
  <div className="flex-1 overflow-y-auto p-4 space-y-3">
    {msgsLoading ? (
      <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
    ) : messages.length === 0 ? (
      <div className="text-center py-8 text-slate-500">لا توجد رسائل</div>
    ) : (
      messages.map((msg) => <MessageItem key={msg.id} msg={msg} user={user} />)
    )}
    <div ref={messagesEndRef} />
  </div>
);

export default MessagesList;
