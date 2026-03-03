"use client";

import Link from "next/link";

export default function GlobalError({ error }: { error: Error }) {
  return (
    <div className="flex flex-col items-center justify-center h-screen">
      <h1 className="text-2xl font-bold">
        {error?.message || `Oops! Something went wrong.`}
      </h1>
      <p className="text-gray-500">
        We are sorry for the inconvenience. Please try again later.
      </p>
      <Link href="/" className="text-blue-500">
        Go back to the home page
      </Link>
    </div>
  );
}
