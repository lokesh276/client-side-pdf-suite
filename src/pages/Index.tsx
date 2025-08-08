import { useState } from "react";
import { Navigation } from "@/components/Navigation";
import { ToolCard } from "@/components/ToolCard";
import { PDFMerge } from "@/components/tools/PDFMerge";
import { ImageToPDF } from "@/components/tools/ImageToPDF";
import { 
  Combine, 
  Split, 
  Image, 
  Eye, 
  RotateCw, 
  Scissors, 
  FileText, 
  Download,
  Edit,
  Stamp,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";

type Tool = 'merge' | 'split' | 'imageToPdf' | 'viewer' | 'rotate' | 'extract' | 'textToPdf' | 'compress' | 'editor' | 'watermark' | null;

const Index = () => {
  const [selectedTool, setSelectedTool] = useState<Tool>(null);

  const tools = [
    {
      id: 'merge' as const,
      title: 'PDF Merge',
      description: 'Combine multiple PDFs into one document',
      icon: Combine,
      gradient: 'gradient-primary'
    },
    {
      id: 'split' as const,
      title: 'PDF Split',
      description: 'Extract specific pages from a PDF',
      icon: Split,
      gradient: 'gradient-primary'
    },
    {
      id: 'imageToPdf' as const,
      title: 'Images to PDF',
      description: 'Convert multiple images into one PDF',
      icon: Image,
      gradient: 'gradient-primary'
    },
    {
      id: 'viewer' as const,
      title: 'PDF Viewer',
      description: 'Preview and view PDF documents',
      icon: Eye,
      gradient: 'gradient-primary'
    },
    {
      id: 'rotate' as const,
      title: 'PDF Rotate',
      description: 'Rotate pages left or right',
      icon: RotateCw,
      gradient: 'gradient-primary'
    },
    {
      id: 'extract' as const,
      title: 'Extract Pages',
      description: 'Extract and download specific pages',
      icon: Scissors,
      gradient: 'gradient-primary'
    },
    {
      id: 'textToPdf' as const,
      title: 'Text to PDF',
      description: 'Convert text content to PDF format',
      icon: FileText,
      gradient: 'gradient-primary'
    },
    {
      id: 'compress' as const,
      title: 'PDF Compress',
      description: 'Reduce PDF file size efficiently',
      icon: Download,
      gradient: 'gradient-primary'
    },
    {
      id: 'editor' as const,
      title: 'PDF Editor',
      description: 'Edit and annotate PDF documents',
      icon: Edit,
      gradient: 'gradient-primary'
    },
    {
      id: 'watermark' as const,
      title: 'Add Watermark',
      description: 'Add text or image watermarks to PDFs',
      icon: Stamp,
      gradient: 'gradient-primary'
    }
  ];

  const renderTool = () => {
    switch (selectedTool) {
      case 'merge':
        return <PDFMerge />;
      case 'imageToPdf':
        return <ImageToPDF />;
      default:
        return (
          <div className="text-center py-12">
            <h3 className="text-lg font-semibold text-foreground mb-2">Tool Coming Soon</h3>
            <p className="text-muted-foreground">This tool is under development</p>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {selectedTool ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <Button
                variant="outline"
                onClick={() => setSelectedTool(null)}
                className="border-border/50"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Tools
              </Button>
            </div>
            
            <div className="gradient-card border border-border/50 rounded-xl p-8 shadow-card">
              {renderTool()}
            </div>
          </div>
        ) : (
          <div className="space-y-12">
            {/* Hero Section */}
            <div className="text-center space-y-6">
              <div className="gradient-hero bg-clip-text text-transparent">
                <h1 className="text-5xl font-bold mb-4">
                  All In One Editor
                </h1>
              </div>
              <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                Professional PDF tools that work entirely in your browser. 
                Merge, split, convert, and edit your PDFs with complete privacy and security.
              </p>
            </div>

            {/* Tools Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {tools.map((tool) => (
                <ToolCard
                  key={tool.id}
                  title={tool.title}
                  description={tool.description}
                  icon={tool.icon}
                  gradient={tool.gradient}
                  onClick={() => setSelectedTool(tool.id)}
                />
              ))}
            </div>

            {/* Features Section */}
            <div className="text-center space-y-4 pt-12">
              <h2 className="text-3xl font-bold text-foreground">
                Why Choose All In One Editor?
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8">
                <div className="space-y-2">
                  <div className="gradient-primary p-3 rounded-lg w-fit mx-auto">
                    <Eye className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">100% Private</h3>
                  <p className="text-muted-foreground">All processing happens in your browser. Your files never leave your device.</p>
                </div>
                <div className="space-y-2">
                  <div className="gradient-primary p-3 rounded-lg w-fit mx-auto">
                    <Download className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">No Limits</h3>
                  <p className="text-muted-foreground">Process unlimited files without restrictions or watermarks.</p>
                </div>
                <div className="space-y-2">
                  <div className="gradient-primary p-3 rounded-lg w-fit mx-auto">
                    <RotateCw className="h-6 w-6 text-white" />
                  </div>
                  <h3 className="text-lg font-semibold text-foreground">Fast & Reliable</h3>
                  <p className="text-muted-foreground">Lightning-fast processing with professional-grade results.</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};

export default Index;