"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Song } from "@/lib/types";
import { format } from 'date-fns';

interface SongListClientProps {
  initialSongs: Song[];
}

export default function SongListClient({ initialSongs }: SongListClientProps) {
  const [sortOrder, setSortOrder] = useState<string>('title-asc');
  const [filterText, setFilterText] = useState<string>('');

  const filteredAndSortedSongs = useMemo(() => {
    let items = [...initialSongs];

    // Filtering
    if (filterText) {
      items = items.filter(song =>
        song.title.toLowerCase().includes(filterText.toLowerCase())
      );
    }

    // Sorting
    switch (sortOrder) {
      case 'title-asc':
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
      case 'title-desc':
        items.sort((a, b) => b.title.localeCompare(a.title));
        break;
      case 'last-performed-desc':
        items.sort((a, b) => {
          if (!a.last_performed_date) return -1; // nulls last
          if (!b.last_performed_date) return 1;  // nulls last
          return new Date(b.last_performed_date).getTime() - new Date(a.last_performed_date).getTime();
        });
        break;
      case 'last-performed-asc':
        items.sort((a, b) => {
          if (!a.last_performed_date) return 1;  // nulls last
          if (!b.last_performed_date) return -1; // nulls last
          return new Date(a.last_performed_date).getTime() - new Date(b.last_performed_date).getTime();
        });
        break;
      case 'performance-count-desc':
        items.sort((a, b) => (b.performance_count ?? 0) - (a.performance_count ?? 0));
        break;
      case 'performance-count-asc':
        items.sort((a, b) => (a.performance_count ?? 0) - (b.performance_count ?? 0));
        break;
      case 'default':
      default:
        // Default sort is by title ascending
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return items;
  }, [initialSongs, sortOrder, filterText]);

  return (
    <div>
      <h1>楽曲一覧 ({filteredAndSortedSongs.length})</h1>

      <div className="controls-container">
        <div>
          <label htmlFor="sortOrder">並び替え: </label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="title-asc">曲名 (昇順)</option>
            <option value="title-desc">曲名 (降順)</option>
            <option value="last-performed-desc">最終披露日 (新しい順)</option>
            <option value="last-performed-asc">最終披露日 (古い順)</option>
            <option value="performance-count-desc">披露回数 (多い順)</option>
            <option value="performance-count-asc">披露回数 (少ない順)</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterText">絞り込み: </label>
          <input
            id="filterText"
            type="text"
            placeholder="曲名で検索"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div>
        {filteredAndSortedSongs.map((song) => (
          <Link href={`/songs/${song.id}`} key={song.id} className="list-item">
            <div className="list-item-title">{song.title}</div>
            <div className="list-item-meta">
              披露回数: {song.performance_count ?? 0}回
              <span style={{ margin: '0 8px' }}>|</span>
              最終披露日: {song.last_performed_date ? format(new Date(song.last_performed_date), 'yyyy/MM/dd') : '記録なし'}
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
