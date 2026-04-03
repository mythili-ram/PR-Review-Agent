// Demo: Intentionally vulnerable code to show agent detection
// This file demonstrates what the PR-Review-Agent catches

// ❌ VULNERABILITY 1: Hardcoded API Key
export const config = {
  apiKey: "sk-demo-12345-this-is-a-vulnerable-key",
  endpoint: "https://api.example.com"
};

// ❌ VULNERABILITY 2: SQL Injection
export async function getUserById(userId) {
  const query = `SELECT * FROM users WHERE id = '${userId}'`;
  return db.query(query);
}

// ❌ VULNERABILITY 3: Missing Input Validation
export function processUserInput(input) {
  // No validation - directly using user input
  return eval(input);
}

// This code will trigger the PR-Review-Agent to:
// - Detect the hardcoded secret (CWE-798)
// - Detect SQL injection vulnerability (CWE-89)
// - Flag missing input validation
// - Recommend fixes with code examples
