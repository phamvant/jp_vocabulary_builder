"use client";

import AuthButtons from "@/components/AuthButton";
import Form from "@/components/Form";
import { Button } from "@/components/ui/button";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

export default function JapaneseVocabSaaS() {
  const { data: session } = useSession();
  const [categories, setCategories] = useState<any>();

  useEffect(() => {
    const fetchWords = async () => {
      try {
        const response = await fetch(`/api/categories`, {
          cache: "no-cache",
          method: "GET",
          credentials: "include",
        });

        if (!response.ok) throw new Error("Failed to fetch words");

        const data = await response.json();

        setCategories(data);
      } catch (error) {}
    };
    fetchWords();
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-b">
      <div className="container mx-auto p-4 xl:px-60">
        <div className="flex flex-col gap-4">
          <AuthButtons />
          {session ? (
            <a href="/saved">
              <Button className="bg-pink-400/80 hover:bg-pink-400">
                気に入る
              </Button>
            </a>
          ) : null}
        </div>
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h1>
          <p className="text-xl text-gray-600 dark:text-gray-300"></p>
        </header>
        <Form inCategories={categories} />
      </div>
    </div>
  );
}
