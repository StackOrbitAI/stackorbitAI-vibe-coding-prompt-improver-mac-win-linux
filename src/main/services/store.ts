import Store from 'electron-store';

export interface AppSettings {
  openaiKey: string;
  openrouterKey: string;
  claudeKey: string;
  geminiKey: string;
  openaiModel: string;
  openrouterModel: string;
  claudeModel: string;
  geminiModel: string;
  activeProvider: 'openai' | 'openrouter' | 'claude' | 'gemini';
  shortcut: string;
  isPaused: boolean;
  // Update fields
  lastUpdateCheck: number;
  latestVersionAvailable: string;
  isUpdateAvailable: boolean;
  updateUrl: string;
}

const defaults: AppSettings = {
  openaiKey: '',
  openrouterKey: '',
  claudeKey: '',
  geminiKey: '',
  openaiModel: 'gpt-4o-mini',
  openrouterModel: 'meta-llama/llama-3-70b-instruct:free',
  claudeModel: 'claude-3-5-haiku-20241022',
  geminiModel: 'gemini-1.5-flash',
  activeProvider: 'openai',
  shortcut: process.platform === 'darwin' ? 'Command+Shift+P' : 'Ctrl+Shift+P',
  isPaused: false,
  lastUpdateCheck: 0,
  latestVersionAvailable: '',
  isUpdateAvailable: false,
  updateUrl: '',
};

export const store = new Store<AppSettings>({
  name: 'settings',
  defaults,
  // Encrypt the store configuration file locally to protect user API keys
  encryptionKey: 'stackorbitai-vibe-prompt-improver-enc-key'
});
