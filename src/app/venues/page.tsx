import { getVenues } from "@/lib/db";
import VenueListClient from "./VenueListClient";
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'イベント会場',
};

export default async function VenuesPage() {
    const venues = await getVenues();

    return <VenueListClient initialVenues={venues} />;
}
