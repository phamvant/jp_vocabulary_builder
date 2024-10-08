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
  categoryId: string;
}

export function SharedStateProvider({
  children,
  categoryId,
}: SharedStateProviderProps) {
  const [wordSets, setWordSets] = useState<WordSet[]>([
    { _id: "", name: "", words: [""] },
  ]);

  useEffect(() => {
    const fetchWordSets = async () => {
      try {
        const response = await fetch(`/api/categories/${categoryId}/wordset`, {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) {
          throw new Error("Failed to fetch word sets");
        }

        const data = (await response.json()) as ICategory;
        console.log(data);
        setWordSets(data.wordSet); // Store word sets in state
      } catch (err) {
        console.error("Error fetching word sets:", err);
      }
    };

    fetchWordSets();
  }, [categoryId]);

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
