import { Button } from "@/components/ui/button";
import { Download, RefreshCw, Loader2, CheckCircle } from "lucide-react";

interface ProcessingCardProps {
  title: string;
  description: string;
}

export const ProcessingCard = ({ title, description }: ProcessingCardProps) => {
  return (
    <div className="text-center py-12 space-y-4">
      <div className="gradient-primary p-4 rounded-full w-fit mx-auto">
        <Loader2 className="h-8 w-8 text-white animate-spin" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground">{description}</p>
      </div>
    </div>
  );
};

interface ResultCardProps {
  title: string;
  description: string;
  onDownload: () => void;
  onReset: () => void;
  filename: string;
}

export const ResultCard = ({ title, description, onDownload, onReset, filename }: ResultCardProps) => {
  return (
    <div className="text-center py-12 space-y-6">
      <div className="gradient-primary p-4 rounded-full w-fit mx-auto">
        <CheckCircle className="h-8 w-8 text-white" />
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-foreground mb-2">{title}</h3>
        <p className="text-muted-foreground mb-4">{description}</p>
        <p className="text-sm font-medium text-foreground bg-muted/30 p-2 rounded border border-border/50 inline-block">
          {filename}
        </p>
      </div>

      <div className="flex gap-3 justify-center">
        <Button onClick={onDownload} className="min-w-32">
          <Download className="h-4 w-4 mr-2" />
          Download
        </Button>
        <Button variant="outline" onClick={onReset}>
          <RefreshCw className="h-4 w-4 mr-2" />
          Convert Another
        </Button>
      </div>
    </div>
  );
};

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

export const PDFSplitExtractUtils = { parsePageSpec };
