import { format as dateFormat } from "date-fns";

type Props = {
  format?: string;
  dateString: string;
};

const DateFormatter = ({ dateString, format }: Props) => {
  const date = new Date(dateString);
  return (
    <time dateTime={dateString}>
      {dateFormat(date, format || "LLLL	d, yyyy")}
    </time>
  );
};

export default DateFormatter;
