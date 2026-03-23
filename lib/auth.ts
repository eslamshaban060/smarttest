import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import { prisma } from "./prisma";
import type { Role } from "@/prisma/generated/prisma";

const JWT_SECRET = process.env.JWT_SECRET!;
const COOKIE_NAME = "sa_session";
const SESSION_DAYS = 30;

export async function hashPassword(plain: string) {
  return bcrypt.hash(plain, 12);
}

export async function verifyPassword(plain: string, hash: string) {
  return bcrypt.compare(plain, hash);
}

export function generateSecureToken() {
  const array = new Uint8Array(32);
  crypto.getRandomValues(array);
  return Array.from(array, (b) => b.toString(16).padStart(2, "0")).join("");
}

export function signToken(payload: {
  userId: string;
  role: Role;
  sessionId: string;
}) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: `${SESSION_DAYS}d` });
}

export function verifyToken(token: string) {
  try {
    return jwt.verify(token, JWT_SECRET) as {
      userId: string;
      role: Role;
      sessionId: string;
    };
  } catch {
    return null;
  }
}

export async function createSession(userId: string, role: Role) {
  const expiresAt = new Date();
  expiresAt.setDate(expiresAt.getDate() + SESSION_DAYS);

  const session = await prisma.session.create({
    data: { userId, token: crypto.randomUUID(), expiresAt },
  });

  const token = signToken({ userId, role, sessionId: session.id });

  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    expires: expiresAt,
    path: "/",
  });
}

export async function destroySession() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAME)?.value;
  if (token) {
    const payload = verifyToken(token);
    if (payload) {
      await prisma.session
        .deleteMany({ where: { id: payload.sessionId } })
        .catch(() => {});
    }
  }
  cookieStore.delete(COOKIE_NAME);
}

export async function getCurrentUser() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(COOKIE_NAME)?.value;
    if (!token) return null;

    const payload = verifyToken(token);
    if (!payload) return null;

    const user = await prisma.user.findUnique({
      where: { id: payload.userId },
      select: {
        id: true,
        email: true,
        fullName: true,
        phone: true,
        role: true,
        isActive: true,
        emailVerified: true,
        createdAt: true,
      },
    });

    if (!user || !user.isActive) return null;
    return user;
  } catch {
    return null;
  }
}
