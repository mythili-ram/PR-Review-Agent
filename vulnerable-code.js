// This file contains intentional security vulnerabilities for testing
const express = require('express');
const mysql = require('mysql');
const app = express();

// CRITICAL: Hardcoded API key
const API_KEY = "sk-test-1234567890abcdef";

// CRITICAL: SQL injection vulnerability
app.get('/user/:id', (req, res) => {
  const userId = req.params.id;
  const query = `SELECT * FROM users WHERE id = '${userId}'`; // SQL injection!
  
  // CRITICAL: Path traversal
  const filePath = req.query.file;
  const fullPath = path.join('/uploads', filePath); // Path traversal risk
  
  res.json({ query, path: fullPath });
});

app.listen(3000);
