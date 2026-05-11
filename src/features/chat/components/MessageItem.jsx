import { motion } from "framer-motion";
import { useState } from "react";
import { PencilSimple, Check, X, Clock } from "phosphor-react";
import { isMessageMine, canEditMessage, getTimeLeftToEdit } from "../utils/chatUtils";
import { useEditMessageMutation } from "../hooks/useEditMessageMutation";
import { inputClasses } from "../../../constants/styles";

const MessageItem = ({ msg, user, conversationId }) => {
  const isMine = isMessageMine(msg, user);
  const canEdit = canEditMessage(msg, user);
  const [isEditing, setIsEditing] = useState(false);
  const [editedBody, setEditedBody] = useState(msg.body);
  const editMutation = useEditMessageMutation(conversationId);

  const handleEdit = () => {
    setIsEditing(true);
    setEditedBody(msg.body);
  };

  const handleSaveEdit = () => {
    if (!editedBody.trim()) {
      return;
    }
    
    editMutation.mutate(
      {
        conversationId,
        messageId: msg.id,
        body: editedBody.trim(),
      },
      {
        onSuccess: () => {
          setIsEditing(false);
        },
      }
    );
  };

  const handleCancelEdit = () => {
    setIsEditing(false);
    setEditedBody(msg.body);
  };

  const timeLeft = canEdit ? getTimeLeftToEdit(msg) : null;

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? "justify-start" : "justify-end"} group`}
    >
      <div className="flex flex-col gap-1 max-w-[70%]">
        <div
          className={`chat-message-bubble p-3 rounded-2xl ${
            isMine
              ? "bg-gradient-to-l from-emerald-500 to-cyan-500 text-white"
              : "bg-white/5 text-white border border-white/10"
          }`}
        >
          {!isMine && (
            <p className="text-xs text-emerald-400 mb-1">{msg.sender?.name}</p>
          )}
          
          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className={`${inputClasses} min-h-[60px] text-sm resize-none`}
                autoFocus
              />
              <div className="flex gap-2 justify-end">
                <button
                  onClick={handleCancelEdit}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  disabled={editMutation.isPending}
                >
                  <X size={16} weight="bold" />
                </button>
                <button
                  onClick={handleSaveEdit}
                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                  disabled={!editedBody.trim() || editMutation.isPending}
                >
                  <Check size={16} weight="bold" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="text-sm whitespace-pre-wrap">{msg.body}</p>
              <div className="flex items-center justify-between gap-2 mt-1">
                <p
                  className={`text-[10px] ${
                    isMine ? "text-white/70" : "text-slate-500"
                  }`}
                >
                  {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>
                
                {canEdit && (
                  <button
                    onClick={handleEdit}
                    className={`opacity-0 group-hover:opacity-100 transition-opacity p-1 rounded ${
                      isMine
                        ? "hover:bg-white/20"
                        : "hover:bg-white/10"
                    }`}
                    title="تعديل الرسالة"
                  >
                    <PencilSimple size={14} weight="bold" />
                  </button>
                )}
              </div>
            </>
          )}
        </div>
        
        {canEdit && timeLeft && !isEditing && (
          <div
            className={`flex items-center gap-1 text-[10px] px-2 ${
              isMine ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Clock size={12} weight="bold" />
            <span>يمكن التعديل لمدة {timeLeft}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;

