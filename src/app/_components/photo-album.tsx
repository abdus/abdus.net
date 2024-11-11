import html from "remark-html";
import { remark } from "remark";
import { cn } from "@/lib/utils";
import { Lora } from "next/font/google";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";

const font = Lora({ subsets: ["latin"], weight: ["400"] });

type Props = {
  title: string;
  description: string;
  url: string;
  tag?: string;
  alternateUrls?: { title: string; url: string }[];
  cameraInfo?: {
    camera: string;
    lens: string;
    focalLength: string;
    aperture: string;
    exposure: string;
    iso: string;
  };
};

export function PhotoAlbum(props: Props) {
  return (
    <div className="p-[2.5rem] shadow-sm rounded-sm border border-border/50">
      <div className="w-full aspect-video">
        <Dialog>
          <DialogTrigger className="size-full block aspect-video relative">
            <img
              src={props.url}
              alt={props.title + ": " + props.description}
              className="block size-full object-cover"
            />

            <div
              className={cn(
                "text-[1em] absolute inset-0 bg-foreground",
                "text-background opacity-0 hover:opacity-90",
                "flex items-center justify-center p-4",
                "transition-opacity duration-500 text-left"
              )}
            >
              <pre className="overflow-auto">
                {JSON.stringify(props.cameraInfo, null, 2)}
              </pre>
            </div>
          </DialogTrigger>
          <DialogContent className="p-0 overflow-hidden">
            <img
              src={props.url}
              alt={props.title + ": " + props.description}
              className="block size-full object-cover"
            />
          </DialogContent>
        </Dialog>
      </div>

      <div className="flex flex-col pt-6">
        <p className="leading-[1.3] text-[1.7em] font-bold">{props.title}</p>
        <p
          className={cn(
            font.className,
            "leading-[1.2] text-[1.1em] text-foreground/70 prose"
          )}
          dangerouslySetInnerHTML={{
            __html: remark()
              .use(html)
              .processSync(
                [
                  props.description,
                  props.alternateUrls
                    ?.map((alt) => `[${alt.title}](${alt.url})`)
                    .join(" &middot; "),
                ].join(" ")
              )
              .toString(),
          }}
        />
      </div>
    </div>
  );
}
