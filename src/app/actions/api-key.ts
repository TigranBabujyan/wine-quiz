'use server';

import fs from 'fs';
import path from 'path';

const ENV_PATH = path.resolve(process.cwd(), '.env');

function readEnvFile(): string {
  try {
    return fs.readFileSync(ENV_PATH, 'utf-8');
  } catch {
    return '';
  }
}

function updateEnvKey(content: string, key: string, value: string): string {
  const regex = new RegExp(`^${key}=.*$`, 'm');
  if (regex.test(content)) {
    return content.replace(regex, `${key}=${value}`);
  }
  return content ? `${content}\n${key}=${value}` : `${key}=${value}`;
}

export async function saveApiKey(apiKey: string): Promise<{ success: boolean; error?: string }> {
  try {
    const content = readEnvFile();
    const updated = updateEnvKey(content, 'GEMINI_API_KEY', apiKey);
    fs.writeFileSync(ENV_PATH, updated, 'utf-8');
    // Update runtime env so it takes effect immediately
    process.env.GEMINI_API_KEY = apiKey;
    return { success: true };
  } catch (error) {
    console.error('Failed to save API key:', error);
    return { success: false, error: 'Failed to save API key.' };
  }
}

export async function getApiKey(): Promise<string> {
  return process.env.GEMINI_API_KEY ?? '';
}
