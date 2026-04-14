import { PageHeader } from "../../../components/common";

const OffersHeader = ({ openCreate }) => (
  <PageHeader
    subtitle="إدارة العروض العقارية"
    onAdd={openCreate}
    addLabel="إضافة عرض جديد"
    addButtonClassName="theme-button-white"
  />
);

export default OffersHeader;
