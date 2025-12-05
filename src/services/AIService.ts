/**
 * Unified AI Service
 * Supports multiple AI providers: Gemini, OpenAI, Groq, Hugging Face, OpenRouter
 * Configure via environment variables
 */

export type AIProvider = 'gemini' | 'openai' | 'groq' | 'huggingface' | 'openrouter';

interface AIServiceConfig {
    provider: AIProvider;
    apiKey: string;
    model?: string;
}

class AIService {
    private config: AIServiceConfig;

    constructor() {
        // Read from environment variables (Vite uses VITE_ prefix)
        const provider = (import.meta.env.VITE_AI_PROVIDER || 'openrouter') as AIProvider;
        const apiKey = this.getApiKey(provider);
        const model = import.meta.env.VITE_AI_MODEL;

        this.config = {
            provider,
            apiKey,
            model,
        };
    }

    private getApiKey(provider: AIProvider): string {
        const keys = {
            gemini: import.meta.env.VITE_GEMINI_API_KEY,
            openai: import.meta.env.VITE_OPENAI_API_KEY,
            groq: import.meta.env.VITE_GROQ_API_KEY,
            huggingface: import.meta.env.VITE_HUGGINGFACE_API_KEY,
            openrouter: import.meta.env.VITE_OPENROUTER_API_KEY,
        };

        return keys[provider] || '';
    }

    /**
     * Send a chat message and get AI response
     */
    async chat(message: string): Promise<string> {
        if (!this.config.apiKey) {
            throw new Error(`API key not configured for ${this.config.provider}. Please check your .env file.`);
        }

        switch (this.config.provider) {
            case 'gemini':
                return this.chatGemini(message);
            case 'openai':
                return this.chatOpenAI(message);
            case 'groq':
                return this.chatGroq(message);
            case 'huggingface':
                return this.chatHuggingFace(message);
            case 'openrouter':
                return this.chatOpenRouter(message);
            default:
                throw new Error(`Unsupported provider: ${this.config.provider}`);
        }
    }

    /**
     * Google Gemini API
     * Docs: https://ai.google.dev/tutorials/rest_quickstart
     */
    private async chatGemini(message: string): Promise<string> {
        const model = this.config.model || 'gemini-1.5-flash-latest';
        const url = `https://generativelanguage.googleapis.com/v1/models/${model}:generateContent?key=${this.config.apiKey}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                contents: [{
                    parts: [{
                        text: message
                    }]
                }]
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Gemini API error: ${error}`);
        }

        const data = await response.json();
        return data.candidates?.[0]?.content?.parts?.[0]?.text || 'No response from Gemini.';
    }

    /**
     * OpenAI API (ChatGPT)
     * Docs: https://platform.openai.com/docs/api-reference/chat
     */
    private async chatOpenAI(message: string): Promise<string> {
        const model = this.config.model || 'gpt-3.5-turbo';
        const url = 'https://api.openai.com/v1/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: message }],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenAI API error: ${error}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response from OpenAI.';
    }

    /**
     * Groq API (Fast & Free)
     * Docs: https://console.groq.com/docs/quickstart
     */
    private async chatGroq(message: string): Promise<string> {
        const model = this.config.model || 'llama-3.3-70b-versatile';
        const url = 'https://api.groq.com/openai/v1/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: message }],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Groq API error: ${error}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response from Groq.';
    }

    /**
     * Hugging Face Inference API
     * Docs: https://huggingface.co/docs/api-inference/quicktour
     */
    private async chatHuggingFace(message: string): Promise<string> {
        const model = this.config.model || 'microsoft/DialoGPT-large';
        const url = `https://api-inference.huggingface.co/models/${model}`;

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
            },
            body: JSON.stringify({
                inputs: message,
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`Hugging Face API error: ${error}`);
        }

        const data = await response.json();
        return data[0]?.generated_text || data.generated_text || 'No response from Hugging Face.';
    }

    /**
     * OpenRouter API (Unified API for multiple models)
     * Docs: https://openrouter.ai/docs
     */
    private async chatOpenRouter(message: string): Promise<string> {
        const model = this.config.model || 'meta-llama/llama-3.3-70b-instruct';
        const url = 'https://openrouter.ai/api/v1/chat/completions';

        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${this.config.apiKey}`,
                'HTTP-Referer': window.location.origin,
                'X-Title': 'M-Pulse AI Assistant',
            },
            body: JSON.stringify({
                model,
                messages: [{ role: 'user', content: message }],
            }),
        });

        if (!response.ok) {
            const error = await response.text();
            throw new Error(`OpenRouter API error: ${error}`);
        }

        const data = await response.json();
        return data.choices?.[0]?.message?.content || 'No response from OpenRouter.';
    }

    /**
     * Get current provider info
     */
    getProviderInfo(): { provider: AIProvider; model: string } {
        return {
            provider: this.config.provider,
            model: this.config.model || this.getDefaultModel(),
        };
    }

    private getDefaultModel(): string {
        const defaults = {
            gemini: 'gemini-1.5-flash-latest',
            openai: 'gpt-3.5-turbo',
            groq: 'llama-3.3-70b-versatile',
            huggingface: 'microsoft/DialoGPT-large',
            openrouter: 'meta-llama/llama-3.3-70b-instruct',
        };
        return defaults[this.config.provider];
    }
}

// Export singleton instance
export const aiService = new AIService();
