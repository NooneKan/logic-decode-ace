import { useLocation } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Home, ArrowLeft } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-4">
      <Card className="p-8 bg-gradient-card border-border text-center max-w-md w-full animate-slide-up">
        <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-primary flex items-center justify-center">
          <span className="text-3xl font-bold text-primary-foreground">404</span>
        </div>
        
        <h1 className="text-2xl font-bold text-foreground mb-2">Página não encontrada</h1>
        <p className="text-muted-foreground mb-6">
          Oops! A página que você está procurando não existe ou foi removida.
        </p>
        
        <div className="space-y-3">
          <Button 
            onClick={() => window.history.back()}
            variant="outline" 
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar
          </Button>
          
          <Button 
            onClick={() => window.location.href = "/"}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            <Home className="w-4 h-4 mr-2" />
            Ir para o Início
          </Button>
        </div>
      </Card>
    </div>
  );
};

export default NotFound;
