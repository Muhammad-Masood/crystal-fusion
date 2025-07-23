"use client";

import { useEffect } from "react";
import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
// import { ADMIN_EMAILS } from "@/lib/utils";

// const ADMIN_EMAILS = ["development.masood@gmail.com"];

export default function AdminProtectedPage({
  children,
}: {
  children: React.ReactNode;
}) {
  const { isLoaded, isSignedIn, user } = useUser();
  const router = useRouter();
  const ADMIN_EMAILS = process.env.NEXT_PUBLIC_ADMIN_EMAILS?.split(",") ?? [];

  useEffect(() => {
    if (!isLoaded) return;

    if (!isSignedIn) {
      router.push("/sign-in");
      return;
    }
    const email = user?.primaryEmailAddress?.emailAddress;
    console.log(email);

    if (!ADMIN_EMAILS.includes(email ?? "")) {
      router.push("/");
    }
  }, [isLoaded, isSignedIn, user, router]);

  if (!isSignedIn || !isLoaded) return null;

  return <>{children}</>;
}
