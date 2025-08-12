import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { PDFDocument, degrees } from "pdf-lib";

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
  if (spec.trim().toLowerCase() === "all") return Array.from({ length: total }, (_, i) => i);
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

export const PDFRotate = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [direction, setDirection] = useState<"left" | "right">("right");
  const [pageSpec, setPageSpec] = useState<string>("all");

  const rotate = async () => {
    if (!file) return;
    try {
      const ab = await file.arrayBuffer();
      const src = await PDFDocument.load(ab);
      const total = src.getPageCount();
      const indices = Array.from({ length: total }, (_, i) => i);
      const out = await PDFDocument.create();
      const pages = await out.copyPages(src, indices);
      const delta = direction === "right" ? 90 : -90;

      pages.forEach((p, i) => {
        out.addPage(p);
      });

      const selected = parsePageSpec(pageSpec, total);
      for (const idx of selected) {
        const page = out.getPage(idx);
        const current = page.getRotation().angle || 0;
        page.setRotation(degrees(((current + delta) % 360 + 360) % 360));
      }

      const bytes = await out.save({ useObjectStreams: true });
      downloadBlob(bytes, `rotated_${file.name}`);
      toast({ title: "Rotation applied", description: `${selected.length} page(s) rotated` });
    } catch (e: any) {
      toast({ title: "Failed to rotate", description: e?.message || "Unknown error" });
    }
  };

  const reset = () => {
    setFile(null);
    setDirection("right");
    setPageSpec("all");
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">PDF Rotate</h2>
        <p className="text-muted-foreground">Rotate selected pages left or right.</p>
      </header>

      {!file ? (
        <FileUpload onFiles={(files) => setFile(files[0])} accept={{ "application/pdf": [".pdf"] }} title="Upload PDF" description="Drop a PDF here or browse" />
      ) : (
        <div className="space-y-4">
          <div className="flex flex-wrap items-end gap-3">
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Pages (e.g., all or 1,3-5)</label>
              <Input value={pageSpec} onChange={(e) => setPageSpec(e.target.value)} placeholder="all" />
            </div>
            <div className="flex gap-2">
              <Button variant={direction === "left" ? "default" : "outline"} className={direction === "left" ? "" : "border-border/50"} onClick={() => setDirection("left")}>Rotate Left</Button>
              <Button variant={direction === "right" ? "default" : "outline"} className={direction === "right" ? "" : "border-border/50"} onClick={() => setDirection("right")}>Rotate Right</Button>
            </div>
            <Button onClick={rotate}>Apply</Button>
            <Button variant="outline" className="border-border/50" onClick={reset}>Reset</Button>
            <Button variant="outline" className="border-border/50" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      )}
    </section>
  );
};
