'use server';

const ENV_KEY = 'GEMINI_API_KEY';

export async function saveApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (apiKey) {
      process.env[ENV_KEY] = apiKey;
    } else {
      delete process.env[ENV_KEY];
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save API key.' };
  }
}

export async function getApiKey(): Promise<string> {
  return process.env[ENV_KEY] ?? '';
}
