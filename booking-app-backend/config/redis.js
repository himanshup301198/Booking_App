const { createClient } = require('redis');
require('dotenv').config();

let client = null;
let isConnected = false;

const initRedis = async () => {
  try {
    client = createClient({ 
      url: process.env.REDIS_URL || 'redis://127.0.0.1:6379',
      socket: {
        reconnectStrategy: false  
      }
    });

    client.on('error', (err) => { 
      isConnected = false; 
    });
    client.on('connect', () => { 
      console.log('[Redis] Connected'); 
      isConnected = true; 
    });

    await client.connect();
  } catch (err) {
    console.warn('[Redis] Not available — caching disabled');
    client = null;  
  }
};

// Safe wrappers — no-ops when Redis is down
const get = async (key) => {
  if (!client || !isConnected) return null;
  try { return await client.get(key); } catch { return null; }
};

const setEx = async (key, ttl, value) => {
  if (!client || !isConnected) return;
  try { await client.setEx(key, ttl, value); } catch { /* silent */ }
};

const del = async (key) => {
  if (!client || !isConnected) return;
  try { await client.del(key); } catch { /* silent */ }
};

module.exports = { initRedis, get, setEx, del };