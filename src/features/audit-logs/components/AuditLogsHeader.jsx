import { Scroll } from "phosphor-react";

const AuditLogsHeader = () => (
  <div className="flex items-center gap-4">
    <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-violet-500/20 to-purple-500/20 border border-violet-500/30 flex items-center justify-center">
      <Scroll size={24} className="text-violet-400" weight="duotone" />
    </div>
    <div>
      <p className="text-white font-semibold">سجلات التدقيق</p>
      <p className="text-sm text-slate-500">
        تتبع جميع العمليات والتغييرات في النظام
      </p>
    </div>
  </div>
);

export default AuditLogsHeader;
