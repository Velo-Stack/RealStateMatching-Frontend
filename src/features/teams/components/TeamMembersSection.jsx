import { motion } from "framer-motion";
import { Crown, Trash } from "phosphor-react";

const TeamMembersSection = ({
  team,
  isAdmin,
  updateRoleMutation,
  removeMemberMutation,
}) => (
  <motion.div
    initial={{ opacity: 0, height: 0 }}
    animate={{ opacity: 1, height: "auto" }}
    exit={{ opacity: 0, height: 0 }}
    className="space-y-2 pt-2 border-t border-white/5"
  >
    {team.members?.length === 0 ? (
      <p className="text-slate-500 text-sm text-center py-2">لا يوجد أعضاء</p>
    ) : (
      team.members?.map((member) => (
        <div
          key={member.id}
          className="flex items-center justify-between p-2 rounded-lg bg-white/5"
        >
          <div className="flex items-center gap-2">
            <div
              className={`h-8 w-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${
                member.role === "MANAGER"
                  ? "bg-gradient-to-br from-amber-500 to-orange-500"
                  : "bg-gradient-to-br from-emerald-500 to-cyan-500"
              }`}
            >
              {member.user?.name?.charAt(0) || "?"}
            </div>
            <div>
              <div className="flex items-center gap-1">
                <p className="text-white text-sm">{member.user?.name}</p>
                {member.role === "MANAGER" && (
                  <Crown size={12} className="text-amber-400" weight="fill" />
                )}
              </div>
              <p className="text-slate-500 text-xs">
                {member.role === "MANAGER" ? "مدير الفريق" : "عضو"}
              </p>
            </div>
          </div>

          {isAdmin && (
            <div className="flex items-center gap-1">
              {member.role !== "MANAGER" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    updateRoleMutation.mutate({
                      teamId: team.id,
                      memberId: member.user?.id,
                      role: "MANAGER",
                    })
                  }
                  disabled={updateRoleMutation.isPending}
                  className="h-7 w-7 rounded-lg bg-amber-500/10 text-amber-400 flex items-center justify-center hover:bg-amber-500/20 transition-colors"
                  title="تعيين كمدير"
                >
                  <Crown size={14} />
                </motion.button>
              )}

              {member.role === "MANAGER" && (
                <motion.button
                  whileHover={{ scale: 1.1 }}
                  whileTap={{ scale: 0.9 }}
                  onClick={() =>
                    updateRoleMutation.mutate({
                      teamId: team.id,
                      memberId: member.user?.id,
                      role: "MEMBER",
                    })
                  }
                  disabled={updateRoleMutation.isPending}
                  className="h-7 px-2 rounded-lg bg-slate-500/10 text-slate-400 flex items-center justify-center hover:bg-slate-500/20 transition-colors text-xs"
                  title="إزالة منصب المدير"
                >
                  إلغاء
                </motion.button>
              )}

              <motion.button
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => {
                  if (confirm(`هل تريد إزالة ${member.user?.name} من الفريق؟`)) {
                    removeMemberMutation.mutate({
                      teamId: team.id,
                      memberId: member.user?.id,
                    });
                  }
                }}
                disabled={removeMemberMutation.isPending}
                className="h-7 w-7 rounded-lg bg-red-500/10 text-red-400 flex items-center justify-center hover:bg-red-500/20 transition-colors"
                title="إزالة العضو"
              >
                <Trash size={14} />
              </motion.button>
            </div>
          )}
        </div>
      ))
    )}
  </motion.div>
);

export default TeamMembersSection;
