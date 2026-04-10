import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";

const CreateConversationModal = ({
  isModalOpen,
  setIsModalOpen,
  handleCreateConv,
  newConv,
  setNewConv,
  users,
  user,
  toggleParticipant,
  createConvMutation,
  showScopeHint,
}) => (
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="محادثة جديدة"
  >
    <form onSubmit={handleCreateConv} className="space-y-5 text-right">
      <div>
        <label className={labelClasses}>عنوان المحادثة (اختياري)</label>
        <input
          className={inputClasses}
          value={newConv.title}
          onChange={(e) => setNewConv({ ...newConv, title: e.target.value })}
          placeholder="مثال: مناقشة المشروع"
        />
      </div>
      <div>
        <label className={labelClasses}>اختر المشاركين</label>
        {showScopeHint && (
          <p className="text-xs text-slate-500 mt-1">
            يمكنك المراسلة ضمن نطاق فريقك فقط
          </p>
        )}
        <div className="space-y-2 max-h-48 overflow-y-auto p-2 rounded-xl bg-white/5 border border-white/10">
          {users.filter((u) => u.id !== user?.id).length > 0 ? (
            users
              .filter((u) => u.id !== user?.id)
              .map((u) => (
                <label
                  key={u.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-white/5 cursor-pointer"
                >
                  <input
                    type="checkbox"
                    checked={newConv.participantIds.includes(u.id)}
                    onChange={() => toggleParticipant(u.id)}
                    className="rounded border-white/20"
                  />
                  <span className="text-white text-sm">{u.name}</span>
                  <span className="text-slate-500 text-xs">({u.role})</span>
                </label>
              ))
          ) : (
            <div className="rounded-lg border border-dashed border-white/15 bg-white/[0.03] px-4 py-6 text-center">
              <p className="text-sm text-slate-300">
                 لا يوجد مستخدمون آخرون في فريقك للتواصل معهم
                 </p>
              <p className="mt-1 text-xs text-slate-500">
               تأكد من أن أعضاء فريقك قد انضموا وأن لديهم الأذونات المناسبة للظهور في قائمة المشاركين.
               </p>
            </div>
          )}
        </div>
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={newConv.participantIds.length === 0 || createConvMutation.isPending}
        className={submitButtonClasses}
      >
        {createConvMutation.isPending ? "جاري الإنشاء..." : "إنشاء المحادثة"}
      </motion.button>
    </form>
  </Modal>
);

export default CreateConversationModal;
