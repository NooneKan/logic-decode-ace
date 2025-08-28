import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { QuizQuestion } from "@/components/QuizQuestion";
import { GameHeader } from "@/components/GameHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

// Sample questions - in a real app, these would come from an API
const sampleQuestions = {
  java: [
    {
      question: "Qual será a saída do seguinte código Java?",
      code: `public class Test {
    public static void main(String[] args) {
        int x = 5;
        int y = ++x * 2;
        System.out.println(y);
    }
}`,
      options: ["10", "12", "11", "Erro de compilação"],
      correctAnswer: 1
    },
    {
      question: "Qual é a principal diferença entre ArrayList e LinkedList em Java?",
      options: [
        "ArrayList é sincronizada, LinkedList não é",
        "ArrayList permite duplicatas, LinkedList não",
        "ArrayList usa array interno, LinkedList usa nós conectados",
        "Não há diferença significativa"
      ],
      correctAnswer: 2
    }
  ],
  python: [
    {
      question: "O que será impresso pelo seguinte código Python?",
      code: `def func(lst):
    lst.append(4)
    lst = [1, 2, 3]
    lst.append(5)

my_list = [1, 2, 3]
func(my_list)
print(my_list)`,
      options: ["[1, 2, 3]", "[1, 2, 3, 4]", "[1, 2, 3, 5]", "[1, 2, 3, 4, 5]"],
      correctAnswer: 1
    }
  ],
  sql: [
    {
      question: "Qual comando SQL é usado para remover uma tabela completamente?",
      options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"],
      correctAnswer: 2
    }
  ],
  javascript: [
    {
      question: "Qual será o resultado de '5' + 3 em JavaScript?",
      options: ["8", "'53'", "53", "Erro"],
      correctAnswer: 1
    }
  ]
};

export default function Quiz() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);

  const questions = language && language in sampleQuestions 
    ? sampleQuestions[language as keyof typeof sampleQuestions]
    : sampleQuestions.java;

  useEffect(() => {
    if (timeLeft > 0 && !quizComplete) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      handleAnswer(false);
    }
  }, [timeLeft, quizComplete]);

  const handleAnswer = (correct: boolean) => {
    if (correct) {
      setScore(score + 100);
    }

    if (currentQuestion + 1 < questions.length) {
      setTimeout(() => {
        setCurrentQuestion(currentQuestion + 1);
        setTimeLeft(30);
      }, 1000);
    } else {
      setQuizComplete(true);
      setTimeout(() => {
        navigate('/results', { 
          state: { 
            score, 
            totalQuestions: questions.length,
            language: language 
          } 
        });
      }, 2000);
    }
  };

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

  if (quizComplete) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center p-4">
        <Card className="p-8 bg-gradient-card border-border text-center animate-slide-up">
          <CheckCircle className="w-16 h-16 text-success mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-foreground mb-2">Quiz Completo!</h2>
          <p className="text-muted-foreground mb-4">Calculando sua pontuação...</p>
          <div className="animate-pulse">
            <div className="h-2 bg-gradient-primary rounded-full"></div>
          </div>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <GameHeader score={score} />
      
      <div className="p-4">
        {/* Header */}
        <div className="flex items-center gap-3 mb-6">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => navigate(-1)}
            className="w-10 h-10"
          >
            <ArrowLeft className="w-5 h-5" />
          </Button>
          <div>
            <h1 className="text-xl font-bold text-foreground">{getLanguageTitle()}</h1>
            <p className="text-sm text-muted-foreground">
              Questão {currentQuestion + 1} de {questions.length}
            </p>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-muted rounded-full h-2 mb-6">
          <div 
            className="bg-gradient-primary h-2 rounded-full transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>

        {/* Question */}
        <QuizQuestion
          question={questions[currentQuestion].question}
          code={(questions[currentQuestion] as any).code}
          options={questions[currentQuestion].options}
          correctAnswer={questions[currentQuestion].correctAnswer}
          onAnswer={handleAnswer}
          timeLeft={timeLeft}
        />
      </div>
    </div>
  );
}