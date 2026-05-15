import { PageHeader } from "../../../components/common";

const TeamsHeader = ({ canCreateTeam, setIsModalOpen }) => (
  <PageHeader
    subtitle="إدارة فرق العمل"
    subtitleClassName="theme-keep-white"
    onAdd={canCreateTeam ? () => setIsModalOpen(true) : null}
    addLabel="إنشاء فريق جديد"
    addButtonClassName="theme-button-white"
  />
);

export default TeamsHeader;
