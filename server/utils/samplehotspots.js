module.exports = [
  { name: 'Jakarta Bay, Indonesia', lat: -6.0, lng: 106.8, score: 92, count: 14 },
  { name: 'Philippines, Visayan Sea', lat: 10.3, lng: 123.9, score: 88, count: 11 },
  { name: 'Kingston Harbour, Jamaica', lat: 17.9, lng: -76.8, score: 84, count: 7 },
  { name: 'Persian Gulf, UAE', lat: 25.3, lng: 55.0, score: 82, count: 9 },
  { name: 'Hainan Island, China', lat: 18.2, lng: 109.7, score: 79, count: 6 },
  { name: 'Cancun, Mexico', lat: 21.2, lng: -86.8, score: 77, count: 8 },
  { name: 'Gulf of Thailand', lat: 12.5, lng: 100.5, score: 74, count: 10 },
  { name: 'Gulf of Mannar, India', lat: 9.0, lng: 79.1, score: 71, count: 5 },
  { name: 'Florida Keys, USA', lat: 24.7, lng: -81.0, score: 70, count: 12 },
  { name: 'Great Barrier Reef, central', lat: -18.3, lng: 147.0, score: 68, count: 16 },
  { name: 'Maldives, Male atoll', lat: 4.2, lng: 73.5, score: 66, count: 6 },
  { name: 'Santos, Brazil', lat: -24.0, lng: -46.3, score: 63, count: 4 },
  { name: 'Hurghada, Red Sea', lat: 27.2, lng: 33.8, score: 60, count: 7 },
  { name: 'Mombasa, Kenya', lat: -4.1, lng: 39.7, score: 57, count: 5 },
  { name: 'Oahu, Hawaii', lat: 21.4, lng: -157.8, score: 50, count: 6 },
  { name: 'Tuamotu, French Polynesia', lat: -17.5, lng: -145.0, score: 28, count: 3 },
].map((h, i) => ({ id: `sample-${i}`, ...h }));
 