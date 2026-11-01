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
    <figure className="border-b border-line/[0.07] py-16 text-center first:pt-0">
      <blockquote
        className="display text-balance text-[24px] leading-[1.35] text-fg-2 sm:text-[30px] [&_strong]:font-light [&_strong]:text-fg"
        dangerouslySetInnerHTML={{ __html: `“${summary}”` }}
      />
      <figcaption className="mt-8 flex flex-col items-center gap-3">
        <Avatar name={author.name} src={author.avatar} className="size-11 text-[44px]" />
        <span className="text-[14px] text-fg">{author.name}</span>
        <span className="-mt-2 text-[13px] text-fg-3">
          {authorLine(author)} · {author.country}
        </span>
      </figcaption>

      <details className="group mx-auto mt-8 max-w-[34rem] text-left">
        <summary className="mx-auto w-fit cursor-pointer list-none text-[13px] text-tint [&::-webkit-details-marker]:hidden">
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
