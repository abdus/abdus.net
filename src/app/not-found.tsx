import Link from "next/link";
import Container from "@/components/container";

export default function NotFound() {
  return (
    <main className="flex grow items-center">
      <Container className="py-32 text-center">
        <p className="display text-[120px] leading-none text-fg-3 sm:text-[180px]">
          404
        </p>
        <h1 className="mt-6 display text-[32px]">
          This page wandered off.
        </h1>
        <p className="mt-3 text-[17px] text-fg-2">
          It may have moved, or it never existed.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <Link href="/" className="link">
            Home
          </Link>
          <Link href="/posts" className="link">
            Writing
          </Link>
        </div>
      </Container>
    </main>
  );
}
