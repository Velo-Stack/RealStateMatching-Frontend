import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import Modal from "../../../components/Modal";
import { adjustBrokerPointsApi } from "../services/gamificationApi";

const PointsAdjustModal = ({ isOpen, onClose, user, onSuccess }) => {
  const [points, setPoints] = useState("");
  const [note, setNote] = useState("");

  const adjust = useMutation({
    mutationFn: () =>
      adjustBrokerPointsApi(user.id, {
        points: Number(points),
        note: note.trim() || undefined,
      }),
    onSuccess: (data) => {
      onSuccess?.(data);
      setPoints("");
      setNote("");
      onClose();
    },
  });

  if (!user) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={`تعديل نقاط — ${user.name}`}>
      <form
        className="space-y-4"
        onSubmit={(e) => {
          e.preventDefault();
          adjust.mutate();
        }}
      >
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
        {adjust.isError ? (
          <p className="text-rose-400 text-sm">
            {adjust.error?.response?.data?.message || "تعذر تعديل النقاط"}
          </p>
        ) : null}
        <div className="flex justify-end gap-2">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-xl text-slate-300 hover:bg-white/5"
          >
            إلغاء
          </button>
          <button
            type="submit"
            disabled={adjust.isPending}
            className="px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-500 disabled:opacity-50"
          >
            {adjust.isPending ? "جاري الحفظ..." : "حفظ"}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default PointsAdjustModal;
