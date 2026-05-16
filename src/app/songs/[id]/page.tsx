import React from 'react';
import { getEnrichedSongs, getSongById, getAlbumById, getConcerts, getArtist, getConcertById, getPersonById } from "@/lib/db";
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
  const song = await getSongById(id);

  return {
    title: song?.title ?? '楽曲情報',
  };
}

export async function generateStaticParams() {
  const songs = await getEnrichedSongs();
  return songs.map((song) => ({
    id: String(song.id),
  }));
}

export default async function SongDetailPage({ params }: Props) {
  const song = await getSongById(Number(params.id));

  if (!song) {
    return <div>楽曲が見つかりません。</div>;
  }

  const album = await getAlbumById(song.album_id);
  const artist = await getArtist();
  const allConcerts = await getConcerts();
  const performances = allConcerts
    .filter(c => c.setlist.some(item => {
        const isTargetSong = (typeof item.content === 'number' && item.content === song.id) ||
                           (typeof item.content === 'object' && item.content !== null && 'song_id' in item.content && (item.content as any).song_id === song.id);
        return item.type !== 0 && isTargetSong;
    }))
    .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  
  const lastConcert = song.last_performed_concert_id 
    ? await getConcertById(song.last_performed_concert_id) 
    : null;

  return (
    <div>
      <h1>{song.title}</h1>

      <dl className="detail-grid">
        <dt>アルバム</dt>
        <dd>{album ? <Link href={`/albums/${album.id}`}>{album.title ?? 'N/A'}</Link> : 'N/A'}</dd>
        <dt>アーティスト</dt>
        <dd><Link href={`/persons/${artist.id}`}>{artist.name}</Link></dd>
        <dt>作詞</dt>
        <dd>
            {song.lyricist_ids && song.lyricist_ids.length > 0
                ? (await Promise.all(song.lyricist_ids
                    .sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : 0)) // Prioritize SAYU
                    .map(async (personId) => {
                        const p = await getPersonById(personId);
                        return p ? <Link key={p.id} href={`/persons/${p.id}`}>{p.name}</Link> : '不明';
                    })
                )).map((element, index, array) => (
                    <React.Fragment key={index}>
                        {element}
                        {index < array.length - 1 && ", "}
                    </React.Fragment>
                ))
                : 'N/A'}
        </dd>
        <dt>作曲</dt>
        <dd>
            {song.composer_ids && song.composer_ids.length > 0
                ? (await Promise.all(song.composer_ids
                    .sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : 0)) // Prioritize SAYU
                    .map(async (personId) => {
                        const p = await getPersonById(personId);
                        return p ? <Link key={p.id} href={`/persons/${p.id}`}>{p.name}</Link> : '不明';
                    })
                )).map((element, index, array) => (
                    <React.Fragment key={index}>
                        {element}
                        {index < array.length - 1 && ", "}
                    </React.Fragment>
                ))
                : 'N/A'}
        </dd>
        <dt>編曲</dt>
        <dd>
            {song.arranger_ids && song.arranger_ids.length > 0
                ? (await Promise.all(song.arranger_ids
                    .sort((a, b) => (a === 1 ? -1 : b === 1 ? 1 : 0)) // Prioritize SAYU
                    .map(async (personId) => {
                        const p = await getPersonById(personId);
                        return p ? <Link key={p.id} href={`/persons/${p.id}`}>{p.name}</Link> : '不明';
                    })
                )).map((element, index, array) => (
                    <React.Fragment key={index}>
                        {element}
                        {index < array.length - 1 && ", "}
                    </React.Fragment>
                ))
                : 'N/A'}
        </dd>
        {song.youtube_music_url && (
            <>
                <dt>YouTube Music</dt>
                <dd><a href={song.youtube_music_url} target="_blank" rel="noopener noreferrer">{song.youtube_music_url}</a></dd>
            </>
        )}
      </dl>

      <h2>統計情報</h2>
      <dl className="detail-grid">
        <dt>披露回数</dt>
        <dd>{song.performance_count ?? 0}回</dd>
        <dt>最終披露</dt>
        <dd>
        {lastConcert ? (
            <Link href={`/concerts/${lastConcert.id}`}>
              {format(new Date(lastConcert.date), 'yyyy年M月d日')} - {lastConcert.title}
            </Link>
        ) : 'ライブでの披露記録なし'}
        </dd>
      </dl>
      
      <h2>披露履歴</h2>
      {performances.length > 0 ? (
        <div>
          {performances.map(concert => (
            <Link href={`/concerts/${concert.id}`} key={concert.id} className="list-item">
              <div className="list-item-title">{concert.title}</div>
              <div className="list-item-meta">{format(new Date(concert.date), 'yyyy年M月d日')}</div>
            </Link>
          ))}
        </div>
      ) : (
        <p>この曲はまだライブで披露されていません。</p>
      )}

    </div>
  );
}