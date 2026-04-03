// app/(pages)/auth/reset-password/page.tsx

import { Suspense } from "react";
import ResetPasswordClient from "./ResetPasswordClient"; // ← هنفصل الكود

export default function ResetPasswordPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ResetPasswordClient />
    </Suspense>
  );
}
