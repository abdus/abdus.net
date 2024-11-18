import { photos } from "@/data/photos";
import { PhotoAlbum } from "@/components/photo-album";
import Container from "@/components/container";
import Header from "@/components/header";

export default async function PhotographyPage() {
  return (
    <Container className="max-w-[60rem] p-2 flex flex-col gap-[4rem] my-[2rem]">
      <Header />

      {photos.map((p, i) => (
        <PhotoAlbum key={i} {...p} />
      ))}
    </Container>
  );
}
