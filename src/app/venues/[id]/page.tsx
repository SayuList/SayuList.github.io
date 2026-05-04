import { getVenueById, getVenues, getConcertsByVenueId } from "@/lib/db";
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
  const venue = await getVenueById(id);

  return {
    title: venue?.name ?? '会場情報',
  };
}

export async function generateStaticParams() {
    const venues = await getVenues();
    return venues.map((venue) => ({
        id: String(venue.id),
    }));
}

export default async function VenueDetailPage({ params }: Props) {
    const venue = await getVenueById(Number(params.id));
    if (!venue) {
        return <div>会場が見つかりません。</div>;
    }

    const concertsAtVenue = await getConcertsByVenueId(venue.id);

    return (
        <div>
            <h1>{venue.name}</h1>
      <dl className="detail-grid">
        <dt>国・都道府県</dt>
        <dd>{venue.prefecture}</dd>
        {venue.address && <><dt>住所</dt><dd>{venue.address}</dd></>}
        {venue.website && <><dt>公式サイト</dt><dd><a href={venue.website} target="_blank" rel="noopener noreferrer">{venue.website}</a></dd></>}
        {venue.capacity && <><dt>最大収容人数</dt><dd>{venue.capacity}</dd></>}
        {venue.notes && <><dt>備考</dt><dd>{venue.notes}</dd></>}
      </dl>

      <h2 style={{ marginTop: '2rem' }}>会場となったイベント</h2>
      {concertsAtVenue.length > 0 ? (
        <div>
          {concertsAtVenue.map(concert => (
            <Link href={`/concerts/${concert.id}`} key={concert.id} className="list-item">
              <div className="list-item-title">{concert.title}</div>
              <div className="list-item-meta">{format(new Date(concert.date), 'yyyy年M月d日')}</div>
            </Link>
          ))}
        </div>
      ) : (
        <p>この会場で開催されたイベントは見つかりませんでした。</p>
      )}
        </div>
    );
}