import { createAvatar } from "@dicebear/core";
import { adventurerNeutral } from "@dicebear/collection";

export const HOME_OG_IMAGE_URL = createAvatar(adventurerNeutral, {
  seed: "Az",
  mouth: ["variant04"],
  size: 1200,
}).toDataUri();
