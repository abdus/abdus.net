import Link from "next/link";
import Container from "@/components/container";
import { ArrowRight } from "@/components/icons";

export default function NotFound() {
  return (
    <main className="flex grow items-center">
      <Container className="py-32 text-center">
        <p className="font-display text-[96px] font-extralight leading-none tracking-tightest text-fg-3 sm:text-[140px]">
          404
        </p>
        <h1 className="mt-6 font-display text-[28px] font-semibold tracking-tight text-fg">
          This page wandered off.
        </h1>
        <p className="mt-3 text-[17px] text-fg-2">
          It may have moved, or it never existed.
        </p>
        <div className="mt-10 flex justify-center gap-6">
          <Link href="/" className="link-arrow">
            Home <ArrowRight />
          </Link>
          <Link href="/posts" className="link-arrow">
            Writing <ArrowRight />
          </Link>
        </div>
      </Container>
    </main>
  );
}
