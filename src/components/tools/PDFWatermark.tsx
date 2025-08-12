import { useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FileUpload } from "@/components/FileUpload";
import { useToast } from "@/components/ui/use-toast";
import { PDFDocument, StandardFonts, rgb } from "pdf-lib";

function downloadBlob(data: Uint8Array, filename: string) {
  const blob = new Blob([data], { type: "application/pdf" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export const PDFWatermark = () => {
  const { toast } = useToast();
  const [file, setFile] = useState<File | null>(null);
  const [text, setText] = useState("CONFIDENTIAL");
  const [fontSize, setFontSize] = useState(48);
  const [opacity, setOpacity] = useState(0.2);
  const [imageFile, setImageFile] = useState<File | null>(null);

  const apply = async () => {
    if (!file) return;
    try {
      const ab = await file.arrayBuffer();
      const doc = await PDFDocument.load(ab);

      let embeddedImage: any = null;
      if (imageFile) {
        const imgAb = await imageFile.arrayBuffer();
        const bytes = new Uint8Array(imgAb);
        // Try PNG then JPG
        try {
          embeddedImage = await doc.embedPng(bytes);
        } catch {
          embeddedImage = await doc.embedJpg(bytes);
        }
      }

      const font = await doc.embedFont(StandardFonts.Helvetica);

      const pages = doc.getPages();
      pages.forEach((page) => {
        const { width, height } = page.getSize();
        if (embeddedImage) {
          const iw = embeddedImage.width;
          const ih = embeddedImage.height;
          const scale = Math.min(width * 0.5 / iw, height * 0.5 / ih);
          const w = iw * scale;
          const h = ih * scale;
          page.drawImage(embeddedImage, {
            x: (width - w) / 2,
            y: (height - h) / 2,
            width: w,
            height: h,
            opacity,
          });
        }
        if (text) {
          const tw = font.widthOfTextAtSize(text, fontSize);
          page.drawText(text, {
            x: (width - tw) / 2,
            y: height / 2 + (embeddedImage ? -20 : 0),
            size: fontSize,
            font,
            color: rgb(0.2, 0.2, 0.2),
            opacity,
          });
        }
      });

      const bytes = await doc.save({ useObjectStreams: true });
      downloadBlob(bytes, `watermarked_${file.name}`);
      toast({ title: "Watermark added", description: "Your PDF has been watermarked" });
    } catch (e: any) {
      toast({ title: "Failed to watermark", description: e?.message || "Unknown error" });
    }
  };

  const reset = () => {
    setFile(null);
    setText("CONFIDENTIAL");
    setFontSize(48);
    setOpacity(0.2);
    setImageFile(null);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Add Watermark</h2>
        <p className="text-muted-foreground">Overlay text or an image watermark on each page.</p>
      </header>

      {!file ? (
        <FileUpload onFiles={(files) => setFile(files[0])} accept={{ "application/pdf": [".pdf"] }} title="Upload PDF" description="Drop a PDF here or browse" />
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">Watermark text</label>
              <Input value={text} onChange={(e) => setText(e.target.value)} placeholder="CONFIDENTIAL" />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Font size</label>
              <Input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value || "48", 10))} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-end">
            <div className="space-y-2 md:col-span-2">
              <label className="text-sm text-muted-foreground">Optional image watermark (PNG/JPG)</label>
              <input
                type="file"
                accept="image/png,image/jpeg"
                onChange={(e) => setImageFile(e.target.files?.[0] || null)}
                className="block w-full text-sm text-foreground"
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm text-muted-foreground">Opacity: {opacity.toFixed(2)}</label>
              <input type="range" min={0.05} max={1} step={0.05} value={opacity} onChange={(e) => setOpacity(parseFloat(e.target.value))} className="w-full" />
            </div>
          </div>

          <div className="flex gap-2 flex-wrap">
            <Button onClick={apply}>Apply Watermark</Button>
            <Button variant="outline" className="border-border/50" onClick={reset}>Reset</Button>
            <Button variant="outline" className="border-border/50" onClick={() => window.print()}>Print</Button>
          </div>
        </div>
      )}
    </section>
  );
};
