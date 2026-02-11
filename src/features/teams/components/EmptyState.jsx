import { Users } from "phosphor-react";

const EmptyState = () => (
  <div className="text-center py-12">
    <Users size={48} className="mx-auto text-slate-600 mb-4" />
    <p className="text-slate-400">لا توجد فرق حالياً</p>
  </div>
);

export default EmptyState;
