import { getPersons, getEnrichedSongs, getArtist } from "@/lib/db";
import ArtistListClient from "./ArtistListClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'クリエイター情報',
};

export default async function ArtistPage() {
    const allPersons = await getPersons();
    const allSongs = await getEnrichedSongs();
    const mainArtist = await getArtist();

    return (
        <ArtistListClient 
            allPersons={allPersons} 
            allSongs={allSongs} 
            mainArtist={mainArtist} 
        />
    );
}
