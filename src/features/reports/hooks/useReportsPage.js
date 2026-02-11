import { useState } from "react";
import { toast } from "sonner";
import {
  REPORTS_DEFAULT_TYPE,
  REPORTS_DOWNLOAD_ERROR_MESSAGE,
  REPORTS_DOWNLOAD_RESET_DELAY,
  REPORT_TYPES,
} from "../constants/reportsConstants";
import { fetchReportFile } from "../services/reportsApi";
import {
  createReportBlob,
  resolveReportFilename,
  triggerReportDownload,
} from "../utils/reportsDownloadUtils";

export const useReportsPage = () => {
  const [type, setType] = useState(REPORTS_DEFAULT_TYPE);
  const [downloading, setDownloading] = useState(null);

  const handleDownload = async (format) => {
    setDownloading(format);

    try {
      const { data, headers } = await fetchReportFile(type, format);
      const blob = createReportBlob(data, format);
      const filename = resolveReportFilename(headers, type, format);
      triggerReportDownload(blob, filename);
    } catch {
      toast.error(REPORTS_DOWNLOAD_ERROR_MESSAGE);
    } finally {
      setTimeout(() => setDownloading(null), REPORTS_DOWNLOAD_RESET_DELAY);
    }
  };

  const selectedReport = REPORT_TYPES.find((report) => report.value === type);

  return {
    type,
    setType,
    downloading,
    handleDownload,
    selectedReport,
  };
};
