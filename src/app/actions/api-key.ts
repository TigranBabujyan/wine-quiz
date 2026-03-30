// Client-side only — stores the Gemini API key in localStorage.
// No 'use server' directive: this file must NOT be imported by server components.

const STORAGE_KEY = 'gemini_api_key';

export async function saveApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    if (apiKey) {
      localStorage.setItem(STORAGE_KEY, apiKey);
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
    return { success: true };
  } catch {
    return { success: false, error: 'Failed to save API key.' };
  }
}

export async function getApiKey(): Promise<string> {
  try {
    return localStorage.getItem(STORAGE_KEY) ?? '';
  } catch {
    return '';
  }
}
