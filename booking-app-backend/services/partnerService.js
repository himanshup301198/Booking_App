const pool        = require('../config/db');
const redisCache  = require('../config/redis');
require('dotenv').config();

const CACHE_TTL = parseInt(process.env.PARTNERS_CACHE_TTL) || 60;

const getAvailablePartners = async (city) => {
  const cacheKey = `partners:${city.toLowerCase()}`;

  // Step 1: Check Redis cache
  const cached = await redisCache.get(cacheKey);
  if (cached) {
    console.log(`[Cache HIT] ${cacheKey}`);
    return JSON.parse(cached);
  }

  console.log(`[Cache MISS] ${cacheKey}`);

  // Step 2: Query DB
  const result = await pool.query(
    `SELECT id, name, city, status, active_bookings
     FROM   partners
     WHERE  city = $1 AND status = 'available'
     ORDER  BY active_bookings ASC, id ASC`,
    [city]
  );

  const partners = result.rows;

  // Step 3: Store in cache
  await redisCache.setEx(cacheKey, CACHE_TTL, JSON.stringify(partners));

  return partners;
};

/**
 * @param {object} client - pg transaction client
 * @param {string} city
 * @returns {object} partner row
 */
const selectBestPartner = async (client, city) => {
  const result = await client.query(
    `SELECT id, name, city, active_bookings
     FROM   partners
     WHERE  city = $1 AND status = 'available'
     ORDER  BY active_bookings ASC, id ASC
     LIMIT  1
     FOR UPDATE SKIP LOCKED`,
    [city]
  );

  if (result.rows.length === 0) {
    throw new Error('No available partner found in your city');
  }

  return result.rows[0];
};

// Invalidate partner cache for a city.

const invalidatePartnerCache = async (city) => {
  const cacheKey = `partners:${city.toLowerCase()}`;
  await redisCache.del(cacheKey);
  console.log(`[Cache INVALIDATED] ${cacheKey}`);
};

module.exports = { getAvailablePartners, selectBestPartner, invalidatePartnerCache };