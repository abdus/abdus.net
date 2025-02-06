import { ReactNode } from "react";

type Props = {
  children?: ReactNode;
};

export function PostTitle({ children }: Props) {
  return (
    <h1 className="text-3xl md:text-4xl tracking-tight leading-tight mb-2 text-gray-900">
      {children}
    </h1>
  );
}
