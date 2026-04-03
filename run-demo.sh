#!/bin/bash
# Quick Demo Runner for Mac/Linux
# Run this file to test all demo commands

set -e  # Exit on error

echo "========================================"
echo "PR Review Agent - Demo Test"
echo "========================================"
echo ""

cd "$(dirname "$0")"

echo "[1/4] Validating agent structure..."
node scripts/validate-structure.mjs
echo ""

echo "[2/4] Running offline heuristics scan..."
node scripts/local-heuristics.mjs fixtures/sample.patch
echo ""

echo "[3/4] Checking .env file..."
if [ ! -f .env ]; then
    echo "WARNING: .env file not found"
    echo "Please copy .env.example to .env and add your ANTHROPIC_API_KEY"
    echo ""
    exit 1
fi

echo "[4/4] Running full AI review with gitclaw..."
echo "NOTE: This requires ANTHROPIC_API_KEY in .env"
node scripts/run-demo.mjs
echo ""

echo "========================================"
echo "Demo completed successfully!"
echo "========================================"
echo ""
echo "Next steps:"
echo "1. Record your screen running this script"
echo "2. Upload video to YouTube/Loom"
echo "3. Submit to hackathon!"
echo ""
