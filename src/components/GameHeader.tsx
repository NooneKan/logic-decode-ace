import { Trophy, Settings, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { DropdownMenu, DropdownMenuContent, DropdownMenuGroup, DropdownMenuItem, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import deciframLogo from "@/assets/decifra-logo.png";

interface GameHeaderProps {
  score?: number;
  level?: number;
}

export const GameHeader = ({ score = 0, level = 1 }: GameHeaderProps) => {
  const { user, signOut } = useAuth();
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await signOut();
    navigate("/");
  };
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
        
        {user ? (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="relative h-10 w-10 rounded-full">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={user.user_metadata?.avatar_url} />
                  <AvatarFallback>
                    {user.email?.charAt(0).toUpperCase() || "U"}
                  </AvatarFallback>
                </Avatar>
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end" forceMount>
              <DropdownMenuGroup>
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Minhas Pontuações</span>
                </DropdownMenuItem>
              </DropdownMenuGroup>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={handleSignOut}>
                <LogOut className="mr-2 h-4 w-4" />
                <span>Sair</span>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        ) : (
          <Button variant="ghost" size="icon" className="w-10 h-10">
            <Settings className="w-5 h-5" />
          </Button>
        )}
      </div>
    </header>
  );
};