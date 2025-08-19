import { LucideIcon } from "lucide-react";

interface ToolCardProps {
  title: string;
  description: string;
  icon: LucideIcon;
  onClick: () => void;
  gradient?: string;
}

export const ToolCard = ({ title, description, icon: Icon, onClick, gradient = "gradient-card" }: ToolCardProps) => {
  return (
    <div 
      className="tool-card cursor-pointer group"
      onClick={onClick}
    >
      <div className="flex flex-col items-center text-center space-y-4">
        <div className={`bg-accent p-4 rounded-xl group-hover:shadow-card transition-smooth`}>
          <Icon className="h-8 w-8 text-accent-foreground" />
        </div>
        
        <div>
          <h3 className="text-lg font-semibold text-foreground mb-2">
            {title}
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            {description}
          </p>
        </div>
      </div>
    </div>
  );
};