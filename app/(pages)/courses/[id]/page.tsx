import CourseWatchPage from "@/components/courses/CourseWatchPage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseWatchPage courseId={id} />;
}
