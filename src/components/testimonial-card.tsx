import { Avatar } from "./avatar";

type Author = {
  name: string;
  avatar: string;
  organization: string;
  country: string;
  job_title: string[];
};

type TestimonialProps = {
  recommendation: string;
  summary: string;
  author: Author;
};

export function authorLine(author: Author) {
  const role = author.job_title.length > 0 ? `${author.job_title.join(", ")}, ` : "";
  return `${role}${author.organization}`;
}

export function Testimonial({ recommendation, summary, author }: TestimonialProps) {
  return (
    <figure className="border-b border-line/[0.07] py-12 first:pt-0">
      <blockquote
        className="text-[20px] font-light leading-[1.5] text-fg-2 sm:text-[22px] [&_strong]:font-normal [&_strong]:text-fg"
        dangerouslySetInnerHTML={{ __html: `“${summary}”` }}
      />
      <figcaption className="mt-6 flex items-center gap-3">
        <Avatar name={author.name} src={author.avatar} className="size-10 text-[40px]" />
        <span className="text-[14px] leading-tight">
          <span className="block text-fg">{author.name}</span>
          <span className="block text-fg-3">
            {authorLine(author)} · {author.country}
          </span>
        </span>
      </figcaption>

      <details className="group mt-5">
        <summary className="w-fit cursor-pointer list-none text-[14px] text-tint [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Read in full</span>
          <span className="hidden group-open:inline">Close</span>
        </summary>
        <p className="mt-6 whitespace-pre-line text-[16px] leading-relaxed text-fg-2">
          {recommendation}
        </p>
      </details>
    </figure>
  );
}
