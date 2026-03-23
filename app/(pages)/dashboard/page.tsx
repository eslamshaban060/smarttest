import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";

export default async function DashboardPage() {
  const user = await getCurrentUser();

  if (!user) redirect("/auth/login");
  if (user.role === "ADMIN") redirect("/dashboard/admin");

  redirect("/dashboard/profile");
}
