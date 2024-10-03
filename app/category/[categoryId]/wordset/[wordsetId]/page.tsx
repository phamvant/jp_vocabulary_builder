import QuizCard from "./QuizCard";

export default async function Quiz({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {
  const fetchWords = async () => {
    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/categories/${params.categoryId}/wordset/${params.wordsetId}`,
        {
          method: "GET",
          cache: "no-cache",
        },
      );

      if (!response.ok) throw new Error("Failed to fetch words");

      const data = await response.json();

      return data;
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  const words = await fetchWords();

  return <QuizCard words={words} />;
}
