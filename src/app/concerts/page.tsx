import { getConcerts, getVenues } from "@/lib/db"; // Assuming getVenues exists
import ConcertListClient from "./ConcertListClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '公演',
};

export default async function ConcertsPage() {
    const initialConcerts = await getConcerts();
    const initialVenues = await getVenues();

    return <ConcertListClient initialConcerts={initialConcerts} initialVenues={initialVenues} />;
}