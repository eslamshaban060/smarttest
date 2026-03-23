import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export default async function AdminPage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role !== "ADMIN") redirect("/dashboard/profile");

  return <AdminDashboard currentUserId={user.id} />;
}
