import { Trophy, Settings, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import deciframLogo from "@/assets/decifra-logo.png";

interface GameHeaderProps {
  score?: number;
  level?: number;
}

export const GameHeader = ({ score = 0, level = 1 }: GameHeaderProps) => {
  return (
    <header className="flex items-center justify-between p-4 bg-gradient-card border-b border-border">
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-xl overflow-hidden shadow-glow">
          <img 
            src={deciframLogo} 
            alt="Decifra Logo" 
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h1 className="text-xl font-bold text-foreground">Decifra</h1>
          <p className="text-sm text-muted-foreground">Nível {level}</p>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        <div className="flex items-center gap-2 px-3 py-1 bg-gradient-success rounded-full">
          <Trophy className="w-4 h-4 text-success-foreground" />
          <span className="text-sm font-semibold text-success-foreground">{score}</span>
        </div>
        
        <Button variant="ghost" size="icon" className="w-10 h-10">
          <Settings className="w-5 h-5" />
        </Button>
      </div>
    </header>
  );
};