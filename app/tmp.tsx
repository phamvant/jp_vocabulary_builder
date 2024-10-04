"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { PlusCircle, Trash2, BookOpen, RefreshCw } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import AuthButtons from "@/components/AuthButton";
import { useSession } from "next-auth/react";
import { useToast } from "@/hooks/use-toast";

export default function JapaneseVocabSaaS() {
  const { data: session } = useSession();
  const { toast } = useToast();

  const [words, setWords] = useState<{ [key: string]: string[] }>({});
  const [listName, setListName] = useState<string[]>([]);
  const [newWord, setNewWord] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [newCategory, setNewCategory] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    setListName(Object.keys(words));
  }, []);

  useEffect(() => {
    fetchWords();
  }, []);

  const fetchWords = async () => {
    try {
      const response = await fetch("/api/words");
      if (!response.ok) throw new Error("Failed to fetch words");
      const data = await response.json();
      const wordsObject = data.reduce((acc: any, item: any) => {
        acc[item.category + ":" + item._id] = item.words;
        return acc;
      }, {});
      console.log(wordsObject);
      setWords(wordsObject);
    } catch (error) {
      console.error("Error fetching words:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newWord && selectedCategory) {
      // Update state directly instead of fetching
      setWords((prevWords) => ({
        ...prevWords,
        [selectedCategory]: [...(prevWords[selectedCategory] || []), newWord],
      }));
      try {
        const response = await fetch("/api/words", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            word: newWord,
            category: selectedCategory.split(":")[0],
          }),
        });
        if (!response.ok) throw new Error("Failed to save word");

        setNewWord("");
      } catch (error) {
        toast({
          title: "Error add category",
          description: "Can't add public category",
        });
      } finally {
      }
    } else {
      toast({
        title: "Error",
        description: "Fill up form",
      });
    }
  };

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
      });
      return;
    }
    if (newCategory && !listName.includes(newCategory)) {
      try {
        const response = await fetch("/api/categories", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ category: newCategory }),
        });

        if (!response.ok) throw new Error("Failed to add category");

        const data = await response.json();
        const newCategoryId = newCategory + ":" + data.categoryId;
        setWords((prevWords) => ({
          [newCategoryId]: [], // Add the new category first
          ...prevWords, // Spread the previous categories after the new one
        }));
      } catch (error) {
      } finally {
        setNewCategory("");
      }
    }
  };

  const handleDeleteWord = async (word: string, category: string) => {
    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
      });
      return;
    }
    setWords((prevWords) => ({
      ...prevWords,
      [category]: prevWords[category].filter((w) => w !== word),
    }));

    try {
      const response = await fetch(
        `/api/categories?word=${encodeURIComponent(
          word,
        )}&category=${encodeURIComponent(category.split(":")[1])}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete word");
    } catch (error) {
      console.error("Error deleting word:", error);
    } finally {
    }
  };

  const handleDeleteCategory = async (category: string) => {
    if (!session) {
      toast({
        title: "Unauthenticated",
        description: "Please login",
      });
      return;
    }
    setWords((prevWords) => {
      const newWords = { ...prevWords };
      delete newWords[category];
      return newWords;
    });
    try {
      const response = await fetch(
        `/api/categories?category=${encodeURIComponent(category.split(":")[1])}`,
        {
          method: "DELETE",
        },
      );
      if (!response.ok) throw new Error("Failed to delete category");
    } catch (error) {
      console.error("Error deleting category:", error);
    } finally {
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 lg:px-60">
        <AuthButtons />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h1>
          <p className="text-xl text-gray-600 dark:text-gray-300"></p>
        </header>

        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg p-6 mb-8">
          <form onSubmit={handleSubmit} className="mb-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Input
                type="text"
                value={newWord}
                onChange={(e) => setNewWord(e.target.value)}
                placeholder="単語を記入"
                className="flex-grow text-lg py-6 rounded-2xl"
                // disabled={isLoading}
              />
              <Select
                value={selectedCategory}
                onValueChange={setSelectedCategory}

                // disabled={isLoading}
              >
                <SelectTrigger className="w-full md:w-[180px] text-lg py-6 rounded-2xl">
                  <SelectValue placeholder="分類" />
                </SelectTrigger>
                <SelectContent>
                  {Object.keys(words).map((category) => (
                    <SelectItem key={category} value={category}>
                      {category.split(":")[0]}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button
                type="submit"
                // disabled={isLoading}
                className="w-full md:w-auto py-6 rounded-2xl"
              >
                <PlusCircle className="w-4 h-4 mr-2" />
                単語を追加
              </Button>
            </div>
          </form>

          <form onSubmit={handleAddCategory} className="mb-4">
            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
              <Input
                type="text"
                value={newCategory}
                onChange={(e) => setNewCategory(e.target.value)}
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
        {isLoading ? (
          <div className="flex justify-center">
            <RefreshCw className="animate-spin" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 rounded-2xl">
            {Object.entries(words).map(([category, wordList]) => (
              <Card
                key={category.split(":")[1]}
                className="bg-white dark:bg-gray-800 shadow-lg hover:shadow-xl transition-shadow duration-300"
              >
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gray-50 dark:bg-gray-700 rounded-t-lg rounded-t-2xl">
                  <a href={`/${category.split(":")[1]}`}>
                    <CardTitle className="text-xl font-bold">
                      {category.split(":")[0]}
                    </CardTitle>
                  </a>
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader>
                        <AlertDialogTitle>
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                          This will permanently delete the "{category}" category
                          and all its words.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction
                          onClick={() => handleDeleteCategory(category)}
                          className="bg-red-500 text-white hover:bg-red-700"
                        >
                          Delete
                        </AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </CardHeader>

                <CardContent className="pt-4">
                  {wordList && wordList.length > 0 ? (
                    <ul className="space-y-2">
                      {wordList.slice(0, 3).map((word, index) => (
                        <li
                          key={index}
                          className="flex items-center justify-between bg-gray-50 dark:bg-gray-700 p-2 rounded-2xl pl-4"
                        >
                          <span className="text-lg">{word}</span>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="text-red-500 hover:text-red-700 dark:text-red-400 dark:hover:text-red-300"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>
                                  Are you sure?
                                </AlertDialogTitle>
                                <AlertDialogDescription>
                                  This will permanently delete the word "{word}"
                                  from the "{category}" category.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction
                                  onClick={() =>
                                    handleDeleteWord(word, category)
                                  }
                                  className="bg-red-500 text-white hover:bg-red-700"
                                >
                                  Delete
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="text-gray-500 dark:text-gray-400 text-center italic">
                      No words added yet.
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}