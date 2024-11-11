//import Avatar from "./avatar";
//import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/app/_components/post-title";
//import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  date: string;
};

export function PostHeader({ title, date }: Props) {
  return (
    <div className="max-w-4xl mx-auto">
      <PostTitle>{title}</PostTitle>
      <div className="mx-auto">
        <div className="mb-6 text-lg">
          <DateFormatter dateString={date} />
        </div>
      </div>
    </div>
  );
}
