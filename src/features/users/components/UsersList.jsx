import UserItem from "./UserItem";
import EmptyState from "./EmptyState";

const UsersList = ({
  isLoading,
  activeUsers,
  openEditModal,
  handleToggleStatus,
  handleDelete,
  toggleStatus,
  deleteUser,
}) => {
  if (isLoading) {
    return (
      <div className="bg-[#111827]/60 backdrop-blur-xl rounded-2xl border border-white/5 p-8 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin" />
          <span className="text-slate-400 text-sm">جاري تحميل المستخدمين...</span>
        </div>
      </div>
    );
  }

  if (activeUsers.length === 0) {
    return <EmptyState />;
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {activeUsers.map((user, index) => (
        <UserItem
          key={user.id}
          user={user}
          index={index}
          openEditModal={openEditModal}
          handleToggleStatus={handleToggleStatus}
          handleDelete={handleDelete}
          toggleStatus={toggleStatus}
          deleteUser={deleteUser}
        />
      ))}
    </div>
  );
};

export default UsersList;
