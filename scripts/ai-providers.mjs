#!/usr/bin/env node
/**
 * Multi-provider AI review support
 * Supports: Claude (Anthropic), GPT (OpenAI), Gemini (Google)
 */

/**
 * Claude (Anthropic) Provider
 */
export const claudeProvider = {
  name: "claude",
  async analyzeCode(code, prompt, config = {}) {
    const Anthropic = (await import("@anthropic-ai/sdk")).default;
    
    const client = new Anthropic({
      apiKey: process.env.ANTHROPIC_API_KEY,
    });

    const message = await client.messages.create({
      model: config.model || "claude-opus-4-1-20250805",
      max_tokens: 2000,
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
    });

    return message.content[0].text;
  },
};

/**
 * GPT (OpenAI) Provider
 */
export const gptProvider = {
  name: "gpt",
  async analyzeCode(code, prompt, config = {}) {
    const OpenAI = (await import("openai")).default;
    
    const client = new OpenAI({
      apiKey: process.env.OPENAI_API_KEY,
    });

    const response = await client.chat.completions.create({
      model: config.model || "gpt-4o",
      messages: [
        {
          role: "user",
          content: `${prompt}\n\n\`\`\`\n${code}\n\`\`\``,
        },
      ],
      temperature: 0.7,
      max_tokens: 2000,
    });

    return response.choices[0].message.content;
  },
};

/**
 * Gemini (Google) Provider
 */
export const geminiProvider = {
  name: "gemini",
  async analyzeCode(code, prompt, config = {}) {
    const { GoogleGenerativeAI } = await import("@google/generative-ai");
    
    const client = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);
    const model = client.getGenerativeModel({ 
      model: config.model || "gemini-2.0-flash" 
    });

    const result = await model.generateContent(`${prompt}\n\n\`\`\`\n${code}\n\`\`\``);

    return result.response.text();
  },
};

/**
 * Provider factory
 */
export function getProvider(name) {
  const providers = {
    claude: claudeProvider,
    gpt: gptProvider,
    gemini: geminiProvider,
  };

  return providers[name.toLowerCase()] || claudeProvider;
}

/**
 * Auto-detect available provider based on API keys
 */
export function autoSelectProvider() {
  if (process.env.ANTHROPIC_API_KEY) return "claude";
  if (process.env.OPENAI_API_KEY) return "gpt";
  if (process.env.GOOGLE_API_KEY) return "gemini";
  
  throw new Error(
    "No AI provider configured. Set one of: ANTHROPIC_API_KEY, OPENAI_API_KEY, GOOGLE_API_KEY"
  );
}

/**
 * Run review with selected provider
 */
export async function runReviewWithProvider(code, provider = null, config = {}) {
  const selectedProvider = provider || autoSelectProvider();
  const providerInstance = getProvider(selectedProvider);

  const prompt = `You are a senior security-focused code reviewer. Analyze this code for:
1. Security vulnerabilities (OWASP Top 10, CWE patterns)
2. Code quality issues
3. Missing error handling
4. Test coverage gaps

Provide a structured review with severity levels and actionable fixes.`;

  return await providerInstance.analyzeCode(code, prompt, config);
}
