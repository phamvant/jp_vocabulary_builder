// app/SharedStateContext.tsx
"use client";

import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

interface WordSet {
  _id: string;
  name: string;
  words: string[];
}

export interface ICategory {
  wordSet: WordSet[];
  category: string;
}

// Define the shape of your shared state
interface SharedState {
  wordSets: WordSet[];
  setWordSets: (newWordSets: WordSet[]) => void;
}

// Create the context with an initial undefined value
const SharedStateContext = createContext<SharedState | undefined>(undefined);

// Props type for the provider component
interface SharedStateProviderProps {
  children: ReactNode;
  initWordSets: WordSet[];
}

export function SharedStateProvider({
  children,
  initWordSets,
}: SharedStateProviderProps) {
  const [wordSets, setWordSets] = useState<WordSet[]>(initWordSets);

  return (
    <SharedStateContext.Provider value={{ wordSets, setWordSets }}>
      {children}
    </SharedStateContext.Provider>
  );
}

// Custom hook to use the shared state
export function useSharedState(): SharedState {
  const context = useContext(SharedStateContext);
  if (context === undefined) {
    throw new Error("useSharedState must be used within a SharedStateProvider");
  }
  return context;
}
