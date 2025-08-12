import { useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { PDFDocument } from "pdf-lib";

function formatBytes(bytes: number) {
  if (bytes === 0) return "0 B";
  const k = 1024;
  const sizes = ["B", "KB", "MB", "GB"]; 
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + " " + sizes[i];
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

export const PDFCompress = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [originalSize, setOriginalSize] = useState<number | null>(null);
  const [compressedBytes, setCompressedBytes] = useState<Uint8Array | null>(null);

  useEffect(() => {
    setOriginalSize(file ? file.size : null);
    setCompressedBytes(null);
  }, [file]);

  const compress = async () => {
    if (!file) return;
    try {
      const ab = await file.arrayBuffer();
      const doc = await PDFDocument.load(ab);
      // Re-save with object streams enabled (basic compression)
      const bytes = await doc.save({ useObjectStreams: true });
      setCompressedBytes(bytes);
      toast({ title: "Compression complete", description: `Saved ${Math.max(0, (file.size - bytes.byteLength))} bytes` });
    } catch (e: any) {
      toast({ title: "Failed to compress", description: e?.message || "Unknown error" });
    }
  };

  const download = () => {
    if (!compressedBytes || !file) return;
    downloadBlob(compressedBytes, `compressed_${file.name}`);
  };

  const reset = () => {
    setFile(null);
    setCompressedBytes(null);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">PDF Compress</h2>
        <p className="text-muted-foreground">Reduce PDF size with client-side processing.</p>
      </header>

      {!file ? (
        <FileUpload onFiles={(files) => setFile(files[0])} accept={{ "application/pdf": [".pdf"] }} title="Upload PDF" description="Drop a PDF here or browse" />
      ) : (
        <div className="space-y-4">
          <div className="text-sm text-muted-foreground">
            Original size: {originalSize ? formatBytes(originalSize) : "-"}
            {compressedBytes && (
              <span> • Compressed: {formatBytes(compressedBytes.byteLength)}</span>
            )}
          </div>
          <div className="flex gap-2 flex-wrap">
            <Button onClick={compress}>Compress</Button>
            <Button variant="outline" className="border-border/50" onClick={download} disabled={!compressedBytes}>Download</Button>
            <Button variant="outline" className="border-border/50" onClick={reset}>Reset</Button>
            <Button variant="outline" className="border-border/50" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      )}
    </section>
  );
};
