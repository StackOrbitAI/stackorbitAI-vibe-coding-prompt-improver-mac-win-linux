import Store from 'electron-store';
import { AppSettings, DEFAULT_PROMPT_PRESETS } from '../../types/settings';

export * from '../../types/settings';

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
  activePromptMode: 'vibe-coding',
  customPresets: DEFAULT_PROMPT_PRESETS,
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
