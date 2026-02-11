import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import { TEAM_TYPE_OPTIONS } from "../../../constants/enums";
import {
  inputClasses,
  labelClasses,
  submitButtonClasses,
} from "../../../constants/styles";

const CreateTeamModal = ({
  isModalOpen,
  setIsModalOpen,
  handleSubmit,
  formData,
  handleChange,
  createTeamMutation,
}) => (
  <Modal
    isOpen={isModalOpen}
    onClose={() => setIsModalOpen(false)}
    title="إنشاء فريق جديد"
  >
    <form onSubmit={handleSubmit} className="space-y-5 text-right">
      <div>
        <label className={labelClasses}>اسم الفريق</label>
        <input
          name="name"
          className={inputClasses}
          value={formData.name}
          onChange={handleChange}
          required
          placeholder="مثال: فريق الأراضي"
        />
      </div>
      <div>
        <label className={labelClasses}>نوع الفريق</label>
        <select
          name="type"
          className={inputClasses}
          value={formData.type}
          onChange={handleChange}
          required
        >
          {TEAM_TYPE_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>
      <motion.button
        whileHover={{ scale: 1.01 }}
        whileTap={{ scale: 0.99 }}
        type="submit"
        disabled={createTeamMutation.isPending}
        className={submitButtonClasses}
      >
        {createTeamMutation.isPending ? "جاري الإنشاء..." : "إنشاء الفريق"}
      </motion.button>
    </form>
  </Modal>
);

export default CreateTeamModal;
