#!/usr/bin/env node
/**
 * Multi-provider PR review runner
 * Usage: node run-provider-review.mjs <provider> <diff-file>
 * Providers: claude (default), gpt, gemini
 */

import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProvider, autoSelectProvider } from './ai-providers.mjs';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

async function main() {
  const [provider = null, diffFile = 'pr.patch'] = process.argv.slice(2);

  try {
    // Auto-select provider or use specified one
    const selectedProvider = provider || autoSelectProvider();
    console.log(`📊 Using AI provider: ${selectedProvider.toUpperCase()}`);

    // Read diff file
    if (!fs.existsSync(diffFile)) {
      throw new Error(`Diff file not found: ${diffFile}`);
    }

    const diff = fs.readFileSync(diffFile, 'utf8');

    // Get provider instance
    const providerInstance = getProvider(selectedProvider);

    // Prepare security review prompt
    const prompt = `You are a senior security-focused code reviewer. Analyze this git diff for:

1. **Security Vulnerabilities** - OWASP Top 10, CWE patterns, sensitive data exposure
2. **Code Quality** - Design patterns, maintainability, error handling
3. **Testing** - Coverage gaps, edge cases, test quality
4. **Performance** - Bottlenecks, N+1 queries, memory leaks
5. **Dependencies** - Known vulnerabilities, outdated packages

Format response as Markdown with:
- **Severity levels**: CRITICAL 🔴, HIGH 🟠, MEDIUM 🟡, LOW 🟢
- **Clear recommendations** for each finding
- **Risk assessment**: Overall PR risk level
- **Approval recommendation**: APPROVE, REQUEST_CHANGES, or COMMENT

---

Git Diff:`;

    console.log(`\n🔍 Analyzing code with ${selectedProvider}...`);
    const review = await providerInstance.analyzeCode(diff, prompt, {
      model: process.env[`${selectedProvider.toUpperCase()}_MODEL`],
    });

    console.log('\n✅ Review complete!\n');
    console.log(review);

    // Save review
    fs.writeFileSync('REVIEW.md', review);
    console.log('\n💾 Review saved to REVIEW.md');

  } catch (error) {
    console.error('❌ Review failed:', error.message);
    process.exit(1);
  }
}

main();
