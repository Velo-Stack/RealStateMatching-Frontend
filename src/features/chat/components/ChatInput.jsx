import { motion } from "framer-motion";
import { PaperPlaneRight } from "phosphor-react";
import { inputClasses } from "../../../constants/styles";

const ChatInput = ({ message, setMessage, handleSend, sendMutation }) => (
  <form onSubmit={handleSend} className="chat-input p-4 border-t border-white/5 flex gap-3">
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="اكتب رسالتك..."
      className={`chat-input-field ${inputClasses} flex-1`}
    />
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={!message.trim() || sendMutation.isPending}
      className="h-12 w-12 rounded-xl bg-gradient-to-r from-emerald-500 to-cyan-500 text-white flex items-center justify-center disabled:opacity-50"
    >
      <PaperPlaneRight size={20} weight="fill" />
    </motion.button>
  </form>
);

export default ChatInput;
