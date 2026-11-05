type Props = { campaign: string };

/** Asks readers to join the Spends beta. Turned on per post with
 *  `banner: spends-beta` in the front matter. */
export function SpendsBetaBanner({ campaign }: Props) {
  const href = `https://spends.abdus.net/?utm_source=blog&utm_medium=banner&utm_campaign=${encodeURIComponent(campaign)}#install`;
  return (
    <aside className="mb-10 mt-0 flex flex-col gap-5 rounded-2xl bg-surface px-6 py-6 sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <div>
        <p className="eyebrow">Looking for beta testers</p>
        <p className="mt-2 text-[18px] leading-[1.6] text-fg">
          Try Spends on your Android phone. It reads your bank texts on the phone and
          shows where your money goes. Different banks help the most.
        </p>
      </div>
      <a
        href={href}
        className="shrink-0 self-start rounded-full bg-fg px-5 py-2.5 text-[16px] text-bg transition-opacity hover:opacity-85 sm:self-auto"
      >
        Join the beta
      </a>
    </aside>
  );
}
