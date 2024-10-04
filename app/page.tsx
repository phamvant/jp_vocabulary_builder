import AuthButtons from "@/components/AuthButton";
import Form from "./Form";
import { headers } from "next/headers";

export default async function JapaneseVocabSaaS() {
  const fetchWords = async () => {
    try {
      const response = await fetch(`${process.env.BASEURL}/api/categories`, {
        cache: "no-cache",
        headers: new Headers(headers()),
      });
      if (!response.ok) throw new Error("Failed to fetch words");
      const data = await response.json();
      console.log(data);
      return data;
    } catch (error) {
      console.error("Error fetching words:", error);
      return [""];
    }
  };

  const categories = await fetchWords();

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-100 to-gray-200 dark:from-gray-900 dark:to-gray-800">
      <div className="container mx-auto p-4 lg:px-60">
        <AuthButtons />
        <header className="mb-8 text-center">
          <h1 className="text-4xl font-bold text-gray-800 dark:text-gray-100 mb-2"></h1>
          <p className="text-xl text-gray-600 dark:text-gray-300"></p>
        </header>
        <Form inCategories={categories} />
      </div>
    </div>
  );
}
