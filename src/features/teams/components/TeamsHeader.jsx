import { PageHeader } from "../../../components/common";

const TeamsHeader = ({ isAdmin, setIsModalOpen }) => (
  <PageHeader
    subtitle="إدارة فرق العمل"
    subtitleClassName="theme-keep-white"
    onAdd={isAdmin ? () => setIsModalOpen(true) : null}
    addLabel="إنشاء فريق جديد"
    addButtonClassName="theme-button-white"
  />
);

export default TeamsHeader;