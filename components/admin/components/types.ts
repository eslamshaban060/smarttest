// ─── Shared Types ─────────────────────────────────────────────────────────────

export interface StatsData {
  totalUsers: number;
  totalCourses: number;
  totalEnrollments: number;
  totalRevenue: number;
  recentUsers: {
    id: string;
    fullName: string;
    email: string;
    role: string;
    createdAt: string;
  }[];
  recentTransactions: {
    id: string;
    type: string;
    amount: number;
    description: string | null;
    createdAt: string;
    user: { fullName: string };
  }[];
}

export interface AdminUser {
  id: string;
  email: string;
  fullName: string;
  phone: string | null;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  balance: { amount: number } | null;
  _count: { enrollments: number };
}

export interface Course {
  id: string;
  title: string;
  titleAr: string | null;
  description: string | null;
  descriptionAr: string | null;
  language: string;
  published: boolean;
  price: number;
  videoUrls: string[];
  imageUrl: string | null; // ← cover image
  createdAt: string;
  _count: { enrollments: number };
}

export interface VideoItem {
  url: string;
  titleEn: string;
  titleAr: string;
  duration: string;
}

export type ToastMsg = { type: "success" | "error"; text: string } | null;
export type Tab = "overview" | "users" | "courses";
export type UserModal =
  | "balance"
  | "deduct"
  | "role"
  | "password"
  | "delete"
  | null;
export type CourseView = "list" | "add" | "edit";

// ─── Shared CSS ────────────────────────────────────────────────────────────────
export const inp =
  "w-full bg-[#f8f9fc] border border-slate-200 rounded-xl px-4 py-3 text-[14px] text-slate-800 " +
  "placeholder:text-slate-300 outline-none focus:border-[#00b4d8] focus:ring-2 focus:ring-[#00b4d8]/15 transition-all";

// ─── YouTube helpers ───────────────────────────────────────────────────────────
export function toEmbed(url: string): string {
  try {
    const u = new URL(url.trim());
    if (u.hostname.includes("youtu.be"))
      return `https://www.youtube.com/embed/${u.pathname.slice(1)}`;
    const v = u.searchParams.get("v");
    if (v) return `https://www.youtube.com/embed/${v}`;
  } catch {}
  return url.trim();
}

export function ytThumb(url: string): string {
  try {
    const id = toEmbed(url).split("/embed/")[1]?.split("?")[0];
    if (id) return `https://img.youtube.com/vi/${id}/mqdefault.jpg`;
  } catch {}
  return "";
}
