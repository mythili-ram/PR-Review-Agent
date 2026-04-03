#!/usr/bin/env node
/**
 * ML-Based Code Anomaly Detection
 * Detects unusual code patterns using statistical analysis
 * 
 * Features:
 * - Function complexity analysis
 * - Unusual control flow patterns
 * - Code smell detection
 * - Entropy-based anomaly scoring
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

/**
 * Code Metrics Extractor
 */
class CodeMetrics {
  constructor(code) {
    this.code = code;
    this.lines = code.split('\n');
  }

  // Count cyclomatic complexity
  getCyclomaticComplexity() {
    let complexity = 1;
    const keywords = /\b(if|else|for|while|do|switch|case|catch|&&|\|\||\?)\b/g;
    const matches = this.code.match(keywords) || [];
    complexity += matches.length;
    return complexity;
  }

  // Measure function length
  getFunctionLengths() {
    const functions = this.code.match(/function\s+\w+|=>|const\s+\w+\s*=\s*(?:async\s*)?\(/g) || [];
    return {
      count: functions.length,
      avgLength: this.lines.length / Math.max(functions.length, 1),
    };
  }

  // Count nesting depth
  getNestingDepth() {
    let maxDepth = 0;
    let currentDepth = 0;
    for (const char of this.code) {
      if (char === '{' || char === '[' || char === '(') currentDepth++;
      if (char === '}' || char === ']' || char === ')') currentDepth--;
      maxDepth = Math.max(maxDepth, currentDepth);
    }
    return maxDepth;
  }

  // Detect code patterns
  getCodePatterns() {
    const patterns = {
      hasLongLines: this.lines.some(line => line.length > 120),
      hasManyVariables: (this.code.match(/\b(?:let|const|var)\b/g) || []).length > 20,
      hasManyComments: (this.code.match(/\/\//g) || []).length / this.lines.length > 0.3,
      hasDeepNesting: this.getNestingDepth() > 5,
      hasHighComplexity: this.getCyclomaticComplexity() > 10,
      hasMagicNumbers: /\b(?:[1-9]\d{3,}|0x[0-9a-f]+)\b/gi.test(this.code),
      hasWeakCrypto: /(?:MD5|SHA1|DES|RC4)/i.test(this.code),
      hasUnsafeRegex: /\(.*\*.*\*\)/g.test(this.code),
      hasGlobalState: /\bglobal\.|window\.|this\s*=/g.test(this.code),
      hasTooManyParameters: /function\s*\([^)]{100,}\)|=>\s*\([^)]{100,}\)/.test(this.code),
    };
    return patterns;
  }

  // Calculate entropy (indicator of randomness/obfuscation)
  calculateEntropy() {
    const freq = {};
    for (const char of this.code) {
      freq[char] = (freq[char] || 0) + 1;
    }

    let entropy = 0;
    const len = this.code.length;
    for (const count of Object.values(freq)) {
      const p = count / len;
      entropy -= p * Math.log2(p);
    }

    return entropy;
  }

  // Get all metrics
  getAllMetrics() {
    return {
      lineCount: this.lines.length,
      complexity: this.getCyclomaticComplexity(),
      ...this.getFunctionLengths(),
      nestingDepth: this.getNestingDepth(),
      entropy: this.calculateEntropy().toFixed(2),
      patterns: this.getCodePatterns(),
    };
  }
}

/**
 * Anomaly Detector
 */
class AnomalyDetector {
  constructor() {
    this.baselineMetrics = {
      complexity: { mean: 3, stdDev: 2 },
      nestingDepth: { mean: 3, stdDev: 1.5 },
      entropy: { mean: 4.5, stdDev: 0.8 },
      lineCount: { mean: 50, stdDev: 40 },
    };
  }

  /**
   * Calculate Z-score (how many std devs from mean)
   */
  calculateZScore(value, mean, stdDev) {
    if (stdDev === 0) return 0;
    return Math.abs((value - mean) / stdDev);
  }

  /**
   * Detect anomalies in code metrics
   */
  detectAnomalies(metrics) {
    const anomalies = [];
    const scores = {};

    // Complexity anomaly
    const complexityZ = this.calculateZScore(
      metrics.complexity,
      this.baselineMetrics.complexity.mean,
      this.baselineMetrics.complexity.stdDev
    );
    scores.complexity = complexityZ;
    if (complexityZ > 2.5) {
      anomalies.push({
        type: 'HIGH_COMPLEXITY',
        severity: complexityZ > 3.5 ? 'CRITICAL' : 'HIGH',
        score: complexityZ.toFixed(2),
        message: `Cyclomatic complexity (${metrics.complexity}) is unusually high`,
        recommendation: 'Refactor into smaller functions',
      });
    }

    // Nesting depth anomaly
    const nestingZ = this.calculateZScore(
      metrics.nestingDepth,
      this.baselineMetrics.nestingDepth.mean,
      this.baselineMetrics.nestingDepth.stdDev
    );
    scores.nesting = nestingZ;
    if (nestingZ > 2) {
      anomalies.push({
        type: 'DEEP_NESTING',
        severity: 'MEDIUM',
        score: nestingZ.toFixed(2),
        message: `Deep nesting level (${metrics.nestingDepth}) detected`,
        recommendation: 'Use guard clauses instead of nested conditions',
      });
    }

    // Entropy anomaly (possible obfuscation)
    const entropyZ = this.calculateZScore(
      parseFloat(metrics.entropy),
      this.baselineMetrics.entropy.mean,
      this.baselineMetrics.entropy.stdDev
    );
    scores.entropy = entropyZ;
    if (entropyZ > 2) {
      anomalies.push({
        type: 'UNUSUAL_ENTROPY',
        severity: 'MEDIUM',
        score: entropyZ.toFixed(2),
        message: 'Code entropy suggests possible obfuscation or minified code',
        recommendation: 'Verify code is intentionally complex',
      });
    }

    // Line count anomaly
    const lineZ = this.calculateZScore(
      metrics.lineCount,
      this.baselineMetrics.lineCount.mean,
      this.baselineMetrics.lineCount.stdDev
    );
    if (lineZ > 2) {
      anomalies.push({
        type: 'LARGE_CHANGE',
        severity: 'LOW',
        score: lineZ.toFixed(2),
        message: `Large change detected (${metrics.lineCount} lines)`,
        recommendation: 'Consider breaking into smaller changes',
      });
    }

    // Pattern-based anomalies
    if (metrics.patterns.hasDeepNesting) {
      anomalies.push({
        type: 'NESTED_CONTROL_FLOW',
        severity: 'MEDIUM',
        score: '2.0',
        message: 'Multiple levels of nested control structures detected',
        recommendation: 'Simplify control flow logic',
      });
    }

    if (metrics.patterns.hasUnsafeRegex) {
      anomalies.push({
        type: 'UNSAFE_REGEX',
        severity: 'HIGH',
        score: '3.0',
        message: 'Regex pattern vulnerable to ReDoS (Regular Expression Denial of Service)',
        recommendation: 'Use simpler regex or input validation',
      });
    }

    if (metrics.patterns.hasWeakCrypto) {
      anomalies.push({
        type: 'WEAK_CRYPTO',
        severity: 'CRITICAL',
        score: '4.0',
        message: 'Uses deprecated/weak cryptographic algorithm',
        recommendation: 'Use modern algorithms (SHA-256, AES)',
      });
    }

    if (metrics.patterns.hasMagicNumbers) {
      anomalies.push({
        type: 'MAGIC_NUMBERS',
        severity: 'LOW',
        score: '1.0',
        message: 'Magic numbers without explanation',
        recommendation: 'Replace with named constants',
      });
    }

    if (metrics.patterns.hasTooManyParameters) {
      anomalies.push({
        type: 'TOO_MANY_PARAMETERS',
        severity: 'MEDIUM',
        score: '2.0',
        message: 'Function has too many parameters',
        recommendation: 'Use object parameters or split into smaller functions',
      });
    }

    return anomalies;
  }

  /**
   * Get anomaly summary
   */
  getSummary(anomalies) {
    const byType = {};
    const bySeverity = { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 };

    anomalies.forEach(a => {
      byType[a.type] = (byType[a.type] || 0) + 1;
      bySeverity[a.severity]++;
    });

    return {
      total: anomalies.length,
      byType,
      bySeverity,
      riskLevel: this.calculateRiskLevel(bySeverity),
    };
  }

  /**
   * Calculate overall risk level
   */
  calculateRiskLevel(bySeverity) {
    if (bySeverity.CRITICAL > 0) return 'CRITICAL';
    if (bySeverity.HIGH > 2) return 'HIGH';
    if (bySeverity.MEDIUM > 3) return 'MEDIUM';
    if (bySeverity.LOW > 5) return 'LOW';
    return 'SAFE';
  }
}

/**
 * Main function - analyze diff file
 */
export async function analyzeCodeAnomalies(diffContent) {
  const detector = new AnomalyDetector();
  const results = {
    files: [],
    summary: { total: 0, bySeverity: { CRITICAL: 0, HIGH: 0, MEDIUM: 0, LOW: 0 } },
  };

  // Parse diff to extract added/modified code
  const files = parseDiff(diffContent);

  for (const file of files) {
    if (shouldAnalyzeFile(file.name)) {
      const metrics = new CodeMetrics(file.additions).getAllMetrics();
      const anomalies = detector.detectAnomalies(metrics);
      const summary = detector.getSummary(anomalies);

      results.files.push({
        name: file.name,
        metrics,
        anomalies,
        summary,
      });

      // Aggregate
      results.summary.total += anomalies.length;
      for (const severity of Object.keys(summary.bySeverity)) {
        results.summary.bySeverity[severity] += summary.bySeverity[severity];
      }
    }
  }

  results.summary.riskLevel = detector.calculateRiskLevel(results.summary.bySeverity);

  return results;
}

/**
 * Parse unified diff format
 */
function parseDiff(diffContent) {
  const files = [];
  let currentFile = null;
  let currentAdditions = '';

  for (const line of diffContent.split('\n')) {
    if (line.startsWith('diff --git')) {
      if (currentFile) {
        currentFile.additions = currentAdditions;
        files.push(currentFile);
      }
      currentFile = { name: extractFileName(line), additions: '' };
      currentAdditions = '';
    } else if (line.startsWith('+') && !line.startsWith('+++')) {
      currentAdditions += line.substring(1) + '\n';
    }
  }

  if (currentFile) {
    currentFile.additions = currentAdditions;
    files.push(currentFile);
  }

  return files;
}

/**
 * Extract filename from diff header
 */
function extractFileName(line) {
  const match = line.match(/b\/(.*?)$/);
  return match ? match[1] : 'unknown';
}

/**
 * Determine if file should be analyzed
 */
function shouldAnalyzeFile(filename) {
  const analysisExtensions = ['.js', '.ts', '.jsx', '.tsx', '.py', '.go', '.java', '.c', '.cpp', '.rs'];
  return analysisExtensions.some(ext => filename.endsWith(ext));
}

/**
 * CLI interface
 */
async function main() {
  const diffFile = process.argv[2] || 'pr.patch';

  if (!fs.existsSync(diffFile)) {
    console.error(`Error: Diff file not found: ${diffFile}`);
    process.exit(1);
  }

  const diffContent = fs.readFileSync(diffFile, 'utf8');
  const results = await analyzeCodeAnomalies(diffContent);

  console.log(JSON.stringify(results, null, 2));
}

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  main();
}
