export const createReportBlob = (data, format) =>
  new Blob([data], {
    type:
      format === "excel"
        ? "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"
        : "application/pdf",
  });

export const resolveReportFilename = (headers, type, format) => {
  const disposition = headers["content-disposition"];
  const match = disposition && disposition.match(/filename="?([^"]+)"?/);
  const fallback = `report-${type}.${format === "excel" ? "xlsx" : "pdf"}`;
  return decodeURIComponent(match ? match[1] : fallback);
};

export const triggerReportDownload = (blob, filename) => {
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.setAttribute("download", filename);
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
