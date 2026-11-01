import { cn } from "@/lib/utils";

type Props = {
  className?: string;
  children?: React.ReactNode;
  /** `text` is the reading measure; `wide` is for lists and grids. */
  size?: "text" | "wide";
};

const Container = ({ children, className, size = "wide" }: Props) => {
  return (
    <div
      className={cn(
        "mx-auto w-full px-6",
        size === "text" ? "max-w-[44rem]" : "max-w-[60rem]",
        className
      )}
    >
      {children}
    </div>
  );
};

export default Container;
