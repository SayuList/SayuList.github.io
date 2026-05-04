"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Concert, Venue } from "@/lib/types";
import { format } from 'date-fns';

interface ConcertListClientProps {
    initialConcerts: Concert[];
    initialVenues: Venue[];
}

export default function ConcertListClient({ initialConcerts, initialVenues }: ConcertListClientProps) {
    const [sortOrder, setSortOrder] = useState<string>('date-desc');
    const [selectedYear, setSelectedYear] = useState<string>('all');

    const getVenueName = (venueId: number) => {
        return initialVenues.find(v => v.id === venueId)?.name ?? '不明な会場';
    };

    const availableYears = useMemo(() => {
        const years = new Set(initialConcerts.map(c => new Date(c.date).getFullYear().toString()));
        return ['all', ...Array.from(years).sort((a, b) => b.localeCompare(a))];
    }, [initialConcerts]);

    const filteredAndSortedConcerts = useMemo(() => {
        let items = [...initialConcerts];

        // Filtering
        if (selectedYear !== 'all') {
            items = items.filter(c => new Date(c.date).getFullYear().toString() === selectedYear);
        }

        // Sorting
        switch (sortOrder) {
            case 'date-desc':
                items.sort((a, b) => {
                    const dateDiff = new Date(b.date).getTime() - new Date(a.date).getTime();
                    if (dateDiff !== 0) return dateDiff;
                    return b.id - a.id; // Newest first: higher ID (Night) comes first
                });
                break;
            case 'date-asc':
                items.sort((a, b) => {
                    const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
                    if (dateDiff !== 0) return dateDiff;
                    return a.id - b.id; // Oldest first: lower ID (Day) comes first
                });
                break;
            case 'title-asc':
                items.sort((a, b) => a.title.localeCompare(b.title));
                break;
            case 'title-desc':
                items.sort((a, b) => b.title.localeCompare(a.title));
                break;
            default:
                // Default sort is by date descending
                items.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
                break;
        }

        return items;
    }, [initialConcerts, sortOrder, selectedYear]);

    return (
        <div>
            <h1>公演一覧 ({filteredAndSortedConcerts.length})</h1>

            <div className="controls-container">
        <div>
          <label htmlFor="sortOrder">並び替え: </label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="date-desc">公演日 (新しい順)</option>
            <option value="date-asc">公演日 (古い順)</option>
            <option value="title-asc">公演名 (昇順)</option>
            <option value="title-desc">公演名 (降順)</option>
          </select>
        </div>
        <div>
          <label htmlFor="yearFilter">年で絞り込み: </label>
          <select id="yearFilter" value={selectedYear} onChange={(e) => setSelectedYear(e.target.value)}>
            {availableYears.map(year => (
              <option key={year} value={year}>{year === 'all' ? 'すべて' : `${year}年`}</option>
            ))}
          </select>
        </div>
      </div>

      <div>
        {filteredAndSortedConcerts.map((concert) => (
          <Link href={`/concerts/${concert.id}`} key={concert.id} className="list-item">
            <div>
                <span className="list-item-title">{concert.title}</span>
            </div>
            <div className="list-item-meta">
              {format(new Date(concert.date), 'yyyy年M月d日')}
              <span style={{ margin: '0 8px' }}>|</span>
              {getVenueName(concert.venue_id)}
            </div>
          </Link>
        ))}
      </div>
        </div>
    );
}
