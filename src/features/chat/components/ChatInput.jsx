import { motion } from "framer-motion";
import { PaperPlaneTilt } from "phosphor-react";
import { inputClasses } from "../../../constants/styles";

const ChatInput = ({ message, setMessage, handleSend, sendMutation }) => (
  <form
    onSubmit={handleSend}
    className="chat-input p-4 border-t border-white/5 flex flex-row items-center gap-3"
    dir="rtl"
  >
    <input
      value={message}
      onChange={(e) => setMessage(e.target.value)}
      placeholder="اكتب رسالتك..."
      className={`chat-input-field ${inputClasses} flex-1 min-w-0`}
      dir="auto"
      autoComplete="off"
    />
    <motion.button
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
      type="submit"
      disabled={!message.trim() || sendMutation.isPending}
      className="theme-button-primary h-12 w-12 shrink-0 rounded-xl flex items-center justify-center disabled:opacity-50"
      aria-label="إرسال"
    >
      <PaperPlaneTilt size={20} weight="fill" />
    </motion.button>
  </form>
);

export default ChatInput;
