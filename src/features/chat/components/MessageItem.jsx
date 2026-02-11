import { motion } from "framer-motion";
import { isMessageMine } from "../utils/chatUtils";

const MessageItem = ({ msg, user }) => {
  const isMine = isMessageMine(msg, user);

  return (
    <motion.div
      key={msg.id}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isMine ? "justify-start" : "justify-end"}`}
    >
      <div
        className={`max-w-[70%] p-3 rounded-2xl ${
          isMine
            ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
            : "bg-white/5 text-white border border-white/10"
        }`}
      >
        {!isMine && (
          <p className="text-xs text-emerald-400 mb-1">{msg.sender?.name}</p>
        )}
        <p className="text-sm">{msg.body}</p>
        <p
          className={`text-[10px] mt-1 ${
            isMine ? "text-white/70" : "text-slate-500"
          }`}
        >
          {new Date(msg.createdAt).toLocaleTimeString("ar-EG", {
            hour: "2-digit",
            minute: "2-digit",
          })}
        </p>
      </div>
    </motion.div>
  );
};

export default MessageItem;
