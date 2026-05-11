import React, { useState } from 'react';
import { GoogleGenAI, Type } from "@google/genai";
import { Sparkles, X, ChevronRight, Home, Thermometer, Dog, Leaf } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export const CosyQuiz = ({ isOpen, setIsOpen }: { isOpen: boolean, setIsOpen: (open: boolean) => void }) => {
  const [step, setStep] = useState(0);
  const [answers, setAnswers] = useState<string[]>([]);
  const [recommendation, setRecommendation] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const questions = [
    {
      id: 'home-type',
      text: "What describes your UK home best?",
      options: ["Drafty Victorian Terrace", "Modern 90s Estate", "Compact City Flat", "Rural Cottage"],
      icon: <Home className="h-6 w-6" />
    },
    {
      id: 'priority',
      text: "What's your biggest priority this winter?",
      options: ["Lowering energy bills", "Ultimate comfort & hygge", "Eco-friendly living", "A happy, warm pet"],
      icon: <Thermometer className="h-6 w-6" />
    }
  ];

  const handleAnswer = (option: string) => {
    const newAnswers = [...answers, option];
    setAnswers(newAnswers);
    if (step < questions.length - 1) {
      setStep(step + 1);
    } else {
      getRecommendation(newAnswers);
    }
  };

  const getRecommendation = async (userAnswers: string[]) => {
    setLoading(true);
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3-flash-preview",
        contents: `I am a user looking for home products on BritNest. My home is ${userAnswers[0]} and my priority is ${userAnswers[1]}. 
        Give me a short, warm, and professional recommendation for a British home product setup. 
        Format as JSON with keys 'title', 'reason', 'suggested_items' (array).`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              reason: { type: Type.STRING },
              suggested_items: { type: Type.ARRAY, items: { type: Type.STRING } }
            },
            required: ["title", "reason", "suggested_items"]
          }
        }
      });
      setRecommendation(response.text);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const reset = () => {
    setStep(0);
    setAnswers([]);
    setRecommendation(null);
    setIsOpen(false);
  };

  return (
    <>
      <button 
        onClick={() => setIsOpen(true)}
        className="fixed bottom-8 right-8 bg-emerald-600 text-white p-4 rounded-full shadow-2xl hover:bg-emerald-700 transition-all flex items-center gap-2 group z-40"
      >
        <Sparkles className="h-5 w-5 animate-pulse" />
        <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 whitespace-nowrap font-bold text-sm uppercase tracking-widest">
          Build Your Cosy Home
        </span>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-stone-900/60 backdrop-blur-sm"
          >
            <div className="bg-white max-w-lg w-full rounded-2xl shadow-2xl overflow-hidden relative">
              <button 
                onClick={reset}
                className="absolute top-6 right-6 text-stone-400 hover:text-stone-600 transition-colors"
              >
                <X className="h-6 w-6" />
              </button>

              <div className="p-10">
                {!recommendation && !loading && (
                  <div className="space-y-8">
                    <div className="flex items-center gap-4 text-emerald-600">
                      {questions[step].icon}
                      <h3 className="text-2xl font-serif font-bold text-stone-900">
                        {questions[step].text}
                      </h3>
                    </div>
                    <div className="grid gap-3">
                      {questions[step].options.map((option) => (
                        <button
                          key={option}
                          onClick={() => handleAnswer(option)}
                          className="w-full text-left p-4 rounded-xl border-2 border-stone-100 hover:border-emerald-200 hover:bg-emerald-50 transition-all flex justify-between items-center group font-medium text-stone-700"
                        >
                          {option}
                          <ChevronRight className="h-4 w-4 opacity-0 group-hover:opacity-100 transition-all" />
                        </button>
                      ))}
                    </div>
                    <div className="flex gap-2">
                       {questions.map((_, i) => (
                         <div key={i} className={`h-1 flex-1 rounded-full ${i <= step ? 'bg-emerald-600' : 'bg-stone-100'}`} />
                       ))}
                    </div>
                  </div>
                )}

                {loading && (
                  <div className="h-64 flex flex-col items-center justify-center space-y-4">
                    <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600" />
                    <p className="text-stone-500 font-medium animate-pulse">Curating your cosy British setup...</p>
                  </div>
                )}

                {recommendation && (
                  <div className="space-y-6">
                    <div className="bg-emerald-50 p-6 rounded-2xl">
                      <h3 className="text-xl font-serif font-bold text-stone-900 mb-2">
                        {JSON.parse(recommendation).title}
                      </h3>
                      <p className="text-stone-600 text-sm leading-relaxed">
                        {JSON.parse(recommendation).reason}
                      </p>
                    </div>
                    <div>
                      <h4 className="text-[10px] font-bold uppercase tracking-widest text-emerald-700 mb-3">Shop These Essentials</h4>
                      <div className="grid gap-2">
                        {JSON.parse(recommendation).suggested_items.map((item: string) => (
                          <div key={item} className="flex items-center gap-3 p-3 rounded-lg bg-stone-50 border border-stone-100 text-sm font-medium text-stone-700">
                             <Sparkles className="h-4 w-4 text-emerald-500" />
                             {item}
                          </div>
                        ))}
                      </div>
                    </div>
                    <button 
                      onClick={reset}
                      className="w-full bg-emerald-600 text-white py-4 rounded-xl font-bold uppercase tracking-widest hover:bg-emerald-700 transition-all"
                    >
                      Browse Boutique
                    </button>
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
};
