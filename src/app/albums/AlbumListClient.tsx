"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Album } from "@/lib/types";
import { format } from 'date-fns';

interface AlbumListClientProps {
  initialAlbums: Album[];
}

export default function AlbumListClient({ initialAlbums }: AlbumListClientProps) {
  const [sortOrder, setSortOrder] = useState<string>('title-asc');
  const [filterText, setFilterText] = useState<string>('');

  const filteredAndSortedAlbums = useMemo(() => {
    let items = [...initialAlbums];

    // Filtering
    if (filterText) {
      items = items.filter(album =>
        album.title.toLowerCase().includes(filterText.toLowerCase())
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
      case 'date-desc':
        items.sort((a, b) => new Date(b.release_date).getTime() - new Date(a.release_date).getTime());
        break;
      case 'date-asc':
        items.sort((a, b) => new Date(a.release_date).getTime() - new Date(b.release_date).getTime());
        break;
      default:
        items.sort((a, b) => a.title.localeCompare(b.title));
        break;
    }

    return items;
  }, [initialAlbums, sortOrder, filterText]);

  return (
    <div>
      <h1>アルバム一覧 ({filteredAndSortedAlbums.length})</h1>

      <div className="controls-container">
        <div>
          <label htmlFor="sortOrder">並び替え: </label>
          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
            <option value="title-asc">アルバム名 (昇順)</option>
            <option value="title-desc">アルバム名 (降順)</option>
            <option value="date-desc">発売日 (新しい順)</option>
            <option value="date-asc">発売日 (古い順)</option>
          </select>
        </div>
        <div>
          <label htmlFor="filterText">絞り込み: </label>
          <input
            id="filterText"
            type="text"
            placeholder="アルバム名で検索"
            value={filterText}
            onChange={(e) => setFilterText(e.target.value)}
          />
        </div>
      </div>

      <div>
        {filteredAndSortedAlbums.map((album) => (
          <Link href={`/albums/${album.id}`} key={album.id} className="list-item">
            <div className="list-item-title">{album.title}</div>
            <div className="list-item-meta">発売日: {format(new Date(album.release_date), 'yyyy/MM/dd')}</div>
          </Link>
        ))}
      </div>
    </div>
  );
}
