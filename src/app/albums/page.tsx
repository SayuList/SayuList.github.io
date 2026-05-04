import { getAlbums } from "@/lib/db";
import AlbumListClient from "./AlbumListClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'アルバム',
};

export default async function AlbumsPage() {
  const albums = await getAlbums();

  return <AlbumListClient initialAlbums={albums} />;
}
