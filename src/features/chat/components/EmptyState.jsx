import { ChatCircle } from "phosphor-react";

const EmptyState = () => (
  <div className="flex-1 flex items-center justify-center">
    <div className="text-center">
      <ChatCircle size={64} className="mx-auto text-slate-600 mb-4" />
      <p className="text-slate-400">اختر محادثة للبدء</p>
    </div>
  </div>
);

export default EmptyState;
