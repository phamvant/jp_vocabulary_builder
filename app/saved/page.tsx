import { headers } from "next/headers";
import QuizCard from "../category/[categoryId]/wordset/[wordsetId]/QuizCard";
import { redirect } from "next/navigation";

export default async function Quiz() {
  const fetchWords = async () => {
    try {
      const response = await fetch(`${process.env.BASEURL}/api/saves`, {
        method: "GET",
        cache: "no-cache",
        headers: new Headers(headers()),
      });

      if (!response.ok) throw new Error("Failed to fetch words");

      const data = await response.json();

      if (!data.length) {
        throw new Error();
      }

      return data;
    } catch (error) {
      redirect("/");
    }
  };

  const words = await fetchWords();

  return <QuizCard words={words} name={"気に入る"} />;
}
