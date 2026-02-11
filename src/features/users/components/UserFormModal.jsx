import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { inputClasses, labelClasses } from "../constants/usersConstants";

const UserFormModal = ({
  isModalOpen,
  closeModal,
  isEditMode,
  handleSubmit,
  formData,
  handleChange,
  isPending,
}) => (
  <Modal
    isOpen={isModalOpen}
    onClose={closeModal}
    title={isEditMode ? "تعديل المستخدم" : "إنشاء مستخدم جديد"}
  >
    <form onSubmit={handleSubmit} className="space-y-5 text-right">
      <div>
        <label className={labelClasses}>الاسم الكامل</label>
        <input
          name="name"
          className={inputClasses}
          value={formData.name}
          onChange={handleChange}
          placeholder="أدخل اسم المستخدم"
          required
        />
      </div>
      <div>
        <label className={labelClasses}>البريد الإلكتروني</label>
        <input
          type="email"
          name="email"
          className={inputClasses}
          value={formData.email}
          onChange={handleChange}
          placeholder="user@example.com"
          required
          dir="ltr"
        />
      </div>
      <div>
        <label className={labelClasses}>
          كلمة المرور
          {isEditMode && (
            <span className="text-slate-500 text-xs mr-2">
              (اتركها فارغة للإبقاء على الحالية)
            </span>
          )}
        </label>
        <input
          type="password"
          name="password"
          className={inputClasses}
          value={formData.password}
          onChange={handleChange}
          placeholder="••••••••"
          required={!isEditMode}
          dir="ltr"
        />
      </div>
      <div>
        <label className={labelClasses}>الدور</label>
        <select name="role" className={inputClasses} value={formData.role} onChange={handleChange}>
          <option value="ADMIN">مدير نظام</option>
          <option value="MANAGER">مدير</option>
          <option value="BROKER">سمسار</option>
        </select>
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={isPending}
        className="w-full rounded-xl bg-gradient-to-l from-emerald-500 to-cyan-500 text-white text-sm font-bold py-3.5 shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
      >
        {isPending ? "جاري الحفظ..." : isEditMode ? "تحديث المستخدم" : "حفظ المستخدم"}
      </motion.button>
    </form>
  </Modal>
);

export default UserFormModal;
