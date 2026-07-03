import React, { useState, useEffect } from 'react';
import { Key, Keyboard, Check, Loader2, Save, X, RefreshCw, AlertCircle, ArrowUpRight } from 'lucide-react';
import { AppSettings } from '../../main/services/store';

declare global {
  interface Window {
    api: {
      getSettings: () => Promise<AppSettings>;
      saveSettings: (settings: Partial<AppSettings>) => Promise<AppSettings>;
      getModels: (provider: string) => Promise<string[]>;
      closeSettings: () => void;
      getAppVersion: () => Promise<string>;
      checkForUpdates: () => Promise<{
        success: boolean;
        updateAvailable: boolean;
        latestVersion: string;
        error?: string;
      }>;
      openExternalUrl: (url: string) => void;
    };
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'shortcut' | 'updates'>('api');
  const [appVersion, setAppVersion] = useState('1.0.0');
  const [checkingUpdates, setCheckingUpdates] = useState(false);
  const [updateStatus, setUpdateStatus] = useState<string | null>(null);
  
  // Settings state
  const [settings, setSettings] = useState<AppSettings | null>(null);
  const [models, setModels] = useState<Record<string, string[]>>({
    openai: [],
    claude: [],
    gemini: [],
    openrouter: [],
  });

  const [loadingModels, setLoadingModels] = useState<Record<string, boolean>>({
    openai: false,
    claude: false,
    gemini: false,
    openrouter: false,
  });

  const [isRecording, setIsRecording] = useState(false);
  const [recordingShortcut, setRecordingShortcut] = useState('');
  const [saveStatus, setSaveStatus] = useState<'idle' | 'saving' | 'saved'>('idle');

  // Load settings on mount
  useEffect(() => {
    window.api.getSettings().then((storeSettings) => {
      setSettings(storeSettings);
      setRecordingShortcut(storeSettings.shortcut);

      // Pre-load models for the active provider
      fetchProviderModels(storeSettings.activeProvider, storeSettings);
    });

    window.api.getAppVersion().then((ver) => {
      setAppVersion(ver);
    });
  }, []);

  // Fetch models helper
  const fetchProviderModels = async (provider: string, currentSettings: AppSettings | null) => {
    if (!currentSettings) return;

    setLoadingModels((prev) => ({ ...prev, [provider]: true }));
    try {
      const fetchedModels = await window.api.getModels(provider);
      setModels((prev) => ({ ...prev, [provider]: fetchedModels }));
    } catch (e) {
      console.error(`Failed to fetch models for ${provider}`, e);
    } finally {
      setLoadingModels((prev) => ({ ...prev, [provider]: false }));
    }
  };

  const handleProviderChange = (provider: 'openai' | 'openrouter' | 'claude' | 'gemini') => {
    if (!settings) return;
    const updated = { ...settings, activeProvider: provider };
    setSettings(updated);
    
    // Fetch models if list is empty
    if (models[provider].length === 0) {
      fetchProviderModels(provider, updated);
    }
  };

  const handleKeyChange = (provider: string, value: string) => {
    if (!settings) return;
    const keyField = `${provider}Key` as keyof AppSettings;
    const updated = { ...settings, [keyField]: value } as AppSettings;
    setSettings(updated);
  };

  const handleModelChange = (provider: string, value: string) => {
    if (!settings) return;
    const modelField = `${provider}Model` as keyof AppSettings;
    const updated = { ...settings, [modelField]: value } as AppSettings;
    setSettings(updated);
  };

  // Shortcut keydown capturing helper
  const handleShortcutCapture = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const keys: string[] = [];

    // Modifiers matching Electron Accelerator guidelines
    if (e.metaKey) {
      keys.push('Command');
    }
    if (e.ctrlKey) {
      keys.push('Ctrl');
    }
    if (e.altKey) {
      keys.push('Alt');
    }
    if (e.shiftKey) {
      keys.push('Shift');
    }

    const key = e.key;

    // Filter out isolated modifier keystrokes
    if (
      key !== 'Control' &&
      key !== 'Shift' &&
      key !== 'Alt' &&
      key !== 'Meta' &&
      key !== 'CapsLock' &&
      key !== 'Tab' &&
      key !== 'Escape'
    ) {
      if (key.length === 1) {
        keys.push(key.toUpperCase());
      } else {
        // Translate arrows or other special keys to Electron friendly words
        keys.push(key);
      }
    }

    if (keys.length > 0) {
      const combo = keys.join('+');
      setRecordingShortcut(combo);
    }
  };

  const saveAllSettings = async () => {
    if (!settings) return;

    setSaveStatus('saving');
    try {
      const updated = {
        ...settings,
        shortcut: recordingShortcut,
      };
      const saved = await window.api.saveSettings(updated);
      setSettings(saved);
      setSaveStatus('saved');
      setTimeout(() => setSaveStatus('idle'), 2000);
    } catch (e) {
      console.error('Failed to save settings', e);
      setSaveStatus('idle');
    }
  };

  const checkUpdatesManually = async () => {
    setCheckingUpdates(true);
    setUpdateStatus(null);
    try {
      const result = await window.api.checkForUpdates();
      if (result.success) {
        if (result.updateAvailable) {
          setUpdateStatus(`Update Available! New Version: ${result.latestVersion}`);
        } else {
          setUpdateStatus('Your software is up to date!');
        }
      } else {
        setUpdateStatus(`Error checking updates: ${result.error || 'Unknown error'}`);
      }
      
      const updatedSettings = await window.api.getSettings();
      setSettings(updatedSettings);
    } catch (e: any) {
      console.error(e);
      setUpdateStatus(`Failed to check updates: ${e.message || e}`);
    } finally {
      setCheckingUpdates(false);
    }
  };

  if (!settings) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-950 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500 mr-2" />
        <span>Loading Settings...</span>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-between bg-dark-950 text-slate-100 font-sans border border-slate-800/80 rounded-lg overflow-hidden">
      {/* Title Header */}
      <div className="flex items-center justify-between px-6 py-4 border-b border-slate-900 bg-dark-900/60">
        <div className="flex items-center space-x-2">
          <div className="w-2.5 h-2.5 rounded-full bg-brand-500 animate-pulse" />
          <h1 className="text-base font-bold tracking-wide font-sans text-slate-200">
            StackOrbitAI <span className="text-brand-500 font-normal">Vibe Improver</span>
          </h1>
          <span className="text-[10px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded font-mono">
            v{appVersion}
          </span>
        </div>
        <button 
          onClick={() => window.api.closeSettings()}
          className="text-slate-400 hover:text-slate-200 transition-colors p-1 hover:bg-slate-800/40 rounded"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Primary Workspace */}
      <div className="flex flex-1 overflow-hidden">
        {/* Navigation Sidebar */}
        <div className="w-44 border-r border-slate-900/60 bg-dark-900/20 p-3 flex flex-col space-y-1">
          <button
            onClick={() => setActiveTab('api')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all font-medium ${
              activeTab === 'api'
                ? 'bg-brand-600/15 text-brand-500 border-l-2 border-brand-500 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Key className="w-4 h-4" />
            <span>API Keys</span>
          </button>
          <button
            onClick={() => setActiveTab('shortcut')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all font-medium ${
              activeTab === 'shortcut'
                ? 'bg-brand-600/15 text-brand-500 border-l-2 border-brand-500 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Keyboard className="w-4 h-4" />
            <span>Shortcut</span>
          </button>
          <button
            onClick={() => setActiveTab('updates')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all font-medium ${
              activeTab === 'updates'
                ? 'bg-brand-600/15 text-brand-500 border-l-2 border-brand-500 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <RefreshCw className={`w-4 h-4 ${checkingUpdates ? 'animate-spin' : ''}`} />
            <span className="flex items-center justify-between w-full">
              <span>Updates</span>
              {settings.isUpdateAvailable && (
                <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse mr-1" />
              )}
            </span>
          </button>
        </div>

        {/* Tab Contents Panel */}
        <div className="flex-1 p-6 overflow-y-auto bg-dark-950">
          {activeTab === 'api' ? (
            <div className="space-y-5">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Configure LLM Providers</h2>
              
              {/* Provider Block Maker */}
              {(['openai', 'claude', 'gemini', 'openrouter'] as const).map((provider) => {
                const isSelected = settings.activeProvider === provider;
                const keyName = `${provider}Key` as keyof AppSettings;
                const modelName = `${provider}Model` as keyof AppSettings;
                const displayNames: Record<string, string> = {
                  openai: 'OpenAI (GPT)',
                  claude: 'Anthropic Claude',
                  gemini: 'Google Gemini',
                  openrouter: 'OpenRouter.ai',
                };

                return (
                  <div 
                    key={provider} 
                    className={`p-3 rounded-xl border transition-all ${
                      isSelected 
                        ? 'border-brand-500/40 bg-brand-500/[0.02]' 
                        : 'border-slate-900 bg-slate-900/20 hover:border-slate-800'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2.5">
                      <label className="flex items-center space-x-2.5 cursor-pointer">
                        <input
                          type="radio"
                          name="activeProvider"
                          checked={isSelected}
                          onChange={() => handleProviderChange(provider)}
                          className="w-4 h-4 text-brand-500 focus:ring-brand-500 bg-slate-850 border-slate-700"
                        />
                        <span className={`text-xs font-bold ${isSelected ? 'text-slate-200' : 'text-slate-400'}`}>
                          {displayNames[provider]}
                        </span>
                      </label>
                      
                      {/* Fetch Models trigger */}
                      <button
                        onClick={() => fetchProviderModels(provider, settings)}
                        disabled={loadingModels[provider]}
                        className="text-[10px] text-brand-500 hover:text-brand-400 underline disabled:text-slate-600 transition-colors"
                      >
                        {loadingModels[provider] ? 'Syncing...' : 'Sync Models'}
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      {/* Key Input */}
                      <div className="col-span-3">
                        <input
                          type="password"
                          placeholder={`${displayNames[provider]} API Key`}
                          value={settings[keyName] as string}
                          onChange={(e) => handleKeyChange(provider, e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      
                      {/* Model Select */}
                      <div className="col-span-2">
                        <select
                          value={settings[modelName] as string}
                          onChange={(e) => handleModelChange(provider, e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                        >
                          {/* Populate options */}
                          {models[provider] && models[provider].length > 0 ? (
                            models[provider].map((m) => (
                              <option key={m} value={m}>{m}</option>
                            ))
                          ) : (
                            <option value={settings[modelName] as string}>{settings[modelName] as string}</option>
                          )}
                        </select>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          ) : activeTab === 'shortcut' ? (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Global Activation Shortcut</h2>
              
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <div className="text-xs text-slate-400 leading-relaxed">
                  Press the hotkey combo in any input field to improve selected text. Customize it below:
                </div>

                <div className="flex flex-col space-y-2">
                  <span className="text-xs font-semibold text-slate-300">Shortcut Recorder</span>
                  <div className="flex items-center space-x-3">
                    <div 
                      tabIndex={0}
                      onKeyDown={isRecording ? handleShortcutCapture : undefined}
                      className={`flex-1 text-center font-mono text-sm py-3 px-4 rounded-xl border cursor-pointer select-none transition-all outline-none ${
                        isRecording 
                          ? 'border-brand-500 bg-brand-600/5 shadow-[0_0_12px_rgba(99,102,241,0.15)] text-slate-200' 
                          : 'border-slate-800 bg-slate-900/50 hover:border-slate-700 text-slate-300'
                      }`}
                      onClick={() => setIsRecording(true)}
                      onBlur={() => setIsRecording(false)}
                    >
                      {isRecording ? 'Press key combination...' : recordingShortcut || 'Click to record'}
                    </div>

                    {isRecording && (
                      <button
                        onClick={() => setIsRecording(false)}
                        className="px-3 py-2 bg-slate-800 hover:bg-slate-750 text-xs font-medium rounded-lg text-slate-300 transition-colors"
                      >
                        Done
                      </button>
                    )}
                  </div>
                  <span className="text-[10px] text-slate-500">
                    Supports modifier keys (Ctrl, Alt, Shift, Cmd/Command). Click box, press desired keys, and click Done.
                  </span>
                </div>
              </div>
            </div>
          ) : (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Software Updates</h2>
              
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="text-xs text-slate-400">Current Version</div>
                    <div className="text-sm font-bold font-mono text-slate-200">v{appVersion}</div>
                  </div>
                  <div>
                    <div className="text-xs text-slate-400">Last Checked</div>
                    <div className="text-sm font-semibold text-slate-300">
                      {settings.lastUpdateCheck > 0 
                        ? new Date(settings.lastUpdateCheck).toLocaleString() 
                        : 'Never'}
                    </div>
                  </div>
                </div>

                <div className="border-t border-slate-900/80 pt-4 flex flex-col space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-300 font-medium">Automatic Check</span>
                    <span className="text-[10px] bg-slate-800/80 text-slate-400 px-2 py-1 rounded">
                      Every 24 hours
                    </span>
                  </div>

                  <button
                    onClick={checkUpdatesManually}
                    disabled={checkingUpdates}
                    className="w-full flex items-center justify-center space-x-1.5 px-3 py-2 bg-slate-900 hover:bg-slate-850 border border-slate-800 disabled:opacity-50 text-slate-200 font-medium rounded-lg text-xs transition-all"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${checkingUpdates ? 'animate-spin' : ''}`} />
                    <span>{checkingUpdates ? 'Checking for updates...' : 'Check for Updates Now'}</span>
                  </button>

                  {updateStatus && (
                    <div className="flex items-start space-x-2 p-2.5 rounded-lg bg-slate-900/40 border border-slate-800/60 text-xs">
                      <AlertCircle className="w-4 h-4 text-brand-400 shrink-0 mt-0.5" />
                      <span className="text-slate-300">{updateStatus}</span>
                    </div>
                  )}
                </div>

                {settings.isUpdateAvailable && (
                  <div className="p-3.5 rounded-xl border border-amber-500/20 bg-amber-500/[0.02] flex flex-col space-y-3">
                    <div className="flex items-center space-x-2">
                      <div className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs font-bold text-amber-500">
                        New Update Available: {settings.latestVersionAvailable}
                      </span>
                    </div>
                    <p className="text-[11px] text-slate-400 leading-relaxed">
                      An update is available on GitHub with bug fixes and new performance updates.
                    </p>
                    <button
                      onClick={() => window.api.openExternalUrl(settings.updateUrl)}
                      className="flex items-center justify-center space-x-1 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all"
                    >
                      <span>Download Release Binary</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                )}
              </div>

              {/* Live Build Links */}
              <div className="p-3 rounded-lg bg-dark-900/20 border border-slate-900/60 flex items-center justify-between text-xs">
                <span className="text-slate-400">Live Build Releases</span>
                <button
                  onClick={() => window.api.openExternalUrl('https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases')}
                  className="text-brand-500 hover:text-brand-400 font-semibold underline flex items-center space-x-0.5"
                >
                  <span>Open GitHub Releases</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Footer Save Row */}
      <div className="px-6 py-3 border-t border-slate-900 bg-dark-900/60 flex items-center justify-between">
        <span className="text-xs text-slate-500">
          Active Provider: <span className="text-brand-500 font-semibold uppercase">{settings.activeProvider}</span>
        </span>
        
        <button
          onClick={saveAllSettings}
          disabled={saveStatus === 'saving'}
          className="flex items-center space-x-1.5 px-4 py-2 bg-brand-600 hover:bg-brand-500 active:bg-brand-700 disabled:bg-slate-800 text-white font-medium rounded-lg text-xs shadow-md transition-all"
        >
          {saveStatus === 'saving' ? (
            <>
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
              <span>Saving...</span>
            </>
          ) : saveStatus === 'saved' ? (
            <>
              <Check className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-emerald-400">Settings Saved!</span>
            </>
          ) : (
            <>
              <Save className="w-3.5 h-3.5" />
              <span>Save Settings</span>
            </>
          )}
        </button>
      </div>
    </div>
  );
}
