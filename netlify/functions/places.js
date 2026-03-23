exports.handler = async (event) => {
  const GOOGLE_API_KEY = process.env.GOOGLE_API_KEY;
  const { lat, lon } = event.queryStringParameters || {};
  if (!lat || !lon) return { statusCode: 400, body: 'Missing lat/lon' };

  const results = [];
  const seen = new Set();

  const chains = [
    "McDonald's", "Taco Bell", "Subway", "Burger King", "Wendy's",
    "Chick-fil-A", "Popeyes", "KFC", "Panda Express", "Chipotle",
    "Little Caesars", "Domino's", "Arby's", "Sonic", "Dairy Queen",
    "Hardee's", "Wingstop", "Panera Bread", "IHOP", "Starbucks",
    "Casey's", "Huck's", "7-Eleven", "Thorntons"
  ];

  for (const chain of chains) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?keyword=${encodeURIComponent(chain)}&location=${lat},${lon}&rankby=distance&key=${GOOGLE_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.results && data.results.length > 0) {
        const place = data.results[0]; // closest one
        if (!seen.has(place.place_id)) {
          seen.add(place.place_id);
          results.push({
            name: chain,
            lat: place.geometry.location.lat,
            lon: place.geometry.location.lng
          });
        }
      }
    } catch(e) {}
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ results })
  };
};
