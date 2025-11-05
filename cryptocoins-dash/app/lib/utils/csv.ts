import Papa from "papaparse";

export interface CSVExportData {
  [key: string]: string | number | null | undefined;
}

export function exportToCSV(
  data: CSVExportData[],
  filename: string = "crypto-data.csv"
): void {
  const csv = Papa.unparse(data, {
    header: true,
    skipEmptyLines: true,
  });

  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);

  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
