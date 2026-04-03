#!/usr/bin/env node
/**
 * PR Review Dashboard - Lightweight Express server
 * Shows review history, statistics, and trends
 * Data storage: local JSON file for simplicity
 */

import express from 'express';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();
const PORT = process.env.PORT || 3000;
const DATA_FILE = path.join(__dirname, '../.dashboard-data/reviews.json');

// Middleware
app.use(express.json());
app.use(express.static(path.join(__dirname, '../dashboard')));

// Initialize data storage
function initializeData() {
  const dataDir = path.dirname(DATA_FILE);
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
  }
  if (!fs.existsSync(DATA_FILE)) {
    fs.writeFileSync(DATA_FILE, JSON.stringify({ reviews: [], stats: {} }, null, 2));
  }
}

// Load reviews from storage
function loadReviews() {
  try {
    const data = fs.readFileSync(DATA_FILE, 'utf8');
    return JSON.parse(data).reviews || [];
  } catch {
    return [];
  }
}

// Save reviews to storage
function saveReviews(reviews) {
  const stats = calculateStats(reviews);
  fs.writeFileSync(
    DATA_FILE,
    JSON.stringify({ reviews, stats }, null, 2)
  );
}

// Calculate statistics
function calculateStats(reviews) {
  if (!reviews.length) {
    return {
      totalReviews: 0,
      criticalIssues: 0,
      highIssues: 0,
      averageSeverity: 0,
      approvalRate: 0,
      lastReview: null,
    };
  }

  const stats = {
    totalReviews: reviews.length,
    criticalIssues: reviews.reduce((sum, r) => sum + (r.stats?.critical || 0), 0),
    highIssues: reviews.reduce((sum, r) => sum + (r.stats?.high || 0), 0),
    averageSeverity: (
      reviews.reduce((sum, r) => sum + (r.stats?.total || 0), 0) / reviews.length
    ).toFixed(1),
    approvalRate: (
      (reviews.filter(r => r.verdict === 'APPROVE').length / reviews.length) * 100
    ).toFixed(1),
    lastReview: reviews[reviews.length - 1]?.timestamp,
  };

  return stats;
}

// Routes

/**
 * GET /api/reviews
 * List all reviews with pagination
 */
app.get('/api/reviews', (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const reviews = loadReviews();

  const start = (page - 1) * limit;
  const end = start + limit;
  const paginatedReviews = reviews.slice(start, end);

  res.json({
    reviews: paginatedReviews.reverse(),
    total: reviews.length,
    page,
    pages: Math.ceil(reviews.length / limit),
  });
});

/**
 * GET /api/reviews/:id
 * Get detailed review
 */
app.get('/api/reviews/:id', (req, res) => {
  const reviews = loadReviews();
  const review = reviews.find(r => r.id === req.params.id);

  if (!review) {
    return res.status(404).json({ error: 'Review not found' });
  }

  res.json(review);
});

/**
 * POST /api/reviews
 * Create new review entry
 */
app.post('/api/reviews', (req, res) => {
  const { prNumber, title, repo, findings, stats, verdict } = req.body;

  if (!prNumber || !repo) {
    return res.status(400).json({ error: 'Missing required fields' });
  }

  const reviews = loadReviews();
  const review = {
    id: Date.now().toString(),
    prNumber,
    title: title || `PR #${prNumber}`,
    repo,
    findings: findings || [],
    stats: stats || { critical: 0, high: 0, medium: 0, low: 0, total: 0 },
    verdict: verdict || 'PENDING',
    timestamp: new Date().toISOString(),
    url: `https://github.com/${repo}/pull/${prNumber}`,
  };

  reviews.push(review);
  saveReviews(reviews);

  res.status(201).json(review);
});

/**
 * GET /api/stats
 * Dashboard statistics
 */
app.get('/api/stats', (req, res) => {
  const reviews = loadReviews();
  const stats = calculateStats(reviews);

  // Additional trends
  const byVerdictType = {
    APPROVE: reviews.filter(r => r.verdict === 'APPROVE').length,
    'REQUEST_CHANGES': reviews.filter(r => r.verdict === 'REQUEST_CHANGES').length,
    COMMENT: reviews.filter(r => r.verdict === 'COMMENT').length,
  };

  const byRepo = {};
  reviews.forEach(r => {
    byRepo[r.repo] = (byRepo[r.repo] || 0) + 1;
  });

  res.json({
    stats,
    byVerdictType,
    byRepo,
    recentReviews: reviews.slice(-5).reverse(),
  });
});

/**
 * GET /api/health
 * Health check
 */
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Start server
initializeData();

app.listen(PORT, () => {
  console.log(`\n📊 PR Review Dashboard`);
  console.log(`🚀 Server running at http://localhost:${PORT}`);
  console.log(`📈 API: http://localhost:${PORT}/api/stats`);
  console.log(`\n💾 Data stored at: ${DATA_FILE}`);
});
