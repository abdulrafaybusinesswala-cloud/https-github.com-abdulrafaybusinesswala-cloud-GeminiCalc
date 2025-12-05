import React, { useReducer, useState, useCallback, useEffect } from 'react';
import { CalculatorActionType, CalculatorState, HistoryItem, Tab } from './types';
import { Button } from './components/Button';
import { Display } from './components/Display';
import { History } from './components/History';
import { AIAssistant } from './components/AIAssistant';
import { Calculator, Bot, Delete } from 'lucide-react';

const INITIAL_STATE: CalculatorState = {
  currentOperand: null,
  previousOperand: null,
  operation: null,
  overwrite: false,
};

function reducer(state: CalculatorState, action: { type: CalculatorActionType; payload?: any }): CalculatorState {
  switch (action.type) {
    case CalculatorActionType.ADD_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          currentOperand: action.payload.digit,
          overwrite: false,
        };
      }
      if (action.payload.digit === "0" && state.currentOperand === "0") {
        return state;
      }
      if (action.payload.digit === "." && state.currentOperand?.includes(".")) {
        return state;
      }
      return {
        ...state,
        currentOperand: `${state.currentOperand || ""}${action.payload.digit}`,
      };

    case CalculatorActionType.CHOOSE_OPERATION:
      if (state.currentOperand == null && state.previousOperand == null) {
        return state;
      }
      if (state.currentOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
        };
      }
      if (state.previousOperand == null) {
        return {
          ...state,
          operation: action.payload.operation,
          previousOperand: state.currentOperand,
          currentOperand: null,
        };
      }
      return {
        ...state,
        previousOperand: evaluate(state),
        operation: action.payload.operation,
        currentOperand: null,
      };

    case CalculatorActionType.CLEAR:
      return INITIAL_STATE;

    case CalculatorActionType.DELETE_DIGIT:
      if (state.overwrite) {
        return {
          ...state,
          overwrite: false,
          currentOperand: null,
        };
      }
      if (state.currentOperand == null) return state;
      if (state.currentOperand.length === 1) {
        return { ...state, currentOperand: null };
      }
      return {
        ...state,
        currentOperand: state.currentOperand.slice(0, -1),
      };

    case CalculatorActionType.EVALUATE:
      if (
        state.operation == null ||
        state.currentOperand == null ||
        state.previousOperand == null
      ) {
        return state;
      }
      return {
        ...state,
        overwrite: true,
        previousOperand: null,
        operation: null,
        currentOperand: evaluate(state),
      };

    case CalculatorActionType.TOGGLE_SIGN:
        if (state.currentOperand == null) return state;
        return {
            ...state,
            currentOperand: (parseFloat(state.currentOperand) * -1).toString()
        }
    
    case CalculatorActionType.PERCENTAGE:
        if (state.currentOperand == null) return state;
        return {
            ...state,
            currentOperand: (parseFloat(state.currentOperand) / 100).toString()
        }

    default:
        return state;
  }
}

function evaluate({ currentOperand, previousOperand, operation }: CalculatorState): string {
  const prev = parseFloat(previousOperand || "");
  const current = parseFloat(currentOperand || "");
  if (isNaN(prev) || isNaN(current)) return "";
  let computation = 0;
  switch (operation) {
    case "+":
      computation = prev + current;
      break;
    case "-":
      computation = prev - current;
      break;
    case "*":
      computation = prev * current;
      break;
    case "÷":
      computation = prev / current;
      break;
  }
  return computation.toString();
}

const App: React.FC = () => {
  const [state, dispatch] = useReducer(reducer, INITIAL_STATE);
  const [activeTab, setActiveTab] = useState<Tab>(Tab.CALCULATOR);
  const [history, setHistory] = useState<HistoryItem[]>([]);

  // Add keyboard support
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
        if(activeTab !== Tab.CALCULATOR) return;
        
        if (e.key >= '0' && e.key <= '9') {
            dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: e.key }});
        } else if (e.key === '.') {
            dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: '.' }});
        } else if (e.key === '=' || e.key === 'Enter') {
            e.preventDefault();
            handleEvaluate();
        } else if (e.key === 'Backspace') {
            dispatch({ type: CalculatorActionType.DELETE_DIGIT });
        } else if (e.key === 'Escape') {
            dispatch({ type: CalculatorActionType.CLEAR });
        } else if (e.key === '+' || e.key === '-' || e.key === '*') {
            dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: e.key }});
        } else if (e.key === '/') {
            e.preventDefault();
            dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: '÷' }});
        }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [state, activeTab]);

  const handleEvaluate = () => {
      if(state.currentOperand && state.previousOperand && state.operation) {
          const result = evaluate(state);
          const expression = `${state.previousOperand} ${state.operation} ${state.currentOperand}`;
          
          setHistory(prev => [{
              id: Date.now().toString(),
              expression,
              result,
              timestamp: Date.now()
          }, ...prev].slice(0, 50)); // Keep last 50
          
          dispatch({ type: CalculatorActionType.EVALUATE });
      }
  };

  const handleHistorySelect = (item: HistoryItem) => {
      // Load result into current operand
      dispatch({ type: CalculatorActionType.CLEAR });
      dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: item.result }});
  };

  return (
    <div className="h-full w-full flex flex-col items-center justify-center p-4 sm:p-6 lg:p-10 relative overflow-hidden bg-gradient-to-br from-slate-900 to-slate-800">
        
        {/* Background decorative blobs */}
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-600/10 rounded-full blur-[100px] pointer-events-none" />
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-amber-600/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="w-full max-w-6xl h-full grid grid-cols-1 lg:grid-cols-12 gap-6 z-10">
        
        {/* Main Calculator Area */}
        <div className="lg:col-span-8 flex flex-col h-full max-h-[900px]">
          
          {/* Tabs */}
          <div className="flex bg-calc-btn/30 rounded-2xl p-1 mb-4 w-full sm:w-fit self-center lg:self-start backdrop-blur-sm">
            <button
              onClick={() => setActiveTab(Tab.CALCULATOR)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                activeTab === Tab.CALCULATOR 
                  ? 'bg-calc-accent text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Calculator size={18} />
              <span>Calculator</span>
            </button>
            <button
              onClick={() => setActiveTab(Tab.AI_ASSISTANT)}
              className={`flex items-center gap-2 px-6 py-3 rounded-xl transition-all font-medium ${
                activeTab === Tab.AI_ASSISTANT 
                  ? 'bg-blue-600 text-white shadow-lg' 
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              <Bot size={18} />
              <span>AI Assistant</span>
            </button>
          </div>

          {activeTab === Tab.CALCULATOR ? (
            <div className="flex-1 flex flex-col max-w-lg mx-auto w-full">
              <Display 
                previousOperand={state.previousOperand} 
                currentOperand={state.currentOperand} 
                operation={state.operation} 
              />
              
              <div className="grid grid-cols-4 gap-3 sm:gap-4 flex-1">
                <Button label="AC" variant="function" onClick={() => dispatch({ type: CalculatorActionType.CLEAR })} />
                <Button label="+/-" variant="function" onClick={() => dispatch({ type: CalculatorActionType.TOGGLE_SIGN })} />
                <Button label="%" variant="function" onClick={() => dispatch({ type: CalculatorActionType.PERCENTAGE })} />
                <Button label="÷" variant="accent" onClick={() => dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: "÷" } })} />
                
                <Button label="7" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "7" } })} />
                <Button label="8" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "8" } })} />
                <Button label="9" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "9" } })} />
                <Button label="×" variant="accent" onClick={() => dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: "*" } })} />
                
                <Button label="4" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "4" } })} />
                <Button label="5" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "5" } })} />
                <Button label="6" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "6" } })} />
                <Button label="-" variant="accent" onClick={() => dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: "-" } })} />
                
                <Button label="1" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "1" } })} />
                <Button label="2" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "2" } })} />
                <Button label="3" onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "3" } })} />
                <Button label="+" variant="accent" onClick={() => dispatch({ type: CalculatorActionType.CHOOSE_OPERATION, payload: { operation: "+" } })} />
                
                <Button label="0" doubleWidth onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "0" } })} />
                <Button label="." onClick={() => dispatch({ type: CalculatorActionType.ADD_DIGIT, payload: { digit: "." } })} />
                <Button label="=" variant="accent" onClick={handleEvaluate} />
              </div>

               {/* Mobile History Toggle hint (only visible if history is hidden in mobile view if we implemented drawer, but here we just stack on desktop) */}
            </div>
          ) : (
             <div className="flex-1 w-full max-w-2xl mx-auto h-full min-h-[500px]">
                <AIAssistant />
             </div>
          )}
        </div>

        {/* History Sidebar - Hidden on mobile, visible on lg screens */}
        <div className="hidden lg:block lg:col-span-4 h-full max-h-[800px]">
            <History 
                history={history} 
                onClearHistory={() => setHistory([])}
                onSelectHistory={handleHistorySelect}
            />
        </div>

        {/* Mobile History Section (Below calculator on small screens) */}
        <div className="lg:hidden w-full max-w-lg mx-auto mt-6 h-64 block">
            <History 
                history={history} 
                onClearHistory={() => setHistory([])}
                onSelectHistory={handleHistorySelect}
            />
        </div>

      </div>
    </div>
  );
};

export default App;