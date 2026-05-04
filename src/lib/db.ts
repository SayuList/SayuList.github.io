import { Album, Artist, Concert, Song, Venue, Person } from "./types";

// --- Enriched (Processed) Data ---
export async function getEnrichedSongs(): Promise<Song[]> {
  const songsModule = await import('@/data/processed/songs.enriched.json');
  return (songsModule.default as Song[]).filter((song: Song) => !song.is_deleted);
}

export async function getSongById(id: number): Promise<Song | undefined> {
  const songsModule = await import('@/data/processed/songs.enriched.json');
  const song = (songsModule.default as Song[]).find((s: Song) => s.id === id);
  return song?.is_deleted ? undefined : song;
}

// --- Raw Data ---
export async function getArtist(): Promise<Artist> {
    const artistModule = await import('@/data/raw/artist.json');
    return artistModule.default as Artist;
}

export async function getPersons(): Promise<Person[]> {
    const personsModule = await import('@/data/raw/persons.json');
    return (personsModule.default as Person[]).filter((p: Person) => !p.is_deleted);
}

export async function getPersonById(id: number): Promise<Person | undefined> {
    const persons = await getPersons();
    const person = persons.find(p => p.id === id);
    return person?.is_deleted ? undefined : person;
}

export async function getSongsByPersonId(personId: number): Promise<Song[]> {
    const allSongs = await getEnrichedSongs(); // Already filtered
    return allSongs.filter(song =>
        (song.lyricist_ids && song.lyricist_ids.includes(personId)) ||
        (song.composer_ids && song.composer_ids.includes(personId)) ||
        (song.arranger_ids && song.arranger_ids.includes(personId))
    );
}

export async function getAlbums(): Promise<Album[]> {
  // @ts-ignore
  const albums = await import('@/data/raw/albums.json');
  return albums.default.filter((a: Album) => !a.is_deleted);
}

export async function getAlbumById(id: number): Promise<Album | undefined> {
  const albums = await getAlbums();
  const album = albums.find(a => a.id === id);
  return album?.is_deleted ? undefined : album;
}

export async function getConcerts(): Promise<Concert[]> {
    // @ts-ignore
    const concerts = await import('@/data/raw/concerts.json');
    const filtered = concerts.default.filter((c: Concert) => !c.is_deleted);
    // sort by date descending
    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function getConcertById(id: number): Promise<Concert | undefined> {
    const concerts = await getConcerts();
    const concert = concerts.find(c => c.id === id);
    return concert?.is_deleted ? undefined : concert;
}

export async function getConcertsByVenueId(venueId: number): Promise<Concert[]> {
    const allConcerts = await getConcerts(); // Already filtered
    return allConcerts.filter(concert => concert.venue_id === venueId);
}

export async function getVenueById(id: number): Promise<Venue | undefined> {
    const venues = await getVenues();
    const venue = venues.find(v => v.id === id);
    return venue?.is_deleted ? undefined : venue;
}

export async function getVenues(): Promise<Venue[]> {
    // @ts-ignore
    const venues = await import('@/data/raw/venues.json');
    return venues.default.filter((v: Venue) => !v.is_deleted);
}