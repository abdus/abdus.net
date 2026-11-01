import { format as dateFormat } from "date-fns";

type Props = {
  format?: string;
  dateString: string;
  className?: string;
};

const DateFormatter = ({ dateString, format, className }: Props) => {
  const date = new Date(dateString);
  return (
    <time dateTime={date.toISOString()} className={className}>
      {dateFormat(date, format || "MMMM d, yyyy")}
    </time>
  );
};

export default DateFormatter;
