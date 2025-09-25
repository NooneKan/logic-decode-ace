import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate, useSearchParams } from "react-router-dom";
import { QuizQuestion } from "@/components/QuizQuestion";
import { GameHeader } from "@/components/GameHeader";
import { Button } from "@/components/ui/button";
import { ArrowLeft, CheckCircle } from "lucide-react";
import { Card } from "@/components/ui/card";

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
    },
    {
      question: "O que acontece quando você declara uma variável como 'final' em Java?",
      options: [
        "A variável pode ser modificada apenas uma vez",
        "A variável não pode ser reatribuída após inicialização",
        "A variável se torna estática automaticamente",
        "A variável só pode ser usada dentro do método"
      ],
      correctAnswer: 1
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
    },
    {
      question: "Qual é a diferença entre '==' e 'is' em Python?",
      options: [
        "Não há diferença, são sinônimos",
        "'==' compara valores, 'is' compara identidade de objeto",
        "'is' é mais rápido que '=='",
        "'==' só funciona com strings"
      ],
      correctAnswer: 1
    }
  ],
  sql: [
    {
      question: "Qual comando SQL é usado para remover uma tabela completamente?",
      options: ["DELETE TABLE", "REMOVE TABLE", "DROP TABLE", "CLEAR TABLE"],
      correctAnswer: 2
    },
    {
      question: "Qual a diferença entre INNER JOIN e LEFT JOIN?",
      options: [
        "INNER JOIN retorna apenas registros com correspondência em ambas tabelas",
        "LEFT JOIN é mais rápido que INNER JOIN",
        "Não há diferença prática",
        "INNER JOIN só funciona com chaves primárias"
      ],
      correctAnswer: 0
    }
  ],
  javascript: [
    {
      question: "Qual será o resultado de '5' + 3 em JavaScript?",
      options: ["8", "'53'", "53", "Erro"],
      correctAnswer: 1
    },
    {
      question: "O que é 'hoisting' em JavaScript?",
      options: [
        "Um método para otimizar o código",
        "Declarações são movidas para o topo do escopo",
        "Uma forma de criar arrays",
        "Um tipo de loop"
      ],
      correctAnswer: 1
    }
  ]
};

const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
};

export default function Quiz() {
  const { language } = useParams<{ language: string }>();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30);
  const [quizComplete, setQuizComplete] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState<any[]>([]);
  const [questionLocked, setQuestionLocked] = useState(false);

  useEffect(() => {
    let baseQuestions: any[] = [];
    if (language === 'random') {
      baseQuestions = Object.values(sampleQuestions).flat() as any[];
    } else if (language && language in sampleQuestions) {
      baseQuestions = sampleQuestions[language as keyof typeof sampleQuestions] as any[];
    } else {
      baseQuestions = sampleQuestions.java as any[];
    }

    const newQuestions = shuffleArray([...baseQuestions]);
    setShuffledQuestions(newQuestions);

    // Resetar estado ao iniciar um novo conjunto de questões
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(30);
    setQuizComplete(false);
    setQuestionLocked(false);
  }, [language, searchParams.get('ts')]);

  const questions = shuffledQuestions;

  const handleAnswer = useCallback((correct: boolean) => {
    if (questionLocked || quizComplete || questions.length === 0) return;

    setQuestionLocked(true);

    setScore(prevScore => {
      const newScore = correct ? prevScore + 100 : prevScore;
      
      if (currentQuestion + 1 < questions.length) {
        setTimeout(() => {
          setCurrentQuestion(prev => prev + 1);
          setTimeLeft(30);
          setQuestionLocked(false);
        }, 1000);
      } else {
        setQuizComplete(true);
        setTimeout(() => {
          navigate('/results', { 
            state: { 
              score: newScore, 
              totalQuestions: questions.length,
              language: language 
            } 
          });
        }, 2000);
      }
      
      return newScore;
    });
  }, [currentQuestion, questions.length, language, navigate, questionLocked, quizComplete]);

  useEffect(() => {
    if (timeLeft > 0 && !quizComplete && questions.length > 0 && !questionLocked) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && questions.length > 0 && !questionLocked) {
      handleAnswer(false);
    }
  }, [timeLeft, quizComplete, questions.length, handleAnswer, questionLocked]);

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
        {questions.length > 0 && (
          <QuizQuestion
            question={questions[currentQuestion]?.question}
            code={(questions[currentQuestion] as any)?.code}
            options={questions[currentQuestion]?.options}
            correctAnswer={questions[currentQuestion]?.correctAnswer}
            onAnswer={handleAnswer}
            timeLeft={timeLeft}
          />
        )}
      </div>
    </div>
  );
}