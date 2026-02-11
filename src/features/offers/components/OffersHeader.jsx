import { FilePdf } from "phosphor-react";
import { PageHeader } from "../../../components/common";

const OffersHeader = ({ openCreate, canExportPDF, exportPDF }) => {
  const actions = canExportPDF
    ? [{ label: "تصدير PDF", icon: FilePdf, onClick: exportPDF, variant: "danger" }]
    : [];

  return (
    <PageHeader
      subtitle="إدارة العروض العقارية"
      onAdd={openCreate}
      addLabel="إضافة عرض جديد"
      actions={actions}
    />
  );
};

export default OffersHeader;
