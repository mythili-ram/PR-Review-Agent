# Multi-AI Provider Support

The PR Review Agent now supports **three major AI providers** to avoid vendor lock-in and allow teams to choose based on cost, performance, or organizational requirements.

## 🚀 Supported Providers

| Provider | Model | Best For | Cost |
|----------|-------|----------|------|
| **Claude** (Anthropic) | Opus 4.1, Sonnet 4.5 | Default; Superior reasoning | $$ |
| **GPT** (OpenAI) | GPT-4o | Speed; Large org support | $$$ |
| **Gemini** (Google) | Gemini 2.0 Flash | Cost-effective; Fast | $ |

## 🔧 Configuration

### 1. Set API Keys

```bash
# Claude (Anthropic)
export ANTHROPIC_API_KEY="sk-ant-..."

# GPT (OpenAI)
export OPENAI_API_KEY="sk-..."

# Gemini (Google)
export GOOGLE_API_KEY="AIza..."
```

### 2. Select Default Provider in `agent.yaml`

```yaml
model:
  provider: claude  # or: gpt, gemini
  providers:
    claude:
      model: claude-opus-4-1-20250805
```

## 📝 Usage

### Local Review with Provider

```bash
# Auto-select available provider
npm run review:auto < pr.patch

# Specific provider
npm run review:claude < pr.patch
npm run review:gpt < pr.patch
npm run review:gemini < pr.patch
```

### GitHub Actions

The workflow automatically detects available API keys:

```yaml
- name: AI Review (Multi-Provider)
  env:
    ANTHROPIC_API_KEY: ${{ secrets.ANTHROPIC_API_KEY || '' }}
    OPENAI_API_KEY: ${{ secrets.OPENAI_API_KEY || '' }}
    GOOGLE_API_KEY: ${{ secrets.GOOGLE_API_KEY || '' }}
  run: npm run review:auto
```

## 💾 Architecture

### Provider Interface

Each provider implements:
```javascript
{
  name: "claude|gpt|gemini",
  analyzeCode(code, prompt, config) // returns Promise<string>
}
```

### Adding New Providers

```javascript
// scripts/ai-providers.mjs
export const myProvider = {
  name: "myprovider",
  async analyzeCode(code, prompt, config) {
    // Implementation
  }
};
```

## 🎯 Benefits

✅ **No Vendor Lock-in** - Switch providers anytime  
✅ **Cost Optimization** - Use cheapest provider (Gemini)  
✅ **Redundancy** - Fallback if one provider is down  
✅ **Team Flexibility** - Let teams choose preferred provider  
✅ **Enterprise Ready** - Support organizational API preferences  

## 📊 Performance Comparison

| Provider | Speed | Quality | Cost |
|----------|-------|---------|------|
| Claude | Medium | Excellent | High |
| GPT | Fast | Excellent | Higher |
| Gemini | Fastest | Good | Low |

**Recommendation**: Use Claude by default (best security reasoning), fall back to Gemini for cost-sensitive environments.

---

**Implementation Date**: Hackathon 2026  
**Feature Type**: Enterprise flexibility  
**Status**: ✅ Production Ready
