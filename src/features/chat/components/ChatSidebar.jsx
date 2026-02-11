import { motion } from "framer-motion";
import { Plus, Users, UsersThree } from "phosphor-react";

const ChatSidebar = ({
  canCreateConv,
  setIsModalOpen,
  convsLoading,
  conversations,
  selectedConv,
  setSelectedConv,
  getConvTitle,
}) => (
  <div className="chat-sidebar w-80 border-l border-white/5 flex flex-col">
    <div className="chat-sidebar-header p-4 border-b border-white/5 flex items-center justify-between">
      <h2 className="text-white font-bold">المحادثات</h2>
      {canCreateConv && (
        <motion.button
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => setIsModalOpen(true)}
          className="h-8 w-8 rounded-lg bg-emerald-500/10 text-emerald-400 flex items-center justify-center hover:bg-emerald-500/20 transition-colors"
        >
          <Plus size={18} weight="bold" />
        </motion.button>
      )}
    </div>

    <div className="chat-conversations-list flex-1 overflow-y-auto p-2 space-y-1">
      {convsLoading ? (
        <div className="text-center py-8 text-slate-500">جاري التحميل...</div>
      ) : conversations.length === 0 ? (
        <div className="text-center py-8 text-slate-500">لا توجد محادثات</div>
      ) : (
        conversations.map((conv) => (
          <motion.button
            key={conv.id}
            whileHover={{ x: -4 }}
            onClick={() => setSelectedConv(conv)}
            className={`w-full text-right p-3 rounded-xl transition-all ${
              selectedConv?.id === conv.id
                ? "bg-gradient-to-l from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
                : "hover:bg-white/5 border border-transparent"
            }`}
          >
            <div className="flex items-center gap-3">
              <div
                className={`h-10 w-10 rounded-xl flex items-center justify-center ${
                  conv.team
                    ? "bg-violet-500/20 text-violet-400"
                    : "bg-emerald-500/20 text-emerald-400"
                }`}
              >
                {conv.team ? <UsersThree size={20} /> : <Users size={20} />}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-white text-sm font-medium truncate">
                  {getConvTitle(conv)}
                </p>
                <p className="text-slate-500 text-xs">
                  {conv.team ? "محادثة فريق" : "محادثة خاصة"}
                </p>
              </div>
            </div>
          </motion.button>
        ))
      )}
    </div>
  </div>
);

export default ChatSidebar;
