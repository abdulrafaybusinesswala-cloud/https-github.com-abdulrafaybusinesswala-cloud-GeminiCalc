import React from 'react';
import { HistoryItem } from '../types';
import { Trash2, Clock } from 'lucide-react';

interface HistoryProps {
  history: HistoryItem[];
  onClearHistory: () => void;
  onSelectHistory: (item: HistoryItem) => void;
}

export const History: React.FC<HistoryProps> = ({ history, onClearHistory, onSelectHistory }) => {
  return (
    <div className="bg-calc-btn/20 rounded-3xl p-4 h-full flex flex-col border border-white/5">
      <div className="flex justify-between items-center mb-4 pb-2 border-b border-white/10">
        <div className="flex items-center gap-2 text-calc-secondaryText">
          <Clock size={18} />
          <span className="font-medium text-sm uppercase tracking-wider">History</span>
        </div>
        {history.length > 0 && (
          <button 
            onClick={onClearHistory}
            className="text-red-400 hover:text-red-300 transition-colors p-2 rounded-lg hover:bg-white/5"
            aria-label="Clear History"
          >
            <Trash2 size={18} />
          </button>
        )}
      </div>

      <div className="flex-1 overflow-y-auto pr-2 no-scrollbar space-y-3">
        {history.length === 0 ? (
          <div className="text-center text-calc-secondaryText/50 mt-10 text-sm italic">
            No calculations yet.
          </div>
        ) : (
          history.map((item) => (
            <button
              key={item.id}
              onClick={() => onSelectHistory(item)}
              className="w-full text-right p-3 rounded-xl hover:bg-white/5 transition-all group border border-transparent hover:border-white/10 flex flex-col items-end"
            >
              <div className="text-calc-secondaryText text-sm mb-1 group-hover:text-calc-text transition-colors">
                {item.expression}
              </div>
              <div className="text-calc-accent text-xl font-medium">
                = {item.result}
              </div>
            </button>
          ))
        )}
      </div>
    </div>
  );
};