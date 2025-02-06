import Link from "next/link";
import Container from "./container";
import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";
import { CatIcon, MailIcon } from "lucide-react";

const links = [
  { href: "/about", jsx: "About" },
  {
    href: "/projects/snowbell",
    jsx: (
      <>
        <CatIcon className="size-[1em] inline text-red-500" />
        Snowbell
      </>
    ),
  },
  {
    href: "mailto:abdus@abdus.net",
    jsx: <MailIcon className="size-[1em] inline text-gray-700" />,
  },
];

const Header = () => {
  return (
    <Container className="max-w-4xl">
      <nav className="flex items-center mx-auto my-8">
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

        <ul className="flex items-center ml-auto gap-4">
          {links.map(({ href, jsx }) => (
            <li key={href}>
              <Link
                href={href}
                className="hover:underline flex items-center gap-1"
              >
                {jsx}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </Container>
  );
};

export default Header;
