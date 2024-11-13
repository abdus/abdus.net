import Link from "next/link";

const Header = () => {
  return (
    <nav className="flex items-center container max-w-4xl mx-auto mb-20 mt-8 px-2">
      <h2 className="text-2xl md:text-4xl font-bold tracking-tight md:tracking-tighter leading-tight flex items-center">
        <Link href="/" className="hover:underline">
          Abdus
        </Link>
        .
      </h2>

      <ul className="flex ml-auto gap-4">
        <li>
          <Link href="/about" className="hover:underline">
            About
          </Link>
        </li>
      </ul>
    </nav>
  );
};

export default Header;
