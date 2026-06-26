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
      },
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
      className={`flex w-full ${isMine ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`flex flex-col gap-1 max-w-[70%] min-w-0 ${
          isMine ? "items-start" : "items-end"
        }`}
      >
        <div
          className={`chat-message-bubble p-3 rounded-2xl w-full ${
            isMine
              ? "bg-gradient-to-l from-emerald-500 to-cyan-500 text-white"
              : "bg-white/5 text-white border border-white/10"
          } ${msg.optimistic ? "opacity-80" : ""}`}
        >
          {!isMine && (
            <p className="text-xs text-emerald-400 mb-1 text-start">{msg.sender?.name}</p>
          )}

          {isEditing ? (
            <div className="flex flex-col gap-2">
              <textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                className={`${inputClasses} chat-input-field min-h-[60px] text-sm resize-none`}
                dir="auto"
                autoFocus
              />
              <div className="flex gap-2 justify-start">
                <button
                  type="button"
                  onClick={handleCancelEdit}
                  className="p-1.5 rounded-lg bg-red-500/20 hover:bg-red-500/30 transition-colors"
                  disabled={editMutation.isPending}
                  aria-label="إلغاء التعديل"
                >
                  <X size={16} weight="bold" />
                </button>
                <button
                  type="button"
                  onClick={handleSaveEdit}
                  className="p-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500/30 transition-colors"
                  disabled={!editedBody.trim() || editMutation.isPending}
                  aria-label="حفظ التعديل"
                >
                  <Check size={16} weight="bold" />
                </button>
              </div>
            </div>
          ) : (
            <>
              <p className="chat-message-text text-sm whitespace-pre-wrap" dir="auto">
                {msg.body}
              </p>
              <div className="flex items-center gap-2 mt-1">
                <p
                  className={`text-[10px] tabular-nums ${
                    isMine ? "text-white/70" : "text-slate-500"
                  }`}
                  dir="ltr"
                >
                  {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </p>

                {canEdit && (
                  <button
                    type="button"
                    onClick={handleEdit}
                    className={`p-1 rounded shrink-0 ${
                      isMine ? "hover:bg-white/20" : "hover:bg-white/10"
                    }`}
                    title="تعديل الرسالة"
                    aria-label="تعديل الرسالة"
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
            className={`flex items-center gap-1 text-[10px] px-2 text-start ${
              isMine ? "text-emerald-400" : "text-slate-400"
            }`}
          >
            <Clock size={12} weight="bold" className="shrink-0" />
            <span dir="auto">يمكن التعديل لمدة {timeLeft}</span>
          </div>
        )}
      </div>
    </motion.div>
  );
};

export default MessageItem;
