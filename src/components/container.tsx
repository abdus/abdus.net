import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
};

/** The site is one column. This is it. */
const Container = ({ children, className }: Props) => (
  <div className={cn("mx-auto w-full max-w-[42rem] px-6", className)}>{children}</div>
);

export default Container;
