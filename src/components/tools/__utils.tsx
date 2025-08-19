import { PDFDocument } from "pdf-lib";

export function downloadFile(blob: Blob, filename: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function downloadBlob(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

function parsePageSpec(spec: string, total: number): number[] {
  const parts = spec.split(",").map((p) => p.trim()).filter(Boolean);
  const set = new Set<number>();
  for (const part of parts) {
    if (part.includes("-")) {
      const [s, e] = part.split("-").map((n) => parseInt(n.trim(), 10));
      if (!isNaN(s) && !isNaN(e)) {
        const start = Math.max(1, Math.min(s, e));
        const end = Math.min(total, Math.max(s, e));
        for (let i = start; i <= end; i++) set.add(i - 1);
      }
    } else {
      const n = parseInt(part, 10);
      if (!isNaN(n) && n >= 1 && n <= total) set.add(n - 1);
    }
  }
  return Array.from(set).sort((a, b) => a - b);
}

export const SimpleExtract = async (file: File, pageSpec: string) => {
  const ab = await file.arrayBuffer();
  const src = await PDFDocument.load(ab);
  const total = src.getPageCount();
  const indices = parsePageSpec(pageSpec, total);
  const out = await PDFDocument.create();
  const pages = await out.copyPages(src, indices);
  pages.forEach((p) => out.addPage(p));
  return out.save({ useObjectStreams: true });
};
