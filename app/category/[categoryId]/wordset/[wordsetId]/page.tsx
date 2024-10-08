import QuizCard from "./QuizCard";


export default async function Quiz({
  params,
}: {
  params: { categoryId: string; wordsetId: string };
}) {

  return (
      <QuizCard categoryId={params.categoryId} wordsetId={params.wordsetId} showSave={true} />
  );
}
