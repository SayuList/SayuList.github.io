import { getConcertById, getConcerts, getSongById, getVenueById, getArtist, getPersonById } from "@/lib/db";
import Link from "next/link";
import { format } from 'date-fns';
import { Metadata, ResolvingMetadata } from 'next';
import React from 'react';
import { SetlistItemType } from "@/lib/types";

type Props = {
    params: { id: string };
};

export async function generateMetadata(
  { params }: Props,
  parent: ResolvingMetadata
): Promise<Metadata> {
  const id = Number(params.id);
  const concert = await getConcertById(id);

  return {
    title: concert?.title ?? '公演情報',
  };
}

export async function generateStaticParams() {
    const concerts = await getConcerts();
    return concerts.map((concert) => ({
        id: String(concert.id),
    }));
}

export default async function ConcertDetailPage({ params }: Props) {
    const concert = await getConcertById(Number(params.id));
    if (!concert) {
        return <div>公演が見つかりません。</div>;
    }

    const venue = await getVenueById(concert.venue_id);
    const artist = await getArtist();

    // Helper to calculate the display number for songs
    let normalSongCount = 0;
    let encoreSongCount = 0;
    let doubleEncoreSongCount = 0;

    const renderSetlistItem = async (item: any, index: number) => {
        let displayNumber = "";
        let isNavigable = true;
        let title = "";
        let metaInfo = null;
        let href = "";

        if (item.type === SetlistItemType.MC) {
            displayNumber = "";
            isNavigable = false;
            title = typeof item.content === 'string' ? item.content : "MC";
        } else {
            // It's a song (Normal, Encore, or DoubleEncore)
            if (item.type === SetlistItemType.Song) {
                normalSongCount++;
                displayNumber = String(normalSongCount).padStart(2, '0');
            } else if (item.type === SetlistItemType.Encore) {
                encoreSongCount++;
                displayNumber = `EN${String(encoreSongCount).padStart(2, '0')}`;
            } else if (item.type === SetlistItemType.DoubleEncore) {
                doubleEncoreSongCount++;
                displayNumber = `W-EN${String(doubleEncoreSongCount).padStart(2, '0')}`;
            }

            if (typeof item.content === 'number') {
                const song = await getSongById(item.content);
                if (!song) return null;
                title = song.title;
                href = `/songs/${song.id}`;
            } else {
                // CoverSong object
                title = item.content.title;
                if (item.content.song_id) {
                    href = `/songs/${item.content.song_id}`;
                    isNavigable = true;
                } else {
                    isNavigable = false;
                }
                metaInfo = (
                    <div className="list-item-meta">
                        <span>Original Artist: {item.content.original_artist}</span>
                        {item.content.singers && <span> | 歌唱: {item.content.singers}</span>}
                        {item.content.lyricist && <span> | 作詞: {item.content.lyricist}</span>}
                        {item.content.composer && <span> | 作曲: {item.content.composer}</span>}
                    </div>
                );
            }
        }

        const content = (
            <div style={{ display: 'flex', alignItems: 'baseline', gap: '1rem' }}>
                <span style={{ 
                    color: 'var(--color-text-secondary)', 
                    minWidth: '3.5rem', 
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    {displayNumber}
                </span>
                <div>
                    <div className="list-item-title">{title}</div>
                    {metaInfo}
                </div>
            </div>
        );

        if (isNavigable && href) {
            return (
                <Link href={href} key={index} className="list-item">
                    {content}
                </Link>
            );
        } else {
            return (
                <div key={index} className="list-item" style={{ cursor: 'default' }}>
                    {content}
                </div>
            );
        }
    };

    return (
        <div>
            <h1>{concert.title}</h1>

      <dl className="detail-grid">
        <dt>日程</dt>
        <dd>{format(new Date(concert.date), 'yyyy年M月d日')}</dd>
        <dt>会場</dt>
        <dd>{venue ? <Link href={`/venues/${venue.id}`}>{venue.name}</Link> : '不明'}</dd>
        <dt>出演</dt>
        <dd><Link href={`/persons/${artist.id}`}>{artist.name}</Link></dd>
      </dl>

      <h2 style={{ marginTop: '2rem' }}>セットリスト</h2>
      {concert.is_incomplete && (
        <p className="list-item-meta" style={{ marginBottom: '1rem', marginTop: '-0.5rem' }}>
          ※このセットリストは楽曲・MC情報等が不十分である場合があります。
        </p>
      )}
      {concert.setlist.length > 0 ? (
        <div>
          {await Promise.all(concert.setlist.map((item, index) => renderSetlistItem(item, index)))}
        </div>
      ) : (
        <p>このイベントに関する情報は公開されていません</p>
      )}
        </div>
    );
}
