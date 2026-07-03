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

export interface PromptPreset {
  id: string;
  name: string;
  description: string;
  instruction: string;
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
  activePromptMode: string;
  customPresets: PromptPreset[];
  // Update & Release fields
  lastUpdateCheck: number;
  latestVersionAvailable: string;
  isUpdateAvailable: boolean;
  updateUrl: string;
  latestReleaseNotes: string;
  allReleases: ReleaseItem[];
}

export const DEFAULT_PROMPT_PRESETS: PromptPreset[] = [
  {
    id: 'vibe-coding',
    name: 'Improve & Structure Prompt (Vibe Coding Standard)',
    description: 'Transform raw/mixed language inputs into structured, professional coding prompts with Goal, Requirements, Constraints & Output format.',
    instruction: `You are a World-Class AI Prompt Engineering Expert specializing in Vibe Coding and Agentic AI Assistants (Cursor, VS Code, Windsurf, Claude Code, ChatGPT).
Transform the user's raw input into an elite, highly structured English coding instruction.
Structure with sections: Goal, Requirements & Features, Technical Constraints, Expected Output.
Output ONLY the improved prompt text — no preambles, no markdown code block wrappers.`
  },
  {
    id: 'enhance-prompt',
    name: 'Enhanced Prompt & Technical Precision',
    description: 'Deeply enhance prompt with implied technical details, language/framework best practices, and error handling.',
    instruction: `You are an expert AI Prompt Engineering Specialist. Take the user's input and rewrite it into a deeply enhanced, technically precise coding prompt in clear English. Add necessary implied technical details (frameworks, error handling, edge cases) while preserving core intent. Output ONLY the enhanced prompt.`
  },
  {
    id: 'improve-existing',
    name: 'Improve Existing Prompt (Refine & Polish)',
    description: 'Refine and polish existing prompts to remove ambiguity and improve AI model execution accuracy.',
    instruction: `Refine and polish the user's existing prompt to make it clear, unambiguous, and direct for AI coding tools. Retain the exact scope and intent. Output ONLY the refined prompt.`
  },
  {
    id: 'correct-without-meaning-change',
    name: 'Always Correct Prompt Without Meaning Change',
    description: 'Fix errors, translation, and grammar while strictly preserving 100% of the original meaning and scope.',
    instruction: `Translate any non-English/informal text into professional English and correct all grammatical and technical mistakes. Do NOT alter, add, or remove any core meaning or requirements. Output ONLY the corrected prompt.`
  },
  {
    id: 'update-prompt',
    name: 'Update & Modernize Prompt (Latest Standards)',
    description: 'Update legacy coding prompts to use modern 2026 AI agent patterns and clean code conventions.',
    instruction: `Update and modernize the user's prompt to follow modern software engineering standards and AI coding agent guidelines. Ensure modern language syntax and architectural clarity. Output ONLY the updated prompt.`
  },
  {
    id: 'grammar-english',
    name: 'Correct Prompt Grammar in English',
    description: 'Translate Hindi/Hinglish/informal text into grammatically perfect English without changing prompt structure.',
    instruction: `Convert the user's prompt into grammatically correct, clean technical English. Preserve the user's wording as closely as possible. Output ONLY the grammatically corrected prompt.`
  },
  {
    id: 'preserve-meaning-strict',
    name: 'Strict Meaning Preservation (Minimal Fixes)',
    description: 'Apply minimal corrections to spelling and typos while keeping original prompt layout intact.',
    instruction: `Apply minimal corrections (spelling, typos, basic grammar) to the user's prompt. Keep the original layout and wording as close to 100% identical as possible. Output ONLY the corrected text.`
  }
];

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
