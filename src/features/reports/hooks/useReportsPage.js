import { useState } from "react";
import { toast } from "sonner";
import {
  DEFAULT_REPORT_FIELDS,
  REPORTS_DEFAULT_TYPE,
  REPORTS_DOWNLOAD_ERROR_MESSAGE,
  REPORTS_DOWNLOAD_RESET_DELAY,
  REPORT_FIELD_OPTIONS,
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
  const [selectedFieldsByType, setSelectedFieldsByType] = useState(
    DEFAULT_REPORT_FIELDS,
  );

  const availableFields = REPORT_FIELD_OPTIONS[type] || [];
  const selectedFields =
    selectedFieldsByType[type] || DEFAULT_REPORT_FIELDS[type] || [];
  const selectedReport = REPORT_TYPES.find((report) => report.value === type);

  const handleTypeChange = (nextType) => {
    setType(nextType);
    setSelectedFieldsByType((current) => ({
      ...current,
      [nextType]: current[nextType] || DEFAULT_REPORT_FIELDS[nextType] || [],
    }));
  };

  const toggleField = (fieldValue) => {
    setSelectedFieldsByType((current) => {
      const currentFields = current[type] || [];
      const nextFields = currentFields.includes(fieldValue)
        ? currentFields.filter((field) => field !== fieldValue)
        : [...currentFields, fieldValue];

      return {
        ...current,
        [type]: nextFields,
      };
    });
  };

  const selectAllFields = () => {
    setSelectedFieldsByType((current) => ({
      ...current,
      [type]: availableFields.map((field) => field.value),
    }));
  };

  const resetDefaultFields = () => {
    setSelectedFieldsByType((current) => ({
      ...current,
      [type]: DEFAULT_REPORT_FIELDS[type] || [],
    }));
  };

  const handleDownload = async (format) => {
    if (!selectedFields.length) {
      toast.error("اختار حقل واحد على الأقل قبل التصدير.");
      return;
    }

    setDownloading(format);

    try {
      const { data, headers } = await fetchReportFile(type, format, selectedFields);
      const blob = createReportBlob(data, format);
      const filename = resolveReportFilename(headers, type, format);
      triggerReportDownload(blob, filename);
    } catch {
      toast.error(REPORTS_DOWNLOAD_ERROR_MESSAGE);
    } finally {
      setTimeout(() => setDownloading(null), REPORTS_DOWNLOAD_RESET_DELAY);
    }
  };

  return {
    type,
    setType: handleTypeChange,
    downloading,
    handleDownload,
    selectedReport,
    availableFields,
    selectedFields,
    toggleField,
    selectAllFields,
    resetDefaultFields,
  };
};
