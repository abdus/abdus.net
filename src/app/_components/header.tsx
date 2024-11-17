import Link from "next/link";
import Container from "./container";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { CatIcon } from "lucide-react";

const Header = () => {
  return (
    <Container className="max-w-4xl">
      <nav className="flex items-center mx-auto mb-20 mt-8">
        <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight flex items-center">
          <Link href="/" className="hover:underline flex items-center gap-2">
            <span
              className="size-[0.9em] border flex items-center justify-center rounded-md overflow-hidden"
              dangerouslySetInnerHTML={{
                __html: createAvatar(adventurerNeutral, {
                  seed: "Az",
                  mouth: ["variant04"],
                }).toString(),
              }}
            />
            Abdus
          </Link>
          .
        </h2>

        <ul className="flex ml-auto gap-4">
          <li>
            <Link
              href="/snowbell"
              className="hover:underline flex items-center gap-1"
            >
              <CatIcon className="size-[1em] inline text-red-500" />
              Talk to Snowbell
            </Link>
          </li>
        </ul>
      </nav>
    </Container>
  );
};

export default Header;
