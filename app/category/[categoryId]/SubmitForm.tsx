"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectTrigger,
  SelectValue,
  SelectContent,
  SelectItem,
} from "@/components/ui/select";
import { PlusCircle, BookOpen } from "lucide-react";
import { useSharedState } from "./ShareState";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function SubmitForm({ categoryId }: { categoryId: string }) {
  const [newSet, setNewSet] = useState("");
  const { wordSets, setWordSets } = useSharedState();
  const { toast } = useToast();

  const onAddSet = async (e: React.FormEvent) => {
    try {
      e.preventDefault();

      const response = await fetch(`/api/categories/${categoryId}/wordset`, {
        method: "POST",
        credentials: "include",
        cache: "no-cache",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          newSetName: newSet,
        }),
      });

      if (!response.ok) {
        let errorMessage: string;
        try {
          const errorBody = await response.json();
          errorMessage =
            errorBody.message || errorBody.error || JSON.stringify(errorBody);
        } catch (e) {
          errorMessage = await response.text();
        }

        throw new Error(
          `HTTP error! status: ${response.status}, message: ${errorMessage}`,
        );
      }

      const data = await response.json();

      setWordSets([
        { _id: data.newSetId, name: newSet, words: [] },
        ...wordSets,
      ]);

      toast({
        title: "Set added successfully",
        description: `New set "${newSet}" has been added.`,
      });

      setNewSet("");
    } catch (err) {
      if (err instanceof Error) {
        toast({
          title: "Error adding set",
          description: err.message,
        });
      } else {
        toast({
          title: "Error adding set",
          description: "An unknown error occurred",
        });
      }
      return;
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
      <form className="mb-4" onSubmit={onAddSet}>
        <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
          <Input
            type="text"
            value={newSet}
            onChange={(e) => setNewSet(e.target.value)}
            placeholder="分類を記入"
            className="flex-grow text-lg py-6 rounded-2xl"
            // disabled={isLoading}
          />
          <Button
            type="submit"
            // disabled={isLoading}
            className="w-full md:w-auto py-6 rounded-2xl"
          >
            <BookOpen className="w-4 h-4 mr-2" />
            分類を追加
          </Button>
        </div>
      </form>
    </div>
  );
}
