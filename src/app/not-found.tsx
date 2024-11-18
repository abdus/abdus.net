import Link from "next/link";
import Header from "@/components/header";
import { CatIcon } from "lucide-react";

export default function NotFound() {
  return (
    <>
      <Header />
      <div className="text-center h-full max-h-[60%] flex flex-col items-center justify-center">
        <h1 className="mb-4 text-6xl font-semibold text-red-500">404</h1>
        <p className="mb-4 text-lg text-gray-600">
          Oops! Looks like you&apos;re lost.
        </p>

        <div className="animate-bounce text-red-500 mt-8">
          <CatIcon size={35} />
        </div>

        <p className="mt-4 text-gray-600">
          let&apos;s get you back{" "}
          <Link href="/" className="text-blue-500">
            home
          </Link>
          .
        </p>
      </div>
    </>
  );
}
