import { FilePdf } from "phosphor-react";
import { PageHeader } from "../../../components/common";

const OffersHeader = ({ openCreate, canExportPDF, exportPDF }) => {
  const actions = canExportPDF
    ? [
        {
          label: "تصدير PDF",
          icon: FilePdf,
          onClick: exportPDF,
          variant: "danger",
          className: "theme-button-white",
        },
      ]
    : [];

  return (
    <PageHeader
      subtitle="إدارة العروض العقارية"
      onAdd={openCreate}
      addLabel="إضافة عرض جديد"
      actions={actions}
      addButtonClassName="theme-button-white"
    />
  );
};

export default OffersHeader;
