import QuizCard from "./QuizCard";

export default async function Quiz({ params }: { params: { id: string } }) {
  const fetchWords = async ({ id }: { id: string }) => {
    try {
      const response = await fetch(
        `${process.env.BASE_URL}/api/categories/${id}`,
        {
          cache: "no-cache",
          method: "GET",
        },
      );

      if (!response.ok) throw new Error("Failed to fetch words");
      const data = (await response.json()).result;
      return data;
    } catch (error) {
      console.error("Error fetching words:", error);
      return false;
    }
  };

  const words = await fetchWords({ id: params.id });

  return <QuizCard words={words} />;
}
