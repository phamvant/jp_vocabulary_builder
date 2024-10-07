import { headers } from "next/headers";
import QuizCard from "./QuizCard";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export default async function Quiz({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `${process.env.BASEURL}/api/categories/${params.categoryId}/wordset/${params.wordsetId}`,
        {
          method: "GET",
          cache: "no-cache",
          headers: new Headers(headers()),
        }
      );

      if (!response.ok) throw new Error("Failed to fetch words");

      const data = await response.json();

      return data;
    } catch (error) {
      return false;
    }
  };

  const words = await fetchWords();

  return (
      <QuizCard words={words.words} name={words.name} showSave={true} />
  );
}
