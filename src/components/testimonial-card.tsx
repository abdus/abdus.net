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

/** Summary is trusted, hand-written HTML from data/testimonials.json. */
export function Summary({ html, className = "" }: { html: string; className?: string }) {
  return (
    <p
      className={`text-fg-2 [&_strong]:font-medium [&_strong]:text-fg ${className}`}
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}

export function Testimonial({ recommendation, summary, author }: TestimonialProps) {
  return (
    <figure className="border-b border-line/10 py-10 first:pt-0">
      <blockquote>
        <Summary
          html={summary}
          className="font-display text-[22px] leading-[1.4] tracking-tight sm:text-[24px]"
        />
      </blockquote>

      <figcaption className="mt-6 flex items-center gap-3">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={author.avatar}
          alt=""
          loading="lazy"
          className="size-10 rounded-full bg-surface object-cover"
        />
        <div className="text-[14px] leading-tight">
          <p className="font-medium text-fg">{author.name}</p>
          <p className="mt-0.5 text-fg-3">
            {authorLine(author)} · {author.country}
          </p>
        </div>
      </figcaption>

      <details className="group mt-6">
        <summary className="link-arrow cursor-pointer list-none [&::-webkit-details-marker]:hidden">
          <span className="group-open:hidden">Read the full recommendation</span>
          <span className="hidden group-open:inline">Hide</span>
        </summary>
        <p className="mt-4 whitespace-pre-line text-[16px] leading-relaxed text-fg-2">
          {recommendation}
        </p>
      </details>
    </figure>
  );
}
