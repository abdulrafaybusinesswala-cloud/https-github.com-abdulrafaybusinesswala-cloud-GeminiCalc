import React, { useEffect, useRef } from 'react';
import { formatOperand } from '../utils/formatter';

interface DisplayProps {
  previousOperand: string | null;
  currentOperand: string | null;
  operation: string | null;
}

export const Display: React.FC<DisplayProps> = ({ previousOperand, currentOperand, operation }) => {
    const scrollRef = useRef<HTMLDivElement>(null);

    // Auto-scroll to end when number changes
    useEffect(() => {
        if (scrollRef.current) {
            scrollRef.current.scrollLeft = scrollRef.current.scrollWidth;
        }
    }, [currentOperand, previousOperand, operation]);

  return (
    <div className="w-full bg-calc-display p-6 flex flex-col items-end justify-end break-all rounded-3xl shadow-inner min-h-[160px] sm:min-h-[200px] mb-4">
      <div className="text-calc-secondaryText text-lg sm:text-xl font-mono opacity-80 h-8">
        {formatOperand(previousOperand)} {operation}
      </div>
      <div 
        ref={scrollRef}
        className="text-calc-text text-5xl sm:text-7xl font-light w-full text-right overflow-x-auto no-scrollbar whitespace-nowrap"
      >
        {formatOperand(currentOperand) || "0"}
      </div>
    </div>
  );
};