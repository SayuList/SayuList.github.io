"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Venue } from "@/lib/types";

interface VenueListClientProps {
  initialVenues: Venue[];
}

export default function VenueListClient({ initialVenues }: VenueListClientProps) {
  const [sortOrder, setSortOrder] = useState<string>('name-asc');
  const [filterText, setFilterText] = useState<string>('');

  const filteredAndSortedVenues = useMemo(() => {
    let items = [...initialVenues];

    // Filtering
    if (filterText) {
      items = items.filter(venue =>
        venue.name.toLowerCase().includes(filterText.toLowerCase()) ||
        venue.prefecture.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sorting
    switch (sortOrder) {
      case 'name-asc':
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'name-desc':
        items.sort((a, b) => b.name.localeCompare(a.name));
        break;
      default:
        items.sort((a, b) => a.name.localeCompare(b.name));
        break;
    }

    return items;
  }, [initialVenues, sortOrder, filterText]);

  return (
    <div>
      <h1>イベント会場一覧 ({filteredAndSortedVenues.length})</h1>

      <div className="controls-container">
        <div>
          <label htmlFor="sortOrder">並び替え: </label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="name-asc">会場名順 (昇順)</option>
            <option value="name-desc">会場名順 (降順)</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterText">絞り込み: </label>
          <input
            id="filterText"
            type="text"
            placeholder="会場名で検索"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div>
        {filteredAndSortedVenues.map((venue) => (
          <Link href={`/venues/${venue.id}`} key={venue.id} className="list-item">
            <div className="list-item-title">{venue.name}</div>
            <div className="list-item-meta">{venue.prefecture}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
