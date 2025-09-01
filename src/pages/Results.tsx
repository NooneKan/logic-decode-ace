import { useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Trophy, Target, RotateCcw, Home, Star } from "lucide-react";
import { toast } from "@/hooks/use-toast";
import { useEffect, useState } from "react";

export default function Results() {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [saved, setSaved] = useState(false);
  
  const { score = 0, totalQuestions = 0, language = "" } = location.state || {};
  
  const correctAnswers = Math.floor(score / 100);
  const percentage = totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0;

  // Salvar pontuação se usuário estiver logado
  useEffect(() => {
    const saveScore = async () => {
      if (user && !saved && score > 0) {
        try {
          const { error } = await supabase
            .from('scores')
            .insert({
              user_id: user.id,
              language: language,
              score: score,
              accuracy: percentage,
              total_questions: totalQuestions
            });

          if (error) {
            console.error('Error saving score:', error);
            toast({
              title: "Erro ao salvar pontuação",
              description: "Não foi possível salvar sua pontuação.",
              variant: "destructive",
            });
          } else {
            setSaved(true);
            toast({
              title: "Pontuação salva!",
              description: "Sua pontuação foi salva no seu perfil.",
            });
          }
        } catch (error) {
          console.error('Error saving score:', error);
        }
      }
    };

    saveScore();
  }, [user, saved, score, language, percentage, totalQuestions]);
  
  const getPerformanceMessage = () => {
    if (percentage >= 90) return { message: "Excelente!", color: "text-success", stars: 3 };
    if (percentage >= 70) return { message: "Muito Bom!", color: "text-primary", stars: 2 };
    if (percentage >= 50) return { message: "Bom trabalho!", color: "text-warning", stars: 1 };
    return { message: "Continue praticando!", color: "text-muted-foreground", stars: 0 };
  };

  const performance = getPerformanceMessage();

  const getLanguageTitle = () => {
    const titles = {
      java: "Java",
      python: "Python", 
      sql: "SQL",
      javascript: "JavaScript",
      random: "Modo Rápido"
    };
    return titles[language as keyof typeof titles] || "Quiz";
  };

  return (
    <div className="min-h-screen bg-background p-4 flex flex-col items-center justify-center">
      <div className="w-full max-w-md space-y-6 animate-slide-up">
        {/* Trophy Animation */}
        <div className="text-center">
          <div className="w-24 h-24 mx-auto mb-4 rounded-full bg-gradient-primary flex items-center justify-center shadow-glow animate-pulse-slow">
            <Trophy className="w-12 h-12 text-primary-foreground" />
          </div>
          
          {/* Stars */}
          <div className="flex justify-center gap-1 mb-2">
            {[...Array(3)].map((_, i) => (
              <Star 
                key={i}
                className={`w-6 h-6 ${
                  i < performance.stars 
                    ? 'text-warning fill-warning' 
                    : 'text-muted-foreground'
                }`}
              />
            ))}
          </div>
          
          <h1 className={`text-2xl font-bold mb-2 ${performance.color}`}>
            {performance.message}
          </h1>
          <p className="text-muted-foreground">
            Quiz de {getLanguageTitle()} concluído
          </p>
          
          {user && (
            <p className="text-xs text-muted-foreground mt-2">
              {saved ? "✓ Pontuação salva no seu perfil" : "Salvando pontuação..."}
            </p>
          )}
        </div>

        {/* Results Card */}
        <Card className="p-6 bg-gradient-card border-border">
          <div className="grid grid-cols-2 gap-4 text-center">
            <div>
              <div className="text-3xl font-bold text-primary mb-1">{score}</div>
              <div className="text-sm text-muted-foreground">Pontos</div>
            </div>
            <div>
              <div className="text-3xl font-bold text-success mb-1">{percentage}%</div>
              <div className="text-sm text-muted-foreground">Acertos</div>
            </div>
          </div>
          
          <div className="mt-6 pt-4 border-t border-border">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">Questões corretas:</span>
              <span className="font-semibold text-foreground">
                {correctAnswers}/{totalQuestions}
              </span>
            </div>
          </div>
        </Card>

        {/* Detailed Stats */}
        <div className="grid grid-cols-3 gap-3">
          <Card className="p-3 bg-gradient-card border-border text-center">
            <Target className="w-6 h-6 text-primary mx-auto mb-2" />
            <div className="text-lg font-bold text-foreground">{correctAnswers}</div>
            <div className="text-xs text-muted-foreground">Corretas</div>
          </Card>
          
          <Card className="p-3 bg-gradient-card border-border text-center">
            <div className="w-6 h-6 bg-destructive/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-destructive text-sm font-bold">✕</span>
            </div>
            <div className="text-lg font-bold text-foreground">{totalQuestions - correctAnswers}</div>
            <div className="text-xs text-muted-foreground">Erradas</div>
          </Card>
          
          <Card className="p-3 bg-gradient-card border-border text-center">
            <div className="w-6 h-6 bg-warning/20 rounded-full flex items-center justify-center mx-auto mb-2">
              <span className="text-warning text-sm">⚡</span>
            </div>
            <div className="text-lg font-bold text-foreground">{performance.stars}</div>
            <div className="text-xs text-muted-foreground">Estrelas</div>
          </Card>
        </div>

        {/* Action Buttons */}
        <div className="space-y-3">
          <Button 
            onClick={() => navigate(`/quiz/${language}`)}
            className="w-full bg-gradient-primary hover:shadow-glow"
          >
            <RotateCcw className="w-4 h-4 mr-2" />
            Tentar Novamente
          </Button>
          
          <Button 
            onClick={() => navigate('/')}
            variant="outline"
            className="w-full"
          >
            <Home className="w-4 h-4 mr-2" />
            Voltar ao Início
          </Button>
        </div>

        {/* Encouragement Message */}
        <Card className="p-4 bg-gradient-card border-border text-center">
          <p className="text-sm text-muted-foreground">
            {percentage >= 70 
              ? "Parabéns! Você demonstra um ótimo domínio dos conceitos!" 
              : "Continue praticando para melhorar suas habilidades de lógica!"}
          </p>
        </Card>
      </div>
    </div>
  );
}