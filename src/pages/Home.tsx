import { useState } from "react";
import { GameHeader } from "@/components/GameHeader";
import { LanguageCard } from "@/components/LanguageCard";
import { AuthModal } from "@/components/AuthModal";
import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Play, BookOpen, LogIn } from "lucide-react";
import deciframLogo from "@/assets/decifra-logo.png";

const languages = [
  {
    id: "java",
    title: "Java",
    description: "Conceitos de orientação a objetos, estruturas de dados e algoritmos em Java",
    icon: "code" as const,
    difficulty: "Médio" as const,
    questionsCount: 15
  },
  {
    id: "python",
    title: "Python",
    description: "Lógica de programação, estruturas de controle e manipulação de dados",
    icon: "code" as const,
    difficulty: "Fácil" as const,
    questionsCount: 12
  },
  {
    id: "sql",
    title: "SQL",
    description: "Consultas, joins, agregações e otimização de queries de banco de dados",
    icon: "database" as const,
    difficulty: "Médio" as const,
    questionsCount: 10
  },
  {
    id: "javascript",
    title: "JavaScript",
    description: "Funções, closures, promises e manipulação do DOM",
    icon: "server" as const,
    difficulty: "Médio" as const,
    questionsCount: 18
  }
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [userScore] = useState(1250);
  const [userLevel] = useState(5);
  const [showAuthModal, setShowAuthModal] = useState(false);

  const handleLanguageSelect = (languageId: string) => {
    navigate(`/quiz/${languageId}?ts=${Date.now()}`);
  };

  return (
    <div className="min-h-screen bg-background">
      <GameHeader 
        score={userScore} 
        level={userLevel} 
        onLoginClick={() => setShowAuthModal(true)} 
      />
      
      <main className="p-4 space-y-6">
        {/* Welcome Section */}
        <div className="text-center py-6">
          <div className="w-20 h-20 mx-auto mb-4 rounded-2xl overflow-hidden bg-gradient-primary shadow-glow animate-pulse-slow">
            <img 
              src={deciframLogo} 
              alt="Decifra Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <h1 className="text-2xl font-bold text-foreground mb-2">
            Bem-vindo ao Decifra!
          </h1>
          <p className="text-muted-foreground max-w-md mx-auto">
            Aprimore sua lógica de programação com desafios interativos em diversas linguagens
          </p>
          
          {!user && (
            <Button 
              onClick={() => setShowAuthModal(true)}
              className="mt-4 bg-gradient-primary hover:shadow-glow"
            >
              <LogIn className="w-4 h-4 mr-2" />
              Entrar ou Cadastrar-se
            </Button>
          )}
        </div>

        {/* Quick Start Button */}
        <div className="bg-gradient-card p-4 rounded-xl border border-border">
          <div className="flex items-center gap-3 mb-3">
            <BookOpen className="w-5 h-5 text-primary" />
            <h2 className="font-semibold text-foreground">Modo Rápido</h2>
          </div>
          <p className="text-sm text-muted-foreground mb-4">
            Questões aleatórias de todas as linguagens
          </p>
          <Button 
            onClick={() => navigate(`/quiz/random?ts=${Date.now()}`)}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            Começar Agora
          </Button>
        </div>

        {/* Language Selection */}
        <div>
          <h2 className="text-lg font-semibold text-foreground mb-4">
            Escolha uma Linguagem
          </h2>
          <div className="grid grid-cols-1 gap-4">
            {languages.map((language) => (
              <LanguageCard
                key={language.id}
                title={language.title}
                description={language.description}
                icon={language.icon}
                difficulty={language.difficulty}
                questionsCount={language.questionsCount}
                onSelect={() => handleLanguageSelect(language.id)}
              />
            ))}
          </div>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="bg-gradient-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-primary mb-1">{userLevel}</div>
            <div className="text-sm text-muted-foreground">Nível Atual</div>
          </div>
          <div className="bg-gradient-card p-4 rounded-xl border border-border text-center">
            <div className="text-2xl font-bold text-success mb-1">{userScore}</div>
            <div className="text-sm text-muted-foreground">Pontuação</div>
          </div>
        </div>
      </main>

      <AuthModal open={showAuthModal} onOpenChange={setShowAuthModal} />
    </div>
  );
}