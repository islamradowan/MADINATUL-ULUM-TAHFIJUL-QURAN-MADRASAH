const https = require('https');

const FALLBACK_RATE   = 9500;   // BDT per gram fallback
const VORI_IN_GRAMS   = 11.664; // 1 vori = 11.664 grams (Bangladesh standard)
const CACHE_TTL_MS    = 60 * 60 * 1000; // cache 1 hour to save API quota

let cache = { rate: null, fetchedAt: null };

function fetchFromGoldAPI() {
  return new Promise((resolve, reject) => {
    const options = {
      hostname: 'www.goldapi.io',
      path:     '/api/XAU/BDT',
      method:   'GET',
      headers:  { 'x-access-token': process.env.GOLD_API_KEY, 'Content-Type': 'application/json' },
    };
    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => { body += chunk; });
      res.on('end', () => {
        try {
          const data = JSON.parse(body);
          const rate = data?.price_gram_24k;
          if (!rate) return reject(new Error('Invalid response'));
          resolve(Math.round(rate));
        } catch { reject(new Error('Parse error')); }
      });
    });
    req.on('error', reject);
    req.setTimeout(8000, () => { req.destroy(); reject(new Error('Timeout')); });
    req.end();
  });
}

// GET /api/gold-price
const getGoldPrice = async (req, res) => {
  // Serve from cache if fresh
  if (cache.rate && cache.fetchedAt && (Date.now() - cache.fetchedAt) < CACHE_TTL_MS) {
    return res.json({
      ratePerGram:  cache.rate,
      ratePerVori:  Math.round(cache.rate * VORI_IN_GRAMS),
      voriInGrams:  VORI_IN_GRAMS,
      source:       'live',
      cachedAt:     new Date(cache.fetchedAt).toISOString(),
    });
  }

  try {
    const rate = await fetchFromGoldAPI();
    cache = { rate, fetchedAt: Date.now() };
    res.json({
      ratePerGram:  rate,
      ratePerVori:  Math.round(rate * VORI_IN_GRAMS),
      voriInGrams:  VORI_IN_GRAMS,
      source:       'live',
      cachedAt:     new Date(cache.fetchedAt).toISOString(),
    });
  } catch {
    res.json({
      ratePerGram:  FALLBACK_RATE,
      ratePerVori:  Math.round(FALLBACK_RATE * VORI_IN_GRAMS),
      voriInGrams:  VORI_IN_GRAMS,
      source:       'fallback',
      cachedAt:     null,
    });
  }
};

module.exports = { getGoldPrice };
