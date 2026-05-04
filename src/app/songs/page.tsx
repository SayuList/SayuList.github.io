import { getEnrichedSongs } from "@/lib/db";
import SongListClient from "./SongListClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '楽曲',
};

export default async function SongsPage() {
  const initialSongs = await getEnrichedSongs();

  return <SongListClient initialSongs={initialSongs} />;
}