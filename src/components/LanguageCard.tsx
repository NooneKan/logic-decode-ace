import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ChevronRight, Code, Database, Server } from "lucide-react";

interface LanguageCardProps {
  title: string;
  description: string;
  icon: "code" | "database" | "server";
  difficulty: "Fácil" | "Médio" | "Difícil";
  questionsCount: number;
  onSelect: () => void;
}

const iconMap = {
  code: Code,
  database: Database,
  server: Server,
};

const difficultyColors = {
  "Fácil": "text-success",
  "Médio": "text-warning", 
  "Difícil": "text-destructive"
};

export const LanguageCard = ({ 
  title, 
  description, 
  icon, 
  difficulty, 
  questionsCount,
  onSelect 
}: LanguageCardProps) => {
  const IconComponent = iconMap[icon];
  
  return (
    <Card className="p-4 bg-gradient-card border-border hover:shadow-glow transition-all duration-300 animate-slide-up">
      <div className="flex items-start justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-lg bg-gradient-primary flex items-center justify-center">
            <IconComponent className="w-6 h-6 text-primary-foreground" />
          </div>
          <div>
            <h3 className="font-semibold text-foreground">{title}</h3>
            <p className="text-sm text-muted-foreground">{questionsCount} questões</p>
          </div>
        </div>
        <span className={`text-sm font-medium ${difficultyColors[difficulty]}`}>
          {difficulty}
        </span>
      </div>
      
      <p className="text-sm text-muted-foreground mb-4">{description}</p>
      
      <Button 
        onClick={onSelect}
        className="w-full bg-gradient-primary hover:shadow-glow transition-all duration-300"
      >
        Começar Desafio
        <ChevronRight className="w-4 h-4 ml-2" />
      </Button>
    </Card>
  );
};