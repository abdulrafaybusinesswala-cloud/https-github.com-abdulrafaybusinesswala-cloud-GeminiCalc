import React, { useState } from 'react';
import { solveMathProblem } from '../services/geminiService';
import { Send, Loader2, Sparkles } from 'lucide-react';

export const AIAssistant: React.FC = () => {
  const [input, setInput] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    setLoading(true);
    const result = await solveMathProblem(input);
    setResponse(result);
    setLoading(false);
  };

  return (
    <div className="h-full flex flex-col bg-calc-btn/20 rounded-3xl p-4 sm:p-6 border border-white/5">
      <div className="flex items-center gap-2 mb-6 text-calc-accent">
        <Sparkles size={24} />
        <h2 className="text-xl font-bold">Smart Math Assistant</h2>
      </div>

      <div className="flex-1 overflow-y-auto mb-4 bg-black/20 rounded-xl p-4 border border-white/5">
        {response ? (
          <div className="prose prose-invert prose-p:text-calc-text prose-headings:text-calc-accent max-w-none">
            {/* Simple rendering of markdown-like text */}
            {response.split('\n').map((line, i) => (
              <p key={i} className={line.startsWith('Final Answer:') ? 'text-xl font-bold text-green-400 mt-4' : 'mb-2'}>
                {line}
              </p>
            ))}
          </div>
        ) : (
          <div className="h-full flex flex-col items-center justify-center text-calc-secondaryText opacity-50 text-center p-4">
            <p className="mb-2">Ask complex math questions or word problems.</p>
            <p className="text-sm">Example: "What is the square root of 5 plus 10 percent of 50?"</p>
          </div>
        )}
      </div>

      <form onSubmit={handleSubmit} className="relative">
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Type a math problem..."
          className="w-full bg-calc-display text-white rounded-xl py-4 pl-4 pr-12 focus:outline-none focus:ring-2 focus:ring-calc-accent border border-white/10 placeholder:text-gray-600"
        />
        <button
          type="submit"
          disabled={loading || !input.trim()}
          className="absolute right-2 top-2 p-2 bg-calc-accent hover:bg-calc-accentHover text-white rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? <Loader2 size={20} className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};