import { getAlbumById, getAlbums, getEnrichedSongs } from "@/lib/db";
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
  const album = await getAlbumById(id);

  return {
    title: album?.title ?? 'アルバム情報',
  };
}

export async function generateStaticParams() {
    const albums = await getAlbums();
    return albums.map((album) => ({
        id: String(album.id),
    }));
}

export default async function AlbumDetailPage({ params }: Props) {
    const album = await getAlbumById(Number(params.id));
    if (!album) {
        return <div>アルバムが見つかりません。</div>;
    }

    const allSongs = await getEnrichedSongs();
    const tracklist = allSongs.filter(song => song.album_id === album.id);

    return (
        <div>
            <h1>{album.title}</h1>
            <dl className="detail-grid">
                <dt>発売日</dt>
                <dd>{format(new Date(album.release_date), 'yyyy年M月d日')}</dd>
            </dl>

      <h2 style={{ marginTop: '2rem' }}>収録曲</h2>
      <div>
        {tracklist.map((song, index) => (
            <Link href={`/songs/${song.id}`} key={song.id} className="list-item">
                <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                    <span style={{ color: 'var(--color-text-secondary)' }}>{String(index + 1).padStart(2, '0')}</span>
                    <span className="list-item-title">{song.title}</span>
                </div>
            </Link>
        ))}
      </div>
        </div>
    );
}
