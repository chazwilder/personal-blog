"use client";

import { useEffect } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense } from "react";

function NotFoundContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const from = searchParams.get("from");

  useEffect(() => {
    // You can add any tracking or logging here
    console.log("404 error occurred", { from });
  }, [from]);

  return (
    <div className="flex min-h-screen flex-col items-center justify-center text-center">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white">404</h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        The page you're looking for doesn't exist.
      </p>
      <button
        onClick={() => router.push("/")}
        className="mt-8 rounded-md bg-main px-4 py-2 text-sm font-medium text-black transition-colors hover:bg-main/80"
      >
        Go back home
      </button>
    </div>
  );
}

export default function NotFound() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <NotFoundContent />
    </Suspense>
  );
}
