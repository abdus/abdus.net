//import Avatar from "./avatar";
//import CoverImage from "./cover-image";
import DateFormatter from "./date-formatter";
import { PostTitle } from "@/components/post-title";
//import { type Author } from "@/interfaces/author";

type Props = {
  title: string;
  date: string;
};

export function PostHeader({ title, date }: Props) {
  return (
    <>
      <PostTitle>{title}</PostTitle>
      {date && (
        <div className="text-gray-500 mb-8">
          <DateFormatter dateString={date} />
        </div>
      )}
    </>
  );
}
