import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";

export const SITE = {
  name: "Abdus Azad",
  url: "https://abdus.net",
  description:
    "Abdus Azad is a software engineer who builds fast, considered software for the web, and writes about what it takes.",
  email: "abdus@abdus.net",
  github: "https://github.com/abdus",
  linkedin: "https://linkedin.com/in/azabdus",
  resume: "/resume.pdf",
};

export const HOME_OG_IMAGE_URL = createAvatar(adventurerNeutral, {
  seed: "Az",
  mouth: ["variant04"],
  size: 1200,
}).toDataUri();
