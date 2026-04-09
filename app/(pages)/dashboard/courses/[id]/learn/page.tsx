import CourseLearnPage from "@/components/courses/Courselearnpage";

export default async function Page({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  return <CourseLearnPage courseId={id} />;
}
