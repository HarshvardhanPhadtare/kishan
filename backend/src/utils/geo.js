/**
 * Geospatial utilities
 * Haversine distance calculation used by the pesticide route to sort results
 * by proximity when the caller supplies latitude/longitude.
 */

/**
 * Converts degrees to radians.
 * @param {number} v  degrees
 * @returns {number} radians
 */
function toRad(v) {
  return v * Math.PI / 180;
}

/**
 * Returns the great-circle distance in kilometres between two coordinates
 * using the Haversine formula.
 *
 * @param {number} lat1
 * @param {number} lon1
 * @param {number} lat2
 * @param {number} lon2
 * @returns {number} distance in km
 */
function haversine(lat1, lon1, lat2, lon2) {
  const R    = 6371;
  const dLat = toRad(lat2 - lat1);
  const dLon = toRad(lon2 - lon1);
  const a    = Math.sin(dLat / 2) ** 2
             + Math.cos(toRad(lat1)) * Math.cos(toRad(lat2)) * Math.sin(dLon / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

module.exports = { haversine, toRad };
