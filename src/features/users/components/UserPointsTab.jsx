import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { adjustBrokerPointsApi } from "../../gamification/services/gamificationApi";

const UserPointsTab = ({ user, onSaved }) => {
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");

  const adjust = useMutation({
    mutationFn: () =>
      adjustBrokerPointsApi(user.id, {
        points: Number(points),
        note: note.trim() || undefined,
      }),
    onSuccess: () => {
      toast.success("تم تعديل النقاط");
      setPoints("");
      setNote("");
      onSaved?.();
    },
    onError: (error) => {
      toast.error(error?.response?.data?.message || "تعذر تعديل النقاط");
    },
  });

  if (!user) return null;

  return (
    <form
      className="space-y-4 text-right"
      onSubmit={(e) => {
        e.preventDefault();
        adjust.mutate();
      }}
    >
      <p className="text-sm text-slate-400">
        تعديل نقاط الوسيط <span className="text-white font-medium">{user.name}</span>
      </p>
      <div>
        <label className="block text-sm text-slate-400 mb-1">النقاط (+/-)</label>
        <input
          type="number"
          value={points}
          onChange={(e) => setPoints(e.target.value)}
          className="w-full rounded-xl bg-[#0f172a] border border-white/10 px-3 py-2 text-white"
          placeholder="مثال: 50 أو -20"
          required
        />
      </div>
      <div>
        <label className="block text-sm text-slate-400 mb-1">ملاحظة (اختياري)</label>
        <textarea
          value={note}
          onChange={(e) => setNote(e.target.value)}
          className="w-full rounded-xl bg-[#0f172a] border border-white/10 px-3 py-2 text-white min-h-[80px]"
        />
      </div>
      <button
        type="submit"
        disabled={adjust.isPending}
        className="theme-button-primary w-full rounded-xl py-3 text-sm font-bold disabled:opacity-50"
      >
        {adjust.isPending ? "جاري الحفظ..." : "حفظ النقاط"}
      </button>
    </form>
  );
};

export default UserPointsTab;
