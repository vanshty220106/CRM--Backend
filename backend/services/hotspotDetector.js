/**
 * Hotspot Detection Service
 *
 * Sliding-window logic to detect complaint surges per category.
 * If any category receives >= THRESHOLD complaints within WINDOW_MS,
 * it is flagged as a hotspot.
 */

const WINDOW_MS    = 60 * 60 * 1000;  // 60 minutes — full sliding window
const HOTSPOT_MS   = 10 * 60 * 1000;  // 10 minutes — hotspot detection window
const THRESHOLD    = 5;                // number of complaints to trigger hotspot

// In-memory store: { category: [{ timestamp, title, mlConfidence }] }
const categoryRecords = {};

/**
 * Record a new complaint in the sliding window.
 *
 * @param {string} category - The ML-classified category
 * @param {string} title    - Complaint title (for display)
 * @param {number} confidence - ML confidence score
 * @returns {{ isHotspot: boolean, count: number, category: string }}
 */
function recordComplaint(category, title = '', confidence = 0) {
  if (!category) return { isHotspot: false, count: 0, category: '' };

  if (!categoryRecords[category]) {
    categoryRecords[category] = [];
  }

  const now = Date.now();

  // Add the new complaint
  categoryRecords[category].push({
    timestamp: now,
    title,
    mlConfidence: confidence,
  });

  // Prune entries older than the full window (60 min)
  categoryRecords[category] = categoryRecords[category].filter(
    (entry) => now - entry.timestamp < WINDOW_MS
  );

  // Check hotspot within the 10-minute window
  const recentCount = categoryRecords[category].filter(
    (entry) => now - entry.timestamp < HOTSPOT_MS
  ).length;

  return {
    isHotspot: recentCount >= THRESHOLD,
    count: recentCount,
    category,
  };
}

/**
 * Get frequency stats for all categories (last 60 minutes).
 * Used to power the dashboard charts.
 *
 * @returns {Array<{ category: string, count: number, recentCount: number }>}
 */
function getFrequencyStats() {
  const now = Date.now();
  const stats = [];

  for (const [category, records] of Object.entries(categoryRecords)) {
    // Prune old entries
    categoryRecords[category] = records.filter(
      (entry) => now - entry.timestamp < WINDOW_MS
    );

    const total = categoryRecords[category].length;
    const recent = categoryRecords[category].filter(
      (entry) => now - entry.timestamp < HOTSPOT_MS
    ).length;

    stats.push({
      category,
      count: total,
      recentCount: recent,
      isHotspot: recent >= THRESHOLD,
    });
  }

  return stats;
}

/**
 * Get recent complaints across all categories (for live feed).
 *
 * @param {number} limit - Max number of recent entries to return
 * @returns {Array}
 */
function getRecentComplaints(limit = 20) {
  const all = [];
  for (const [category, records] of Object.entries(categoryRecords)) {
    for (const record of records) {
      all.push({ ...record, category });
    }
  }
  return all
    .sort((a, b) => b.timestamp - a.timestamp)
    .slice(0, limit);
}

module.exports = {
  recordComplaint,
  getFrequencyStats,
  getRecentComplaints,
  THRESHOLD,
  HOTSPOT_MS,
  WINDOW_MS,
};
