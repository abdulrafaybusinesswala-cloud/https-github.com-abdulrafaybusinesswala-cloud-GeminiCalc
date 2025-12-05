export enum CalculatorActionType {
  ADD_DIGIT = 'ADD_DIGIT',
  CHOOSE_OPERATION = 'CHOOSE_OPERATION',
  CLEAR = 'CLEAR',
  DELETE_DIGIT = 'DELETE_DIGIT',
  EVALUATE = 'EVALUATE',
  PERCENTAGE = 'PERCENTAGE',
  TOGGLE_SIGN = 'TOGGLE_SIGN'
}

export interface CalculatorState {
  previousOperand: string | null;
  currentOperand: string | null;
  operation: string | null;
  overwrite: boolean;
}

export interface HistoryItem {
  id: string;
  expression: string;
  result: string;
  timestamp: number;
}

export enum Tab {
  CALCULATOR = 'CALCULATOR',
  AI_ASSISTANT = 'AI_ASSISTANT'
}