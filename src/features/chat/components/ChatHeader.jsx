import { CaretRight, ChatCircle, UsersThree, Trash } from "phosphor-react";

const ChatHeader = ({ selectedConv, getConvTitle, onBack, onHide, isHiding }) => (
  <div className="chat-header p-4 border-b border-white/5 flex items-center gap-3">
    <button
      type="button"
      onClick={onBack}
      className="chat-back-button h-9 w-9 rounded-lg bg-white/5 border border-white/10 text-slate-300 flex items-center justify-center hover:bg-white/10 transition-colors"
    >
      <CaretRight size={18} weight="bold" />
    </button>
    <div
      className={`h-10 w-10 rounded-xl flex items-center justify-center ${
        selectedConv.team
          ? "bg-violet-500/20 text-violet-400"
          : "bg-emerald-500/10 text-emerald-400"
      }`}
    >
      {selectedConv.team ? <UsersThree size={20} /> : <ChatCircle size={20} />}
    </div>
    <div>
      <h3 className="text-white font-bold">{getConvTitle(selectedConv)}</h3>
      <p className="text-slate-500 text-xs">
        {selectedConv.participants?.length || 0} مشاركين
      </p>
    </div>
    {onHide && (
      <button
        type="button"
        onClick={onHide}
        disabled={isHiding}
        className="mr-auto flex items-center gap-2 h-8 px-3 rounded-lg bg-rose-500/10 border border-rose-500/20 text-rose-400 hover:bg-rose-500/20 transition-colors disabled:opacity-50"
        title="حذف المحادثة"
      >
        <Trash size={16} weight="bold" />
        <span className="hidden sm:inline text-xs font-semibold">حذف</span>
      </button>
    )}
  </div>
);

export default ChatHeader;


