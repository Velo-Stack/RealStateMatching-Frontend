import { PageHeader } from "../../../components/common";

const TeamsHeader = ({ isAdmin, setIsModalOpen }) => (
  <PageHeader
    subtitle="إدارة فرق العمل"
    onAdd={isAdmin ? () => setIsModalOpen(true) : null}
    addLabel="إنشاء فريق جديد"
  />
);

export default TeamsHeader;
