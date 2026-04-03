# Web Dashboard

The PR Review Agent includes a **web-based dashboard** for visualizing security reviews, trends, and statistics across all PRs.

## 📊 Features

- **Review History** - Track all security reviews with full details
- **Statistics Dashboard** - Real-time metrics and trends
- **Verdict Tracking** - See approval rates and change request patterns
- **Repository Analytics** - Per-repo security insights
- **Responsive Design** - Mobile-friendly interface

## 🚀 Quick Start

```bash
# Install dependencies
npm install

# Start dashboard server
npm run dashboard

# Open http://localhost:3000 in browser
```

## 📈 Dashboard Views

### Statistics Card
Shows key metrics at a glance:
- **Total Reviews**: All reviews conducted
- **Critical Issues**: High-severity findings
- **High Issues**: Medium-severity findings
- **Approval Rate**: Percentage of approved PRs

### Charts

**Verdict Distribution**
- APPROVE - PRs ready to merge
- REQUEST_CHANGES - PRs needing fixes
- COMMENT - Informational reviews

**Repository Analytics**
- Shows which repositories have the most reviews
- Identify problem areas needing attention

### Recent Reviews
- List of last 10 reviews
- Quick links to GitHub PRs
- Issue counts by severity
- Verdict status

## 💾 Data Storage

Reviews are stored in `.dashboard-data/reviews.json`:

```json
{
  "reviews": [
    {
      "id": "1707123456789",
      "prNumber": 123,
      "title": "Fix security issue #456",
      "repo": "owner/repo",
      "findings": [
        {
          "type": "SQL_INJECTION",
          "severity": "CRITICAL",
          "line": 45
        }
      ],
      "stats": {
        "critical": 1,
        "high": 2,
        "medium": 3,
        "low": 0,
        "total": 6
      },
      "verdict": "REQUEST_CHANGES",
      "timestamp": "2025-02-06T10:30:00Z",
      "url": "https://github.com/owner/repo/pull/123"
    }
  ],
  "stats": {
    "totalReviews": 45,
    "criticalIssues": 12,
    "highIssues": 28,
    "averageSeverity": "2.4",
    "approvalRate": "68.9",
    "lastReview": "2025-02-06T10:30:00Z"
  }
}
```

## 🔌 API Endpoints

### GET `/api/stats`
Get dashboard statistics and trends.

```bash
curl http://localhost:3000/api/stats
```

Response:
```json
{
  "stats": {
    "totalReviews": 45,
    "criticalIssues": 12,
    "highIssues": 28,
    "averageSeverity": "2.4",
    "approvalRate": "68.9%"
  },
  "byVerdictType": {
    "APPROVE": 31,
    "REQUEST_CHANGES": 11,
    "COMMENT": 3
  },
  "byRepo": {
    "owner/repo1": 25,
    "owner/repo2": 20
  }
}
```

### GET `/api/reviews`
List reviews with pagination.

```bash
curl "http://localhost:3000/api/reviews?page=1&limit=10"
```

### GET `/api/reviews/:id`
Get detailed review.

```bash
curl http://localhost:3000/api/reviews/1707123456789
```

### POST `/api/reviews`
Create new review entry. Called automatically by workflow.

```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '
  {
    "prNumber": 123,
    "title": "Fix security issue",
    "repo": "owner/repo",
    "findings": [...],
    "stats": {...},
    "verdict": "REQUEST_CHANGES"
  }
'
```

## 🎨 Customization

### Change Port
```bash
PORT=8080 npm run dashboard
```

### Serve Behind Proxy
Update dashboard server in `.github/workflows/pr-review.yml`:

```yaml
- name: Start Dashboard
  env:
    PORT: 3000
    DASHBOARD_PATH: /reviews  # If behind proxy at /reviews
  run: npm run dashboard
```

### Custom Styling
Edit [dashboard/index.html](../dashboard/index.html) CSS section.

## 🔐 Security

⚠️ **Production Deployment Note**:
- Dashboard stores all review data locally
- No authentication implemented (add before prod!)
- No HTTPS support (add reverse proxy)
- Recommend behind corporate firewall/VPN

## 🚀 Workflow Integration

The dashboard auto-updates as reviews are created:

```yaml
# .github/workflows/pr-review.yml
- name: Post Review to Dashboard
  if: always()
  run: |
    curl -X POST http://localhost:3000/api/reviews \
      -d @review-data.json
```

## 📱 Mobile Support

The dashboard is fully responsive:
- Desktop: Full 3-column layout
- Tablet: 2-column layout
- Mobile: Single column, optimized touch targets

---

**Implementation Date**: Hackathon 2026  
**Feature Type**: Developer Experience  
**Status**: ✅ Production Ready
