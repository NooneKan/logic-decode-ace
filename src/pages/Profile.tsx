import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Trophy, Target, Calendar } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface Score {
  id: string;
  language: string;
  score: number;
  accuracy: number;
  total_questions: number;
  created_at: string;
}

interface Profile {
  display_name: string;
  main_language: string;
}

const languageNames: Record<string, string> = {
  javascript: "JavaScript",
  python: "Python",
  java: "Java",
  csharp: "C#",
  php: "PHP",
  ruby: "Ruby",
  go: "Go",
  swift: "Swift"
};

export default function Profile() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [scores, setScores] = useState<Score[]>([]);
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!user) {
      navigate("/");
      return;
    }

    fetchData();
  }, [user, navigate]);

  const fetchData = async () => {
    if (!user) return;

    try {

      const { data: profileData } = await supabase
        .from('profiles')
        .select('display_name, main_language')
        .eq('user_id', user.id)
        .single();

      if (profileData) {
        setProfile(profileData);
      }

      // Fetch scores
      const { data: scoresData } = await supabase
        .from('scores')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false });

      if (scoresData) {
        setScores(scoresData);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-main flex items-center justify-center">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-muted-foreground">Carregando perfil...</p>
        </div>
      </div>
    );
  }

  const bestScore = scores.length > 0 ? Math.max(...scores.map(s => s.score)) : 0;
  const totalQuizzes = scores.length;
  const averageAccuracy = scores.length > 0 
    ? scores.reduce((acc, s) => acc + s.accuracy, 0) / scores.length 
    : 0;

  return (
    <div className="min-h-screen bg-gradient-main">
      <div className="container mx-auto px-4 py-6">
        <div className="flex items-center gap-4 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate("/")}
            className="shrink-0"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-foreground">
              Olá, {profile?.display_name || "Desenvolvedor"}!
            </h1>
            <p className="text-muted-foreground">
              Linguagem principal: {languageNames[profile?.main_language || 'javascript']}
            </p>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-success rounded-full mx-auto mb-2">
                <Trophy className="w-6 h-6 text-success-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{bestScore}</div>
              <div className="text-sm text-muted-foreground">Melhor Pontuação</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-primary rounded-full mx-auto mb-2">
                <Target className="w-6 h-6 text-primary-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{averageAccuracy.toFixed(0)}%</div>
              <div className="text-sm text-muted-foreground">Precisão Média</div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-card border-border">
            <CardContent className="p-4 text-center">
              <div className="flex items-center justify-center w-12 h-12 bg-gradient-warning rounded-full mx-auto mb-2">
                <Calendar className="w-6 h-6 text-warning-foreground" />
              </div>
              <div className="text-2xl font-bold text-foreground">{totalQuizzes}</div>
              <div className="text-sm text-muted-foreground">Quizzes Realizados</div>
            </CardContent>
          </Card>
        </div>

        {/* Scores History */}
        <Card className="bg-gradient-card border-border">
          <CardHeader>
            <CardTitle className="text-foreground">Histórico de Pontuações</CardTitle>
            <CardDescription>Seus últimos resultados nos quizzes</CardDescription>
          </CardHeader>
          <CardContent>
            {scores.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">
                  Você ainda não realizou nenhum quiz.
                </p>
                <Button onClick={() => navigate("/")}>
                  Fazer Primeiro Quiz
                </Button>
              </div>
            ) : (
              <div className="space-y-3">
                {scores.map((score) => (
                  <div
                    key={score.id}
                    className="flex items-center justify-between p-4 rounded-lg bg-background/50 border border-border"
                  >
                    <div className="flex items-center gap-3">
                      <Badge variant="outline" className="text-xs">
                        {languageNames[score.language]}
                      </Badge>
                      <div>
                        <div className="font-medium text-foreground">
                          {score.score} pontos
                        </div>
                        <div className="text-sm text-muted-foreground">
                          {score.accuracy.toFixed(0)}% de acerto • {score.total_questions} questões
                        </div>
                      </div>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(score.created_at), "dd/MM/yyyy 'às' HH:mm", {
                        locale: ptBR,
                      })}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}