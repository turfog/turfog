import { Suspense } from "react";
import { LoginClient } from "./LoginClient";

export default function AdminLoginPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen bg-[#0A0A0B] flex items-center justify-center">
        <div className="w-6 h-6 border-2 border-neutral-700 border-t-emerald-500 rounded-full animate-spin" />
      </div>
    }>
      <LoginClient />
    </Suspense>
  );
}