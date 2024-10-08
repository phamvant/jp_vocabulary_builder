import QuizCard from "../category/[categoryId]/wordset/[wordsetId]/QuizCard";

export default async function Quiz() {
  const url = `/api/saves`;

  return <QuizCard url={url} defName="気に入る" />;
}
