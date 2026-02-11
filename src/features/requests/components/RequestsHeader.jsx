import { PageHeader } from "../../../components/common";

const RequestsHeader = ({ openCreate }) => (
  <PageHeader
    subtitle="إدارة طلبات العملاء"
    onAdd={openCreate}
    addLabel="إضافة طلب جديد"
    addButtonClassName="theme-button-white"
  />
);

export default RequestsHeader;