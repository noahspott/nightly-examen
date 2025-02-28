"use client";

import { createContext, useReducer, useContext } from "react";

type ExamenState = {
  step: number;
  isTyping: boolean;
  blessings: string[];
  failures: string[];
  numSteps: number;
};

type ExamenAction =
  | { type: "INCREMENT_STEP" }
  | { type: "DECREMENT_STEP" }
  | { type: "SET_IS_TYPING"; isTyping: boolean }
  | { type: "SET_BLESSINGS"; blessings: string[] }
  | { type: "SET_FAILURES"; failures: string[] }
  | { type: "SET_NUM_STEPS"; numSteps: number };

function examenReducer(state: ExamenState, action: ExamenAction): ExamenState {
  switch (action.type) {
    case "INCREMENT_STEP":
      return { ...state, step: state.step + 1 };
    case "DECREMENT_STEP":
      return { ...state, step: Math.max(0, state.step - 1) };
    case "SET_IS_TYPING":
      return { ...state, isTyping: action.isTyping };
    case "SET_BLESSINGS":
      return { ...state, blessings: action.blessings };
    case "SET_FAILURES":
      return { ...state, failures: action.failures };
    case "SET_NUM_STEPS":
      return { ...state, numSteps: action.numSteps };
    default:
      return state;
  }
}

const ExamenContext = createContext<
  { state: ExamenState; dispatch: React.Dispatch<ExamenAction> } | undefined
>(undefined);

export function ExamenProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(examenReducer, {
    step: 0,
    isTyping: false,
    blessings: [],
    failures: [],
    numSteps: 7,
  });

  return (
    <ExamenContext.Provider value={{ state, dispatch }}>
      {children}
    </ExamenContext.Provider>
  );
}

export function useExamen() {
  const context = useContext(ExamenContext);
  if (!context) {
    throw new Error("useExamen must be used within an ExamenProvider");
  }
  return context;
}
