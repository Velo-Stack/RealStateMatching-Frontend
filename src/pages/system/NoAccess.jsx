import { SignOut, ShieldSlash } from "phosphor-react";
import { useAuth } from "../../context/AuthContext";

const NoAccess = () => {
  const { user, logout } = useAuth();

  return (
    <div className="min-h-[calc(100vh-160px)] flex items-center justify-center">
      <div className="w-full max-w-lg rounded-2xl border border-white/10 bg-[#111827]/70 p-8 text-center shadow-2xl shadow-black/20">
        <div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-2xl bg-amber-500/10 text-amber-300">
          <ShieldSlash size={34} weight="duotone" />
        </div>
        <h1 className="mb-2 text-xl font-bold text-white">لا توجد صلاحيات مفعلة</h1>
        <p className="mb-2 text-sm text-slate-400">
          الحساب مسجل دخوله بنجاح، لكن لا توجد صفحات أو وحدات متاحة لهذا المستخدم حاليا.
        </p>
        <p className="mb-6 text-xs text-slate-500">
          {user?.name} - {user?.role}
        </p>
        <button
          type="button"
          onClick={logout}
          className="mx-auto inline-flex items-center gap-2 rounded-xl border border-red-500/20 bg-red-500/10 px-5 py-2.5 text-sm font-semibold text-red-300 transition hover:bg-red-500/20"
        >
          <SignOut size={18} weight="duotone" />
          تسجيل خروج
        </button>
      </div>
    </div>
  );
};

export default NoAccess;
