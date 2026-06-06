import { motion } from "framer-motion";
import Modal from "../../../components/Modal";
import UserFormFields from "./UserFormFields";

const UserFormModal = ({
  isModalOpen,
  closeModal,
  isEditMode,
  handleSubmit,
  formData,
  handleChange,
  isPending,
  isUserDetailsLoading,
  permissionsCatalog = [],
  canManageCustomPermissions = false,
  onAvatarUpload,
  onAvatarDelete,
  isAvatarPending = false,
  avatarCacheKey,
}) => {
  const onSubmit = (e) => {
    e.preventDefault();
    if (isUserDetailsLoading) return;
    if (!isEditMode && formData.permissionMode === "CUSTOM" && !formData.permissions?.length) {
      return;
    }
    handleSubmit(e);
  };

  return (
    <Modal
      isOpen={isModalOpen}
      onClose={closeModal}
      title={isEditMode ? "تعديل المستخدم" : "إنشاء مستخدم جديد"}
    >
      <form onSubmit={onSubmit} className="space-y-5 text-right">
        <UserFormFields
          isEditMode={isEditMode}
          formData={formData}
          handleChange={handleChange}
          isUserDetailsLoading={isUserDetailsLoading}
          permissionsCatalog={permissionsCatalog}
          canManageCustomPermissions={canManageCustomPermissions}
          onAvatarUpload={onAvatarUpload}
          onAvatarDelete={onAvatarDelete}
          isAvatarPending={isAvatarPending}
          avatarCacheKey={avatarCacheKey}
        />
        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={isPending || isUserDetailsLoading}
          className="theme-button-primary w-full rounded-xl text-sm font-bold py-3.5 transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isUserDetailsLoading
            ? "جاري تحميل البيانات..."
            : isPending
              ? "جاري الحفظ..."
              : isEditMode
                ? "تحديث المستخدم"
                : "حفظ المستخدم"}
        </motion.button>
      </form>
    </Modal>
  );
};

export default UserFormModal;
