"use client";

import Link from "next/link";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <html>
      <body>
        <div className="flex flex-col items-center justify-center h-screen gap-4">
          <h1 className="text-2xl font-bold">
            {error?.message || `Oops! Something went wrong.`}
          </h1>
          <p className="text-gray-500">
            We are sorry for the inconvenience. Please try again later.
          </p>
          <div className="flex gap-4">
            <button
              type="button"
              onClick={() => reset()}
              className="text-blue-500 underline"
            >
              Try again
            </button>
            <Link href="/" className="text-blue-500 underline">
              Go back to the home page
            </Link>
          </div>
        </div>
      </body>
    </html>
  );
}
