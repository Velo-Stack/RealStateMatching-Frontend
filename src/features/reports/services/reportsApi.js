import api from "../../../utils/api";

export const fetchReportFile = async (type, format, fields = [], startDate, endDate) => {
  const endpoint = format === "excel" ? "/reports/export/excel" : "/reports/export/pdf";

  const params = { type, fields: fields.join(",") };
  if (startDate) params.startDate = startDate;
  if (endDate) params.endDate = endDate;

  const { data, headers } = await api.get(endpoint, {
    params,
    responseType: "blob",
  });

  return { data, headers };
};
