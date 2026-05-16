export interface Artist {
    id: number;
    name: string;
    profile: string;
    is_deleted?: boolean;
}

export interface Person {
    id: number;
    name: string;
    profile?: string; // Optional profile for persons
    is_deleted?: boolean;
}

export interface Song {
    id: number;
    title: string;
    album_id: number;
    artist_id: number;
    lyricist_ids?: number[]; // Array of Person IDs
    composer_ids?: number[]; // Array of Person IDs
    arranger_ids?: number[]; // Array of Person IDs
    youtube_music_url?: string;
    is_deleted?: boolean;
    // Enriched properties
    performance_count?: number;
    last_performed_date?: string;
    last_performed_concert_id?: number;
}

export interface Album {
    id: number;
    title: string;
    release_date: string;
    is_deleted?: boolean;
}

export interface CoverSong {
    title: string;
    original_artist: string;
    lyricist?: string;
    composer?: string;
    arranger?: string;
    singers?: string; // For collaborative versions
    song_id?: number; // Link to internal song page if applicable
}

export enum SetlistItemType {
    MC = 0,
    Song = 1,
    Encore = 2,
    DoubleEncore = 3
}

export interface SetlistItem {
    type: SetlistItemType;
    content: number | CoverSong | string; // string for MC titles if needed
}

export interface Concert {
    id: number;
    title: string;
    date: string;
    venue_id: number;
    artist_id: number;
    setlist: SetlistItem[];
    is_incomplete?: boolean; // Flag for incomplete/uncertain setlist data
    is_deleted?: boolean;
}

export interface Venue {
    id: number;
    name: string;
    prefecture: string;
    address?: string;
    website?: string;
    capacity?: number | string;
    notes?: string;
    is_deleted?: boolean;
}