// Simple in-memory ratings store for demo purposes
// In a real app you'd persist this to a backend or local storage
const ratings = {};

export function getRatingForArtist(artistId) {
  return ratings[artistId] || null;
}

export function setRatingForArtist(artistId, value) {
  ratings[artistId] = value;
}

export default {
  getRatingForArtist,
  setRatingForArtist,
};
