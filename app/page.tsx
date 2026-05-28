// app/page.tsx
"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { getHouseholdId } from "@/lib/household";

export default function RootPage() {
  const router = useRouter();

  useEffect(() => {
    router.replace(getHouseholdId() ? "/home" : "/onboarding");
  }, [router]);

  return (
    <div className="flex h-screen items-center justify-center">
      <div className="h-8 w-8 animate-spin rounded-full border-4 border-green-600 border-t-transparent" />
    </div>
  );
}
