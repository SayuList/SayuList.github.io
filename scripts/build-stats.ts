import fs from 'fs/promises';
import path from 'path';
import { Song, Concert } from '../src/lib/types';

const RAW_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'raw');
const PROCESSED_DATA_PATH = path.join(__dirname, '..', 'src', 'data', 'processed');

async function readJsonFile<T>(filePath: string): Promise<T> {
  const fileContent = await fs.readFile(filePath, 'utf-8');
  return JSON.parse(fileContent);
}

async function buildStatistics() {
  console.log('Reading raw data...');
  const songs = await readJsonFile<Song[]>(path.join(RAW_DATA_PATH, 'songs.json'));
  const concerts = await readJsonFile<Concert[]>(path.join(RAW_DATA_PATH, 'concerts.json'));

  console.log('Calculating statistics for each song...');
  const enrichedSongs = songs.map(song => {
    let performance_count = 0;
    const performanceConcerts: Concert[] = [];

    concerts.forEach(concert => {
      let isPerformedInThisConcert = false;
      concert.setlist.forEach(item => {
        if (item.type !== 0 && typeof item.content === 'number' && item.content === song.id) {
          performance_count++;
          isPerformedInThisConcert = true;
        }
      });
      if (isPerformedInThisConcert) {
        performanceConcerts.push(concert);
      }
    });

    performanceConcerts.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    const lastPerformance = performanceConcerts[0] ?? null;

    return {
      ...song,
      performance_count,
      last_performed_date: lastPerformance?.date ?? undefined,
      last_performed_concert_id: lastPerformance?.id ?? undefined,
    };
  });

  console.log('Ensuring processed directory exists...');
  await fs.mkdir(PROCESSED_DATA_PATH, { recursive: true });

  const outputPath = path.join(PROCESSED_DATA_PATH, 'songs.enriched.json');
  console.log(`Writing enriched song data to ${outputPath}`);
  await fs.writeFile(outputPath, JSON.stringify(enrichedSongs, null, 2));

  console.log('Data processing complete!');
}

buildStatistics().catch(error => {
  console.error('An error occurred during data processing:', error);
  process.exit(1);
});
