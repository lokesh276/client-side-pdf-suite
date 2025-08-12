import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { PDFDocument } from "pdf-lib";

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

export const PDFExtract = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [pageSpec, setPageSpec] = useState("1");

  const extract = async () => {
    if (!file) return;
    try {
      const ab = await file.arrayBuffer();
      const src = await PDFDocument.load(ab);
      const total = src.getPageCount();
      const indices = parsePageSpec(pageSpec, total);
      if (indices.length === 0) {
        toast({ title: "No pages selected", description: "Please specify pages like 1,3-5" });
        return;
      }
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      for (const p of pages) out.addPage(p);
      const bytes = await out.save({ useObjectStreams: true });
      downloadBlob(bytes, `extracted_${file.name}`);
      toast({ title: "Pages extracted", description: `${indices.length} page(s) saved` });
    } catch (e: any) {
      toast({ title: "Failed to extract", description: e?.message || "Unknown error" });
    }
  };

  const reset = () => {
    setFile(null);
    setPageSpec("1");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Extract Pages</h2>
        <p className="text-muted-foreground">Extract and download specific pages as a new PDF.</p>
      </header>

      {!file ? (
        <FileUpload onFiles={(files) => setFile(files[0])} accept={{ "application/pdf": [".pdf"] }} title="Upload PDF" description="Drop a PDF here or browse" />
      ) : (
        <div className="space-y-4">
          <div className="flex items-end gap-3 flex-wrap">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Pages (e.g., 1,3-5)</label>
              <Input value={pageSpec} onChange={(e) => setPageSpec(e.target.value)} placeholder="1,3-5" />
            </div>
            <Button onClick={extract}>Extract</Button>
            <Button variant="outline" className="border-border/50" onClick={reset}>Reset</Button>
            <Button variant="outline" className="border-border/50" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      )}
    </section>
  );
};
