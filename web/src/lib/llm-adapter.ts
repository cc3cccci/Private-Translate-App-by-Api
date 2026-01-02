import OpenAI from 'openai';

export interface LLMConfig {
    apiKey: string;
    baseURL: string;
}

export const getProviderConfig = (model: string): LLMConfig | null => {
    // Determine provider based on model name or explicit mapping
    // For now, checks prefixed keys or defaults. 
    // Simplified logic: Check if model string identifies the provider, else default to generic/OpenAI

    const env = process.env;

    if (model.includes('deepseek')) {
        return {
            apiKey: env.DEEPSEEK_KEY || '',
            baseURL: 'https://api.deepseek.com',
        };
    }

    if (model.includes('grok') || model.startsWith('grok')) {
        return {
            apiKey: env.GROK_KEY || '',
            baseURL: 'https://api.x.ai/v1',
        };
    }

    if (model.includes('qwen') || model.includes('dashscope')) {
        return {
            apiKey: env.QWEN_KEY || '',
            baseURL: 'https://dashscope.aliyuncs.com/compatible-mode/v1',
        };
    }

    // Default to OpenAI
    return {
        apiKey: env.OPENAI_KEY || '',
        baseURL: 'https://api.openai.com/v1',
    };
};

export async function chatCompletion(
    model: string,
    messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[]
) {
    const config = getProviderConfig(model);

    if (!config || !config.apiKey) {
        throw new Error(`Configuration not found for model: ${model}`);
    }

    const openai = new OpenAI({
        apiKey: config.apiKey,
        baseURL: config.baseURL,
    });

    return await openai.chat.completions.create({
        model: model,
        messages: messages,
        temperature: 0.3,
    });
}
