import { useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
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

export const TextToPDF = () => {
  const { toast } = useToast();
  const [text, setText] = useState("");
  const [title, setTitle] = useState("Document");
  const [fontSize, setFontSize] = useState(12);

  const lines = useMemo(() => text.split("\n"), [text]);

  const generate = async () => {
    try {
      const doc = await PDFDocument.create();
      const page = doc.addPage([595.28, 841.89]); // A4
      const font = await doc.embedFont(StandardFonts.Helvetica);
      const margin = 48;
      const width = page.getWidth() - margin * 2;
      const lineHeight = fontSize * 1.4;

      let x = margin;
      let y = page.getHeight() - margin;

      page.drawText(title, { x, y, size: fontSize + 6, font, color: rgb(0, 0, 0) });
      y -= lineHeight * 1.6;

      const drawLine = (ln: string) => {
        const words = ln.split(" ");
        let current = "";
        for (const w of words) {
          const test = current ? current + " " + w : w;
          const widthAtSize = font.widthOfTextAtSize(test, fontSize);
          if (widthAtSize > width) {
            page.drawText(current, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
            y -= lineHeight;
            if (y < margin) {
              // new page
              y = page.getHeight() - margin;
            }
            current = w;
          } else {
            current = test;
          }
        }
        if (current) {
          page.drawText(current, { x, y, size: fontSize, font, color: rgb(0, 0, 0) });
          y -= lineHeight;
        }
      };

      for (const l of lines) drawLine(l);

      const bytes = await doc.save({ useObjectStreams: true });
      downloadBlob(bytes, `${title || "document"}.pdf`);
      toast({ title: "PDF created", description: "Your text has been converted to PDF" });
    } catch (e: any) {
      toast({ title: "Failed to create PDF", description: e?.message || "Unknown error" });
    }
  };

  const reset = () => {
    setText("");
    setTitle("Document");
    setFontSize(12);
  };

  return (
    <section className="space-y-6">
      <header className="space-y-2">
        <h2 className="text-2xl font-semibold text-foreground">Text to PDF</h2>
        <p className="text-muted-foreground">Type or paste text and convert to a downloadable PDF.</p>
      </header>

      <div className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 items-end">
          <div className="space-y-2 md:col-span-2">
            <label className="text-sm text-muted-foreground">Title</label>
            <Input value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Document" />
          </div>
          <div className="space-y-2">
            <label className="text-sm text-muted-foreground">Font size</label>
            <Input type="number" value={fontSize} onChange={(e) => setFontSize(parseInt(e.target.value || "12", 10))} />
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm text-muted-foreground">Content</label>
          <Textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your content here..." rows={10} />
        </div>

        <div className="flex gap-2 flex-wrap">
          <Button onClick={generate}>Generate PDF</Button>
          <Button variant="outline" className="border-border/50" onClick={reset}>Reset</Button>
          <Button variant="outline" className="border-border/50" onClick={() => window.print()}>Print</Button>
        </div>
      </div>
    </section>
  );
};
