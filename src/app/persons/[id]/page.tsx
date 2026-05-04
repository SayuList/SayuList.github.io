import { getPersonById, getSongsByPersonId, getAlbums, getPersons } from "@/lib/db";
import Link from "next/link";
import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';

type Props = {
    params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = Number(params.id);
  const person = await getPersonById(id);

  return {
    title: person?.name ?? '人物情報',
  };
}

export async function generateStaticParams() {
    const persons = await getPersons();
    return persons.map((person) => ({
        id: String(person.id),
    }));
}

export default async function PersonDetailPage({ params }: Props) {
    const personId = Number(params.id);
    const person = await getPersonById(personId);

    if (!person) {
        return <div>人物が見つかりません。</div>;
    }

    const songsByPerson = await getSongsByPersonId(personId);
    const allAlbums = await getAlbums(); // Fetch all albums once

    // Helper to get album title
        const getAlbumTitle = (albumId?: number) => {
            if (!albumId) return "不明";
            return allAlbums.find(a => a.id === albumId)?.title ?? "不明";
        };
    
        // Group songs by role
        const lyricistSongs = songsByPerson.filter(song => song.lyricist_ids?.includes(Number(params.id)));
        const composerSongs = songsByPerson.filter(song => song.composer_ids?.includes(Number(params.id)));
        const arrangerSongs = songsByPerson.filter(song => song.arranger_ids?.includes(Number(params.id)));
    
        return (
            <div>
                <h1>{person.name}</h1>
                {person.profile && <p>{person.profile}</p>}
    
                <h2 style={{ marginTop: '2rem' }}>関わった楽曲</h2>
    
                {lyricistSongs.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3>作詞</h3>
                        <div>
                            {lyricistSongs.map(song => (
                                <Link href={`/songs/${String(song.id)}`} key={song.id} className="list-item">
                                    <div className="list-item-title">{song.title}</div>
                                    <div className="list-item-meta">{getAlbumTitle(song.album_id)}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
    
                {composerSongs.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3>作曲</h3>
                        <div>
                            {composerSongs.map(song => (
                                <Link href={`/songs/${String(song.id)}`} key={song.id} className="list-item">
                                    <div className="list-item-title">{song.title}</div>
                                    <div className="list-item-meta">{getAlbumTitle(song.album_id)}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
    
                {arrangerSongs.length > 0 && (
                    <div style={{ marginBottom: '1.5rem' }}>
                        <h3>編曲</h3>
                        <div>
                            {arrangerSongs.map(song => (
                                <Link href={`/songs/${String(song.id)}`} key={song.id} className="list-item">
                                    <div className="list-item-title">{song.title}</div>
                                    <div className="list-item-meta">{getAlbumTitle(song.album_id)}</div>
                                </Link>
                            ))}
                        </div>
                    </div>
                )}
      {songsByPerson.length === 0 && <p>この人物が関わった楽曲は見つかりませんでした。</p>}
        </div>
    );
}