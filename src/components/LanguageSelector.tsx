import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FormControl, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Check } from "lucide-react";

const languages = [
  { value: "javascript", label: "JavaScript", color: "bg-yellow-500", emoji: "🔶" },
  { value: "python", label: "Python", color: "bg-blue-500", emoji: "🐍" },
  { value: "java", label: "Java", color: "bg-red-500", emoji: "☕" },
  { value: "csharp", label: "C#", color: "bg-purple-500", emoji: "#️⃣" },
  { value: "php", label: "PHP", color: "bg-indigo-500", emoji: "🐘" },
  { value: "ruby", label: "Ruby", color: "bg-red-600", emoji: "💎" },
  { value: "go", label: "Go", color: "bg-cyan-500", emoji: "🔵" },
  { value: "swift", label: "Swift", color: "bg-orange-500", emoji: "🦉" }
];

interface LanguageSelectorProps {
  value: string;
  onChange: (value: string) => void;
}

export function LanguageSelector({ value, onChange }: LanguageSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <FormItem>
      <FormLabel>Escolha sua linguagem principal</FormLabel>
      <FormControl>
        <div className="space-y-2">
          <Button
            type="button"
            variant="outline"
            onClick={() => setIsOpen(!isOpen)}
            className="w-full justify-between h-12 text-left"
          >
            <div className="flex items-center gap-3">
              {value && (
                <>
                  <span className="text-xl">
                    {languages.find(l => l.value === value)?.emoji}
                  </span>
                  <span>{languages.find(l => l.value === value)?.label}</span>
                </>
              )}
              {!value && <span className="text-muted-foreground">Selecione uma linguagem</span>}
            </div>
          </Button>
          
          <AnimatePresence>
            {isOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="grid grid-cols-2 gap-2 overflow-hidden"
              >
                {languages.map((lang, index) => (
                  <motion.div
                    key={lang.value}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ 
                      duration: 0.3, 
                      delay: index * 0.05,
                      ease: "easeOut" 
                    }}
                  >
                    <Button
                      type="button"
                      variant={value === lang.value ? "default" : "outline"}
                      onClick={() => {
                        onChange(lang.value);
                        setIsOpen(false);
                      }}
                      className="w-full h-16 flex flex-col items-center justify-center gap-1 relative overflow-hidden group hover:scale-105 transition-transform"
                    >
                      <motion.div
                        whileHover={{ scale: 1.2, rotate: 5 }}
                        transition={{ type: "spring", stiffness: 300 }}
                        className="text-2xl"
                      >
                        {lang.emoji}
                      </motion.div>
                      <span className="text-xs font-medium">{lang.label}</span>
                      
                      {value === lang.value && (
                        <motion.div
                          initial={{ scale: 0 }}
                          animate={{ scale: 1 }}
                          className="absolute top-1 right-1 w-5 h-5 bg-primary rounded-full flex items-center justify-center"
                        >
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </motion.div>
                      )}
                      
                      <motion.div
                        className={`absolute inset-0 ${lang.color} opacity-0 group-hover:opacity-10 transition-opacity`}
                        whileHover={{ opacity: 0.1 }}
                      />
                    </Button>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
}