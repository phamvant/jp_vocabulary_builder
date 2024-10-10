import QuizCard from "../category/[categoryId]/wordset/[wordsetId]/QuizCard";

export default async function Quiz() {
  const url = `/api/saves`;

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <QuizCard url={url} defName="気に入る" />
    </div>
  );
}
