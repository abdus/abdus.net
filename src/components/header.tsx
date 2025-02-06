"use client";

import Link from "next/link";
import Container from "./container";
import { BookOpenCheckIcon, CatIcon, HomeIcon, MailIcon, Menu, SquareKanbanIcon, X } from "lucide-react";
import { useState, useEffect } from "react";
import { cn } from "@/lib/utils";
import { AvatarIcon } from "@radix-ui/react-icons";
import { Button } from "./ui/button";

interface LinkItem {
  href: string;
  jsx: string | JSX.Element;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  icon: React.ComponentType<any>;
}

const links: LinkItem[] = [
  { href: "/about", jsx: "About", icon: AvatarIcon },
  { href: "/posts", jsx: "Blog", icon: BookOpenCheckIcon },
  { href: "/projects", jsx: "Projects", icon: SquareKanbanIcon },
  { href: "mailto:dev.abdus@gmail.com", jsx: "Email", icon: MailIcon },
  { href: "/projects/snowbell", jsx: "Snowbell", icon: CatIcon },
];

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  // Prevent scroll when menu is open
  useEffect(() => {
    if (isMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isMenuOpen]);

  return (
    <>
      <Container className="max-w-4xl">
        <nav className="flex items-center mx-auto my-8">
          <h2 className="text-2xl font-medium">
            <Link href="/">
              <span className="font-bold">Abdus</span>
            </Link>
            .
          </h2>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 ml-auto z-50 relative"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
            aria-label="Toggle menu"
          >
            {isMenuOpen ? (
              <X className="h-5 w-5" />
            ) : (
              <Menu className="h-5 w-5" />
            )}
          </button>

          {/* Desktop Navigation */}
          <ul className="hidden md:flex items-center ml-auto gap-4">
            {links.map(({ href, jsx }) => (
              <li key={href}>
                <Link
                  href={href}
                  className="hover:text-blue-600 transition-colors"
                >
                  {jsx}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </Container>

      {/* Mobile Navigation Overlay */}
      <div
        className={cn(
          "fixed inset-0 bg-black/20 backdrop-blur-sm z-40 md:hidden transition-opacity duration-300",
          isMenuOpen ? "opacity-100" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setIsMenuOpen(false)}
      />

      {/* Mobile Navigation Menu */}
      <div
        className={cn(
          "fixed inset-x-0 bottom-0 z-40 text-gray-600 bg-white rounded-t-xl shadow-[0_-8px_30px_rgb(0,0,0,0.12)]",
          "transform transition-transform duration-300 ease-in-out md:hidden",
          "overflow-y-auto max-h-[70vh]",
          isMenuOpen ? "translate-y-0" : "translate-y-full"
        )}
      >
        <nav className="h-full py-8 px-6">
          <div className="flex flex-col gap-4">
              <Link
                href="/"
                className="hover:text-blue-600 transition-colors flex gap-2 items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <HomeIcon className="size-4 text-blue-600" />
                Home
              </Link>

            {links.map(({ href, jsx, icon: IconComponent }) => (
              <Link
                key={href}
                href={href}
                className="hover:text-blue-600 transition-colors flex gap-2 items-center"
                onClick={() => setIsMenuOpen(false)}
              >
                <IconComponent className="size-4 text-blue-600" />
                {typeof jsx === "string" ? jsx : (
                  <div className="flex items-center gap-2">
                    {jsx}
                  </div>
                )}
              </Link>
            ))}

            <Button onClick={() => setIsMenuOpen(false)} size="sm" variant="secondary">Close Menu</Button>
          </div>
        </nav>
      </div>
    </>
  );
};

export default Header;
