import { Buildings } from "phosphor-react";

export const REPORT_TYPES = [
  {
    value: "offers",
    label: "العروض العقارية",
    icon: Buildings,
    color: "from-emerald-500 to-emerald-600",
  },
];

export const REPORTS_DEFAULT_TYPE = "offers";

export const REPORTS_DOWNLOAD_RESET_DELAY = 1000;

export const REPORTS_DOWNLOAD_ERROR_MESSAGE =
  "فشل تحميل التقرير، يرجى المحاولة مرة أخرى.";
