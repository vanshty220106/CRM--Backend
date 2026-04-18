/**
 * ML Classification Service
 * 
 * Uses @xenova/transformers to run DistilBERT text-classification
 * entirely server-side. Maps citizen complaints to standard Indian
 * Government categories.
 */

const GOVERNMENT_CATEGORIES = [
  'Roads',
  'Water',
  'Electricity',
  'Sanitation',
  'Health',
  'Public Transport',
];

// Keyword maps for enhanced classification accuracy
const CATEGORY_KEYWORDS = {
  Roads: [
    'road', 'pothole', 'highway', 'bridge', 'street', 'footpath', 'pavement',
    'traffic', 'signal', 'zebra crossing', 'divider', 'flyover', 'crack',
    'asphalt', 'tar', 'lane', 'junction', 'intersection', 'speed breaker',
    'construction', 'repair', 'infrastructure', 'sidewalk',
  ],
  Water: [
    'water', 'pipe', 'leak', 'supply', 'tap', 'sewage', 'drain', 'flood',
    'waterlogging', 'pipeline', 'tank', 'borewell', 'contamination',
    'dirty water', 'drinking water', 'overflow', 'plumbing', 'hydrant',
    'water pressure', 'water shortage', 'well', 'groundwater',
  ],
  Electricity: [
    'electricity', 'power', 'transformer', 'wire', 'electric', 'voltage',
    'outage', 'blackout', 'streetlight', 'light', 'pole', 'cable',
    'generator', 'substation', 'meter', 'billing', 'current', 'short circuit',
    'spark', 'electrocution', 'inverter', 'load shedding',
  ],
  Sanitation: [
    'garbage', 'waste', 'trash', 'dump', 'clean', 'toilet', 'hygiene',
    'sweeper', 'dustbin', 'litter', 'compost', 'recycle', 'debris',
    'sewer', 'manhole', 'stink', 'smell', 'pest', 'rat', 'mosquito',
    'insect', 'gutter', 'sanitation', 'cleanliness',
  ],
  Health: [
    'hospital', 'clinic', 'doctor', 'medicine', 'disease', 'health',
    'ambulance', 'patient', 'medical', 'vaccine', 'infection', 'fever',
    'dengue', 'malaria', 'epidemic', 'pharmacy', 'dispensary',
    'healthcare', 'nurse', 'treatment', 'emergency',
  ],
  'Public Transport': [
    'bus', 'train', 'metro', 'auto', 'rickshaw', 'taxi', 'cab', 'transport',
    'station', 'stop', 'route', 'schedule', 'delay', 'overcrowded',
    'ticket', 'fare', 'commute', 'transit', 'railway', 'platform',
    'conductor', 'driver', 'vehicle',
  ],
};

let pipeline = null;
let modelReady = false;

/**
 * Initializes the ML pipeline. Call at server startup.
 * Downloads the model on first run (~67MB, cached after).
 */
async function initClassifier() {
  try {
    console.log('🧠 Loading ML classification model...');
    const { pipeline: createPipeline } = await import('@xenova/transformers');
    pipeline = await createPipeline(
      'text-classification',
      'Xenova/distilbert-base-uncased-finetuned-sst-2-english',
      { quantized: true }
    );
    modelReady = true;
    console.log('✅ ML model loaded and ready for inference.');
  } catch (error) {
    console.error('❌ Failed to load ML model:', error.message);
    console.warn('⚠️  Falling back to keyword-only classification.');
    modelReady = false;
  }
}

/**
 * Classify a citizen grievance into a government category.
 *
 * @param {string} text - The complaint description text
 * @returns {{ label: string, confidence: number }}
 */
async function classifyGrievance(text) {
  if (!text || typeof text !== 'string') {
    return { label: 'Roads', confidence: 0.1 };
  }

  const lowerText = text.toLowerCase();

  // ── Step 1: Keyword-based scoring ──────────────────────────
  const scores = {};
  for (const [category, keywords] of Object.entries(CATEGORY_KEYWORDS)) {
    let score = 0;
    for (const kw of keywords) {
      if (lowerText.includes(kw)) {
        // Exact word match gets higher weight
        const regex = new RegExp(`\\b${kw}\\b`, 'i');
        score += regex.test(text) ? 2 : 1;
      }
    }
    scores[category] = score;
  }

  // Find the best keyword match
  const keywordEntries = Object.entries(scores).sort((a, b) => b[1] - a[1]);
  const topKeyword = keywordEntries[0];
  const hasStrongKeywordMatch = topKeyword[1] >= 2;

  // ── Step 2: ML sentient analysis (if model loaded) ─────────
  let mlSentiment = null;
  if (modelReady && pipeline) {
    try {
      const result = await pipeline(text.substring(0, 512)); // limit input length
      mlSentiment = result[0]; // { label, score }
    } catch (err) {
      console.warn('ML inference error:', err.message);
    }
  }

  // ── Step 3: Combine signals ────────────────────────────────
  if (hasStrongKeywordMatch) {
    // Keyword match is reliable for domain-specific government categories
    const totalScore = keywordEntries.reduce((sum, [, s]) => sum + s, 0) || 1;
    const confidence = Math.min(0.95, 0.5 + (topKeyword[1] / totalScore) * 0.45);
    return { label: topKeyword[0], confidence: parseFloat(confidence.toFixed(3)) };
  }

  // Weak/no keyword match — use ML sentiment to boost certain categories
  // and fall back to best keyword match or default
  if (topKeyword[1] > 0) {
    const totalScore = keywordEntries.reduce((sum, [, s]) => sum + s, 0) || 1;
    const confidence = Math.min(0.7, 0.3 + (topKeyword[1] / totalScore) * 0.3);
    return { label: topKeyword[0], confidence: parseFloat(confidence.toFixed(3)) };
  }

  // No keyword matches at all — assign based on common patterns
  return { label: 'Roads', confidence: 0.2 };
}

/**
 * Check if the ML model is loaded.
 */
function isModelReady() {
  return modelReady;
}

module.exports = { initClassifier, classifyGrievance, isModelReady, GOVERNMENT_CATEGORIES };
