import api from "../../../utils/api";

export const fetchReportFile = async (type, format, fields = []) => {
  const endpoint = format === "excel" ? "/reports/export/excel" : "/reports/export/pdf";

  const { data, headers } = await api.get(endpoint, {
    params: { type, fields: fields.join(",") },
    responseType: "blob",
  });

  return { data, headers };
};
