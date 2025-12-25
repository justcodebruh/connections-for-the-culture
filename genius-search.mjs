#!/usr/bin/env node

const GENIUS_ACCESS_TOKEN = process.env.GENIUS_ACCESS_TOKEN;

if (!GENIUS_ACCESS_TOKEN) {
  console.error('Error: GENIUS_ACCESS_TOKEN not set');
  process.exit(1);
}

async function searchGenius(query) {
  const url = new URL('https://api.genius.com/search');
  url.searchParams.append('q', query);
  url.searchParams.append('per_page', '50');

  const response = await fetch(url.toString(), {
    headers: {
      'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
    }
  });

  return response.json();
}

async function main() {
  try {
    const searches = ['Beyoncé songs', 'Beyoncé', 'Beyonce'];
    const allSongs = new Set();
    
    for (const query of searches) {
      console.log(`Searching for: "${query}"`);
      const result = await searchGenius(query);
      
      if (result.response?.hits) {
        result.response.hits.forEach(hit => {
          if (hit.result.primary_artist?.name === 'Beyoncé' || hit.result.primary_artist?.name === 'Beyonce') {
            allSongs.add(hit.result.title);
          }
        });
      }
    }

    const songs = Array.from(allSongs).sort();
    
    console.log(`\n\nFound ${songs.length} unique Beyoncé songs:\n`);
    songs.forEach((title, i) => {
      console.log(`${i + 1}. ${title}`);
    });

    // Look for Christmas-themed words
    console.log('\n\n--- Songs with potential Christmas words ---');
    const christmasKeywords = ['STAR', 'RING', 'BELL', 'ANGEL', 'GIFT', 'SNOW', 'JOY', 'LIGHT', 'SPIRIT', 'MERRY', 'CAROL', 'TREE', 'SLEIGH', 'GOLD', 'SILVER', 'HEAVENLY', 'HOLLY', 'IVY', 'NOEL', 'SHINE', 'GLOW'];
    
    const matches = songs.filter(song => {
      const title = song.toUpperCase();
      return christmasKeywords.some(keyword => title.includes(keyword));
    });

    if (matches.length > 0) {
      matches.forEach(match => {
        console.log(`- ${match}`);
      });
    } else {
      console.log('No matches found with Christmas keywords');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
