import { getCurrentUser } from "@/lib/auth";
import { redirect } from "next/navigation";
import { ProfileClient } from "@/components/profile/ProfileClient";

export default async function ProfilePage() {
  const user = await getCurrentUser();
  if (!user) redirect("/auth/login");
  if (user.role === "ADMIN") redirect("/dashboard/admin");

  return <ProfileClient />;
}
