exports.handler = async (event) => {
  const GOOGLE_API_KEY = 'AIzaSyD4avN21d4mbuxLMdqFh-9ngvbMe0xMjL8';
  const { lat, lon } = event.queryStringParameters || {};
  if (!lat || !lon) return { statusCode: 400, body: 'Missing lat/lon' };

  const types = ['restaurant', 'meal_takeaway', 'convenience_store', 'gas_station'];
  const results = [];
  const seen = new Set();

  for (const type of types) {
    try {
      const url = `https://maps.googleapis.com/maps/api/place/nearbysearch/json?location=${lat},${lon}&radius=24140&type=${type}&key=${GOOGLE_API_KEY}`;
      const resp = await fetch(url);
      const data = await resp.json();
      if (data.results) {
        data.results.forEach(place => {
          if (!seen.has(place.place_id)) {
            seen.add(place.place_id);
            results.push({ name: place.name, lat: place.geometry.location.lat, lon: place.geometry.location.lng });
          }
        });
      }
    } catch(e) {}
  }

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': '*' },
    body: JSON.stringify({ results })
  };
};
