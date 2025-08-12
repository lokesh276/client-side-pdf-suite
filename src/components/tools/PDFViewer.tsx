import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import * as pdfjsLib from "pdfjs-dist";
// @ts-ignore - Vite worker import
import PdfWorker from "pdfjs-dist/build/pdf.worker.min.mjs?worker";

export const PDFViewer = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [images, setImages] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Configure PDF.js worker once
    try {
      const worker = new (PdfWorker as any)();
      (pdfjsLib as any).GlobalWorkerOptions.workerPort = worker;
    } catch (_) {
      // ignore if already set
    }
  }, []);

  useEffect(() => {
    const render = async () => {
      if (!file) return;
      setLoading(true);
      setImages([]);
      try {
        const arrayBuffer = await file.arrayBuffer();
        const loadingTask = (pdfjsLib as any).getDocument({ data: arrayBuffer });
        const pdf = await loadingTask.promise;
        const imgs: string[] = [];

        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const viewport = page.getViewport({ scale: 1.5 });
          const canvas = document.createElement("canvas");
          const context = canvas.getContext("2d");
          if (!context) continue;
          canvas.width = viewport.width;
          canvas.height = viewport.height;

          await page.render({ canvasContext: context, viewport }).promise;
          const dataUrl = canvas.toDataURL("image/png");
          imgs.push(dataUrl);
        }
        setImages(imgs);
      } catch (e: any) {
        toast({ title: "Failed to render PDF", description: e?.message || "Unknown error" });
      } finally {
        setLoading(false);
      }
    };
    render();
  }, [file, toast]);

  const openInNewTab = () => {
    if (!file) return;
    const url = URL.createObjectURL(file);
    window.open(url, "_blank");
  };

  const reset = () => {
    setFile(null);
    setImages([]);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">PDF Viewer</h2>
        <p className="text-muted-foreground">Preview your PDF pages in the browser.</p>
      </header>

      {!file ? (
        <FileUpload onFiles={(files) => setFile(files[0])} accept={{ "application/pdf": [".pdf"] }} title="Upload PDF" description="Drop a PDF here or browse to preview" />
      ) : (
        <div className="space-y-4">
          <div className="flex gap-2 flex-wrap">
            <Button variant="outline" className="border-border/50" onClick={openInNewTab}>
              Open Original
            </Button>
            <Button variant="outline" className="border-border/50" onClick={reset}>
              Reset
            </Button>
            <Button variant="outline" className="border-border/50" onClick={() => window.print()}>
              Print
            </Button>
          </div>

          {loading ? (
            <div className="text-muted-foreground">Rendering pages...</div>
          ) : images.length === 0 ? (
            <div className="text-muted-foreground">No pages rendered.</div>
          ) : (
            <div className="grid grid-cols-1 gap-6">
              {images.map((src, idx) => (
                <article key={idx} className="border border-border/50 rounded-lg overflow-hidden bg-card">
                  <img src={src} alt={`PDF viewer page ${idx + 1} preview`} loading="lazy" className="w-full h-auto" />
                </article>
              ))}
            </div>
          )}
        </div>
      )}
    </section>
  );
};
