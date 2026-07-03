import { store, DEFAULT_PROMPT_PRESETS } from './store';

function getSystemInstruction(): string {
  const activeMode = store.get('activePromptMode') || 'vibe-coding';
  const presets = store.get('customPresets') || DEFAULT_PROMPT_PRESETS;
  const matched = presets.find((p) => p.id === activeMode);
  if (matched && matched.instruction) {
    return matched.instruction;
  }
  return DEFAULT_PROMPT_PRESETS[0].instruction;
}

export interface StreamCallbacks {
  onChunk: (text: string) => void;
  onError: (error: string) => void;
  onDone: (fullText: string) => void;
}

export async function improvePrompt(rawPrompt: string, callbacks: StreamCallbacks): Promise<void> {
  const activeProvider = store.get('activeProvider');
  const systemInstruction = getSystemInstruction();
  
  let url = '';
  let headers: Record<string, string> = {
    'Content-Type': 'application/json',
  };
  let body: any = {};

  try {
    if (activeProvider === 'openai') {
      const apiKey = store.get('openaiKey');
      const model = store.get('openaiModel') || 'gpt-4o-mini';
      if (!apiKey) throw new Error('OpenAI API Key is missing. Open Settings to add it.');

      url = 'https://api.openai.com/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: rawPrompt }
        ],
        stream: true,
      };
    } else if (activeProvider === 'openrouter') {
      const apiKey = store.get('openrouterKey');
      const model = store.get('openrouterModel') || 'meta-llama/llama-3-70b-instruct:free';
      if (!apiKey) throw new Error('OpenRouter API Key is missing. Open Settings to add it.');

      url = 'https://openrouter.ai/api/v1/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      headers['HTTP-Referer'] = 'https://stackorbitai.com';
      headers['X-Title'] = 'StackOrbitAI Vibe Coding Prompt Improver';
      body = {
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: rawPrompt }
        ],
        stream: true,
      };
    } else if (activeProvider === 'gemini') {
      const apiKey = store.get('geminiKey');
      const model = store.get('geminiModel') || 'gemini-1.5-flash';
      if (!apiKey) throw new Error('Google Gemini API Key is missing. Open Settings to add it.');

      url = 'https://generativelanguage.googleapis.com/v1beta/openai/chat/completions';
      headers['Authorization'] = `Bearer ${apiKey}`;
      body = {
        model,
        messages: [
          { role: 'system', content: systemInstruction },
          { role: 'user', content: rawPrompt }
        ],
        stream: true,
      };
    } else if (activeProvider === 'claude') {
      const apiKey = store.get('claudeKey');
      const model = store.get('claudeModel') || 'claude-3-5-haiku-20241022';
      if (!apiKey) throw new Error('Claude API Key is missing. Open Settings to add it.');

      url = 'https://api.anthropic.com/v1/messages';
      headers['x-api-key'] = apiKey;
      headers['anthropic-version'] = '2023-06-01';
      body = {
        model,
        system: systemInstruction,
        messages: [
          { role: 'user', content: rawPrompt }
        ],
        stream: true,
        max_tokens: 4000,
      };
    } else {
      throw new Error(`Unknown active provider: ${activeProvider}`);
    }

    const response = await fetch(url, {
      method: 'POST',
      headers,
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      const errText = await response.text();
      let errorMsg = `API request failed with status ${response.status}`;
      try {
        const parsedErr = JSON.parse(errText);
        errorMsg = parsedErr.error?.message || parsedErr.error || errorMsg;
      } catch (e) {
        if (errText) errorMsg = errText;
      }
      throw new Error(errorMsg);
    }

    if (!response.body) {
      throw new Error('API response body is empty');
    }

    const reader = response.body;
    const decoder = new TextDecoder();
    let buffer = '';
    let fullText = '';

    for await (const chunk of reader as any) {
      buffer += decoder.decode(chunk, { stream: true });
      const lines = buffer.split('\n');
      buffer = lines.pop() || '';

      for (const line of lines) {
        const cleaned = line.trim();
        if (!cleaned) continue;

        if (cleaned.startsWith('data: ')) {
          const dataStr = cleaned.slice(6);
          if (dataStr === '[DONE]') continue;
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              callbacks.onChunk(content);
            }
          } catch (e) {}
        }

        if (cleaned.startsWith('data:')) {
          const dataStr = cleaned.slice(5).trim();
          try {
            const parsed = JSON.parse(dataStr);
            if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
              const text = parsed.delta.text;
              fullText += text;
              callbacks.onChunk(text);
            }
          } catch (e) {}
        }
      }
    }

    if (buffer) {
      if (buffer.startsWith('data: ')) {
        const dataStr = buffer.slice(6);
        if (dataStr !== '[DONE]') {
          try {
            const parsed = JSON.parse(dataStr);
            const content = parsed.choices?.[0]?.delta?.content || '';
            if (content) {
              fullText += content;
              callbacks.onChunk(content);
            }
          } catch (e) {}
        }
      } else if (buffer.startsWith('data:')) {
        const dataStr = buffer.slice(5).trim();
        try {
          const parsed = JSON.parse(dataStr);
          if (parsed.type === 'content_block_delta' && parsed.delta?.text) {
            const text = parsed.delta.text;
            fullText += text;
            callbacks.onChunk(text);
          }
        } catch (e) {}
      }
    }

    if (!fullText.trim()) {
      throw new Error('API returned an empty response.');
    }

    callbacks.onDone(fullText);

  } catch (error: any) {
    callbacks.onError(error.message || String(error));
  }
}
