import api from "../../../utils/api";

export const fetchReportFile = async (type, format) => {
  const endpoint = format === "excel" ? "/reports/export/excel" : "/reports/export/pdf";

  const { data, headers } = await api.get(endpoint, {
    params: { type },
    responseType: "blob",
  });

  return { data, headers };
};
