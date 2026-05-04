"use client";

import Link from "next/link";
import { useState, useMemo } from "react";
import { Person, Song, Artist } from "@/lib/types";

interface ArtistListClientProps {
    allPersons: Person[];
    allSongs: Song[];
    mainArtist: Artist;
}

export default function ArtistListClient({ allPersons, allSongs, mainArtist }: ArtistListClientProps) {
    const [sortOrder, setSortOrder] = useState<string>('name-asc');
    const [filterText, setFilterText] = useState<string>('');

    const processedData = useMemo(() => {
        // Determine roles for each person and filter by search text
        const filteredPersons = allPersons.filter(person => 
            person.name.toLowerCase().includes(filterText.toLowerCase())
        );

        const personsWithRoles = filteredPersons.map(person => {
            let roles: string[] = [];
            if (person.id === mainArtist.id) {
                roles.push('歌手');
            }
            if (allSongs.some(song => song.lyricist_ids?.includes(person.id))) {
                roles.push('作詞');
            }
            if (allSongs.some(song => song.composer_ids?.includes(person.id))) {
                roles.push('作曲');
            }
            if (allSongs.some(song => song.arranger_ids?.includes(person.id))) {
                roles.push('編曲');
            }
            return { person, roles };
        });

        // Helper to sort and keep main artist at the top
        const sortList = (list: Person[]) => {
            const sorted = [...list].sort((a, b) => {
                if (sortOrder === 'name-asc') return a.name.localeCompare(b.name);
                return b.name.localeCompare(a.name);
            });
            
            // Move main artist to top if present
            const mainIdx = sorted.findIndex(p => p.id === mainArtist.id);
            if (mainIdx !== -1) {
                const [main] = sorted.splice(mainIdx, 1);
                sorted.unshift(main);
            }
            return sorted;
        };

        const getUniqueByRole = (role: string) => {
            const persons = personsWithRoles.filter(pwr => pwr.roles.includes(role)).map(pwr => pwr.person);
            return sortList(persons);
        };

        return {
            singers: getUniqueByRole('歌手'),
            lyricists: getUniqueByRole('作詞'),
            composers: getUniqueByRole('作曲'),
            arrangers: getUniqueByRole('編曲')
        };
    }, [allPersons, allSongs, mainArtist, sortOrder, filterText]);

    return (
        <div>
            <h1>クリエイター情報</h1>

            <div className="controls-container">
                <div>
                    <label htmlFor="sortOrder">並び替え: </label>
                    <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)}>
                        <option value="name-asc">名前順 (昇順)</option>
                        <option value="name-desc">名前順 (降順)</option>
                    </select>
                </div>
                <div>
                    <label htmlFor="filterText">絞り込み: </label>
                    <input
                        id="filterText"
                        type="text"
                        placeholder="名前で検索"
                        value={filterText}
                        onChange={(e) => setFilterText(e.target.value)}
                    />
                </div>
            </div>

            {processedData.singers.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>歌手</h2>
                    <div>
                        {processedData.singers.map(person => (
                            <Link key={person.id} href={`/persons/${person.id}`} className="list-item">
                                <span className="list-item-title">{person.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {processedData.lyricists.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>作詞</h2>
                    <div>
                        {processedData.lyricists.map(person => (
                            <Link key={person.id} href={`/persons/${person.id}`} className="list-item">
                                <span className="list-item-title">{person.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {processedData.composers.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>作曲</h2>
                    <div>
                        {processedData.composers.map(person => (
                            <Link key={person.id} href={`/persons/${person.id}`} className="list-item">
                                <span className="list-item-title">{person.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}

            {processedData.arrangers.length > 0 && (
                <div style={{ marginBottom: '1.5rem' }}>
                    <h2>編曲</h2>
                    <div>
                        {processedData.arrangers.map(person => (
                            <Link key={person.id} href={`/persons/${person.id}`} className="list-item">
                                <span className="list-item-title">{person.name}</span>
                            </Link>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
}
