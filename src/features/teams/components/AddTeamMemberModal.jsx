import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { MagnifyingGlass, X } from "phosphor-react";
import Modal from "../../../components/Modal";
import { labelClasses, submitButtonClasses } from "../../../constants/styles";
import {
  getAvailableUsersForTeam,
  getUserSystemRoleClasses,
  getUserSystemRoleLabel,
} from "../utils/teamsUtils";

const AddTeamMemberModal = ({
  isMemberModalOpen,
  setIsMemberModalOpen,
  selectedTeam,
  handleAddMember,
  users,
  memberData,
  setMemberData,
  addMemberMutation,
}) => {
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    if (!isMemberModalOpen) {
      setSearchQuery("");
    }
  }, [isMemberModalOpen]);

  const availableUsers = getAvailableUsersForTeam(users, selectedTeam);

  const filteredUsers = availableUsers.filter((user) => {
    if (!searchQuery.trim()) return true;
    const query = searchQuery.toLowerCase().trim();
    return (
      user.name?.toLowerCase().includes(query) ||
      user.email?.toLowerCase().includes(query)
    );
  });

  return (
    <Modal
      isOpen={isMemberModalOpen}
      onClose={() => {
        setSearchQuery("");
        setIsMemberModalOpen(false);
      }}
      title={`إضافة عضو إلى ${selectedTeam?.name || ""}`}
    >
      <form onSubmit={handleAddMember} className="space-y-5 text-right">
        <div>
          <label className={labelClasses}>اختر العضو</label>
          
          {/* حقل البحث في المستخدمين */}
          <div className="relative mb-3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="ابحث بالاسم أو البريد الإلكتروني..."
              className="w-full bg-white/5 border border-white/10 rounded-xl py-2.5 pr-10 pl-10 text-sm text-white placeholder-slate-400 outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/50 transition-all"
            />
            <MagnifyingGlass
              size={18}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery("")}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white transition-colors"
              >
                <X size={16} />
              </button>
            )}
          </div>

          <div className="max-h-48 overflow-y-auto space-y-2 p-2 rounded-xl bg-white/5 border border-white/10">
            {filteredUsers.length === 0 ? (
              <p className="text-slate-500 text-sm text-center py-4">
                {searchQuery ? "لا يوجد نتائج مطابقة للبحث" : "لا يوجد أعضاء متاحين"}
              </p>
            ) : (
              filteredUsers.map((user) => (
                <motion.div
                  key={user.id}
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                  onClick={() => {
                    setMemberData({ ...memberData, userId: user.id.toString() });
                    setSearchQuery("");
                  }}
                  className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-all ${
                    memberData.userId === user.id.toString()
                      ? "bg-gradient-to-r from-emerald-500/20 to-cyan-500/10 border border-emerald-500/30"
                      : "bg-white/5 border border-transparent hover:bg-white/10 hover:border-white/10"
                  }`}
                >
                  <div
                    className={`h-10 w-10 rounded-xl flex items-center justify-center font-bold text-sm ${
                      memberData.userId === user.id.toString()
                        ? "bg-gradient-to-br from-emerald-500 to-cyan-500 text-white"
                        : "bg-white/10 text-slate-400"
                    }`}
                  >
                    {user.name?.charAt(0)}
                  </div>
                  <div className="flex-1">
                    <p
                      className={`text-sm font-medium ${
                        memberData.userId === user.id.toString()
                          ? "text-white"
                          : "text-slate-300"
                      }`}
                    >
                      {user.name}
                    </p>
                    <p className="text-xs text-slate-500">{user.email}</p>
                  </div>
                  <span
                    className={`text-xs px-2 py-1 rounded-lg ${getUserSystemRoleClasses(
                      user.role,
                    )}`}
                  >
                    {getUserSystemRoleLabel(user.role)}
                  </span>
                  {memberData.userId === user.id.toString() && (
                    <div className="h-5 w-5 rounded-full bg-emerald-500 flex items-center justify-center">
                      <svg
                        className="w-3 h-3 text-white"
                        fill="currentColor"
                        viewBox="0 0 20 20"
                      >
                        <path
                          fillRule="evenodd"
                          d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                          clipRule="evenodd"
                        />
                      </svg>
                    </div>
                  )}
                </motion.div>
              ))
            )}
          </div>
        </div>

        <div>
          <label className={labelClasses}>دور العضو في الفريق</label>
          {selectedTeam?.members?.some((member) => member.role === "MANAGER") &&
            memberData.role === "MANAGER" && (
              <div className="mb-2 p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 text-xs">
                ⚠️ سيتم استبدال المدير الحالي للفريق
              </div>
            )}
          <div className="flex gap-2">
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMemberData({ ...memberData, role: "MEMBER" })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                memberData.role === "MEMBER"
                  ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-white"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              عضو
            </motion.button>
            <motion.button
              type="button"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setMemberData({ ...memberData, role: "MANAGER" })}
              className={`flex-1 py-2.5 px-4 rounded-xl text-sm font-medium transition-all ${
                memberData.role === "MANAGER"
                  ? "bg-gradient-to-r from-amber-500 to-orange-500 text-white"
                  : "bg-white/5 text-slate-400 border border-white/10 hover:bg-white/10"
              }`}
            >
              مدير الفريق
            </motion.button>
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.01 }}
          whileTap={{ scale: 0.99 }}
          type="submit"
          disabled={!memberData.userId || addMemberMutation.isPending}
          className={submitButtonClasses}
        >
          {addMemberMutation.isPending ? "جاري الإضافة..." : "إضافة العضو"}
        </motion.button>
      </form>
    </Modal>
  );
};

export default AddTeamMemberModal;


