import Store from 'electron-store';

export interface ReleaseItem {
  id: number;
  tagName: string;
  name: string;
  publishedAt: string;
  body: string;
  htmlUrl: string;
  assets: Array<{
    name: string;
    size: number;
    downloadUrl: string;
  }>;
}

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
  // Update & Release fields
  lastUpdateCheck: number;
  latestVersionAvailable: string;
  isUpdateAvailable: boolean;
  updateUrl: string;
  latestReleaseNotes: string;
  allReleases: ReleaseItem[];
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
  latestReleaseNotes: '',
  allReleases: [],
};

export const store = new Store<AppSettings>({
  name: 'settings',
  defaults,
  encryptionKey: 'stackorbitai-vibe-prompt-improver-enc-key'
});
