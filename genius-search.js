#!/usr/bin/env node

/**
 * Genius API search for Beyoncé songs
 * Get your token from: https://genius.com/api-clients
 */

const https = require('https');

// Get token from command line or environment
const GENIUS_ACCESS_TOKEN = process.argv[2] || process.env.GENIUS_ACCESS_TOKEN;

if (!GENIUS_ACCESS_TOKEN) {
  console.error('Error: Genius access token required');
  console.error('Usage: node genius-search.js <access_token>');
  console.error('Or set GENIUS_ACCESS_TOKEN environment variable');
  console.error('\nGet your token at: https://genius.com/api-clients');
  process.exit(1);
}

function searchGenius(query) {
  return new Promise((resolve, reject) => {
    const url = new URL('https://api.genius.com/search');
    url.searchParams.append('q', query);

    const options = {
      headers: {
        'Authorization': `Bearer ${GENIUS_ACCESS_TOKEN}`
      }
    };

    https.get(url, options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          resolve(response);
        } catch (e) {
          reject(new Error(`Failed to parse response: ${e.message}`));
        }
      });
    }).on('error', reject);
  });
}

async function main() {
  try {
    console.log('Searching Genius for Beyoncé songs...\n');
    
    const result = await searchGenius('Beyoncé');
    
    if (result.response && result.response.hits) {
      const songs = result.response.hits
        .filter(hit => hit.result.primary_artist && hit.result.primary_artist.name === 'Beyoncé')
        .map(hit => ({
          title: hit.result.title,
          url: hit.result.url
        }))
        .slice(0, 50); // First 50 results

      console.log(`Found ${songs.length} songs:\n`);
      songs.forEach((song, i) => {
        console.log(`${i + 1}. ${song.title}`);
      });

      console.log('\n\n--- Potential Christmas-themed words ---');
      const christmasKeywords = ['STAR', 'RING', 'BELL', 'ANGEL', 'GIFT', 'SNOW', 'JOY', 'LIGHT', 'SPIRIT', 'MERRY', 'CAROL', 'TREE'];
      
      const matches = songs.filter(song => {
        const title = song.title.toUpperCase();
        return christmasKeywords.some(keyword => title.includes(keyword));
      });

      if (matches.length > 0) {
        console.log('\nMatches:');
        matches.forEach(match => {
          console.log(`- ${match.title}`);
        });
      } else {
        console.log('\nNo matches found with common Christmas keywords');
      }
    } else {
      console.error('No results found');
    }
  } catch (error) {
    console.error('Error:', error.message);
    process.exit(1);
  }
}

main();
