import React, { useState, useEffect } from 'react';
import { Key, Keyboard, Check, Loader2, Save, X, RefreshCw, AlertCircle, ArrowUpRight, Download, Sparkles, FileText, Image as ImageIcon, ExternalLink, Plus, Trash2, Edit3 } from 'lucide-react';
import { AppSettings, ReleaseItem, DEFAULT_PROMPT_PRESETS, PromptPreset } from '../../main/services/store';

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
        releaseNotes?: string;
        publishedAt?: string;
        allReleases?: ReleaseItem[];
        error?: string;
      }>;
      prepareUpdateExit: () => void;
      openExternalUrl: (url: string) => void;
    };
  }
}

export default function Settings() {
  const [activeTab, setActiveTab] = useState<'api' | 'modes' | 'shortcut' | 'updates'>('api');
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
  const [activeFeatureTab, setActiveFeatureTab] = useState<'hud' | 'settings' | 'shortcuts'>('hud');

  // Custom Preset Form State
  const [showAddForm, setShowAddForm] = useState(false);
  const [newPresetName, setNewPresetName] = useState('');
  const [newPresetDesc, setNewPresetDesc] = useState('');
  const [newPresetInstruction, setNewPresetInstruction] = useState('');

  // Load settings on mount
  useEffect(() => {
    window.api.getSettings().then((storeSettings) => {
      setSettings(storeSettings);
      setRecordingShortcut(storeSettings.shortcut);
      fetchProviderModels(storeSettings.activeProvider, storeSettings);
    });

    window.api.getAppVersion().then((ver) => {
      setAppVersion(ver);
    });
  }, []);

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

  const handlePromptModeChange = (modeId: string) => {
    if (!settings) return;
    setSettings({ ...settings, activePromptMode: modeId });
  };

  const handleAddCustomPreset = (setActive: boolean = true) => {
    if (!settings || !newPresetName.trim() || !newPresetInstruction.trim()) return;

    const newPresetId = `custom-${Date.now()}`;
    const newPreset: PromptPreset = {
      id: newPresetId,
      name: newPresetName.trim(),
      description: newPresetDesc.trim() || 'Custom user prompt instruction preset.',
      instruction: newPresetInstruction.trim(),
    };

    const currentPresets = settings.customPresets && settings.customPresets.length > 0 
      ? settings.customPresets 
      : DEFAULT_PROMPT_PRESETS;

    const updatedPresets = [...currentPresets, newPreset];
    const updatedSettings: AppSettings = {
      ...settings,
      customPresets: updatedPresets,
      activePromptMode: setActive ? newPresetId : settings.activePromptMode,
    };

    setSettings(updatedSettings);
    setShowAddForm(false);
    setNewPresetName('');
    setNewPresetDesc('');
    setNewPresetInstruction('');
  };

  const handleDeleteCustomPreset = (e: React.MouseEvent, presetId: string) => {
    e.stopPropagation();
    if (!settings) return;

    const currentPresets = settings.customPresets && settings.customPresets.length > 0 
      ? settings.customPresets 
      : DEFAULT_PROMPT_PRESETS;

    const filtered = currentPresets.filter((p) => p.id !== presetId);
    let nextActive = settings.activePromptMode;
    if (nextActive === presetId) {
      nextActive = filtered.length > 0 ? filtered[0].id : 'vibe-coding';
    }

    setSettings({
      ...settings,
      customPresets: filtered,
      activePromptMode: nextActive,
    });
  };

  const handleShortcutCapture = (e: React.KeyboardEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const keys: string[] = [];

    if (e.metaKey) keys.push('Command');
    if (e.ctrlKey) keys.push('Ctrl');
    if (e.altKey) keys.push('Alt');
    if (e.shiftKey) keys.push('Shift');

    const key = e.key;

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
          setUpdateStatus(`New update available for the latest version (${result.latestVersion}).`);
        } else {
          setUpdateStatus('You are using the latest version.');
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

  const handleDownloadAndInstallUpdate = (downloadUrl: string) => {
    if (window.api.prepareUpdateExit) {
      window.api.prepareUpdateExit();
    }
    window.api.openExternalUrl(downloadUrl);
  };

  if (!settings) {
    return (
      <div className="w-full h-full flex items-center justify-center bg-dark-950 text-slate-400">
        <Loader2 className="w-6 h-6 animate-spin text-brand-500 mr-2" />
        <span>Loading Settings...</span>
      </div>
    );
  }

  const activePresetsList = settings.customPresets && settings.customPresets.length > 0 
    ? settings.customPresets 
    : DEFAULT_PROMPT_PRESETS;

  return (
    <div className="w-full h-full flex flex-col justify-between bg-dark-950 text-slate-100 font-sans border border-slate-800/80 rounded-lg overflow-hidden select-none">
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
            onClick={() => setActiveTab('modes')}
            className={`w-full flex items-center space-x-2 px-3 py-2 rounded-lg text-sm transition-all font-medium ${
              activeTab === 'modes'
                ? 'bg-brand-600/15 text-brand-500 border-l-2 border-brand-500 font-semibold'
                : 'text-slate-400 hover:bg-slate-800/40 hover:text-slate-200'
            }`}
          >
            <Sparkles className="w-4 h-4" />
            <span>Prompt Library</span>
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
                      
                      <button
                        onClick={() => fetchProviderModels(provider, settings)}
                        disabled={loadingModels[provider]}
                        className="text-[10px] text-brand-500 hover:text-brand-400 underline disabled:text-slate-600 transition-colors"
                      >
                        {loadingModels[provider] ? 'Syncing...' : 'Sync Models'}
                      </button>
                    </div>

                    <div className="grid grid-cols-5 gap-2">
                      <div className="col-span-3">
                        <input
                          type="password"
                          placeholder={`${displayNames[provider]} API Key`}
                          value={settings[keyName] as string}
                          onChange={(e) => handleKeyChange(provider, e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                        />
                      </div>
                      
                      <div className="col-span-2">
                        <select
                          value={settings[modelName] as string}
                          onChange={(e) => handleModelChange(provider, e.target.value)}
                          className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                        >
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
          ) : activeTab === 'modes' ? (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Prompt Library & Active Mode Selector</h2>
                  <p className="text-[11px] text-slate-400 mt-0.5">Select or create the default library instruction used when pressing the global hotkey:</p>
                </div>

                <button
                  onClick={() => setShowAddForm(!showAddForm)}
                  className="flex items-center space-x-1 px-2.5 py-1.5 bg-brand-600 hover:bg-brand-500 text-white font-medium rounded-lg text-xs transition-all shadow-sm"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Custom Preset</span>
                </button>
              </div>

              {/* Add Custom Preset Form Modal / Card */}
              {showAddForm && (
                <div className="p-4 rounded-xl border border-brand-500/40 bg-dark-900/60 space-y-3 animate-fadeIn">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold text-slate-200 flex items-center space-x-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-brand-400" />
                      <span>Create New Custom Prompt Preset</span>
                    </span>
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="text-slate-400 hover:text-slate-200"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <input
                      type="text"
                      placeholder="Preset Title (e.g. Correct Prompt in English Without Meaning Change)"
                      value={newPresetName}
                      onChange={(e) => setNewPresetName(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                    />

                    <input
                      type="text"
                      placeholder="Short Description (e.g. Translates and corrects grammar while preserving 100% intent)"
                      value={newPresetDesc}
                      onChange={(e) => setNewPresetDesc(e.target.value)}
                      className="w-full text-xs p-2 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500"
                    />

                    <textarea
                      rows={3}
                      placeholder="AI System Instruction (e.g. I want to correct my prompt in English without meaning change. Convert any text into professional English. Output ONLY the corrected text.)"
                      value={newPresetInstruction}
                      onChange={(e) => setNewPresetInstruction(e.target.value)}
                      className="w-full text-xs p-2.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-200 focus:outline-none focus:border-brand-500 font-mono resize-none"
                    />
                  </div>

                  <div className="flex items-center justify-end space-x-2 pt-1">
                    <button
                      onClick={() => setShowAddForm(false)}
                      className="px-3 py-1.5 bg-slate-800 hover:bg-slate-750 text-slate-300 text-xs rounded-lg transition-colors"
                    >
                      Cancel
                    </button>

                    <button
                      onClick={() => handleAddCustomPreset(true)}
                      disabled={!newPresetName.trim() || !newPresetInstruction.trim()}
                      className="px-3.5 py-1.5 bg-brand-600 hover:bg-brand-500 disabled:bg-slate-800 text-white font-medium text-xs rounded-lg transition-colors shadow-sm"
                    >
                      Save & Set Active Default
                    </button>
                  </div>
                </div>
              )}

              <div className="space-y-2.5 max-h-[350px] overflow-y-auto pr-1">
                {activePresetsList.map((preset) => {
                  const isActive = (settings.activePromptMode || 'vibe-coding') === preset.id;
                  const isCustom = preset.id.startsWith('custom-');

                  return (
                    <div
                      key={preset.id}
                      onClick={() => handlePromptModeChange(preset.id)}
                      className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                        isActive
                          ? 'border-brand-500/60 bg-brand-500/[0.04] shadow-[0_0_12px_rgba(99,102,241,0.1)]'
                          : 'border-slate-900 bg-slate-900/20 hover:border-slate-800'
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex items-center space-x-2.5">
                          <input
                            type="radio"
                            name="activePromptMode"
                            checked={isActive}
                            onChange={() => handlePromptModeChange(preset.id)}
                            className="w-4 h-4 text-brand-500 focus:ring-brand-500 bg-slate-850 border-slate-700"
                          />
                          <span className={`text-xs font-bold ${isActive ? 'text-slate-100' : 'text-slate-300'}`}>
                            {preset.name}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2">
                          {isCustom && (
                            <span className="text-[9px] bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 px-2 py-0.5 rounded-full font-semibold">
                              Custom Preset
                            </span>
                          )}

                          {isActive && (
                            <span className="text-[9px] bg-brand-500/20 text-brand-400 border border-brand-500/30 px-2 py-0.5 rounded-full font-semibold">
                              Active Default
                            </span>
                          )}

                          {isCustom && (
                            <button
                              onClick={(e) => handleDeleteCustomPreset(e, preset.id)}
                              className="text-slate-500 hover:text-rose-400 p-1 rounded transition-colors"
                              title="Delete custom preset"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          )}
                        </div>
                      </div>

                      <p className="text-[11px] text-slate-400 mt-2 ml-6 leading-relaxed">
                        {preset.description}
                      </p>
                    </div>
                  );
                })}
              </div>
            </div>
          ) : activeTab === 'shortcut' ? (
            <div className="space-y-4">
              <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Global Activation Shortcut</h2>
              
              <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/20 space-y-4">
                <div className="text-xs text-slate-400 leading-relaxed">
                  Press the hotkey combo in any input field to improve selected text using the active prompt mode. Customize it below:
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
            <div className="space-y-6">
              <div className="space-y-3">
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-500">Software Updates & Automatic Service</h2>
                
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
                      <span className="text-xs text-slate-300 font-medium">Automatic Update Check</span>
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
                        An update is available on GitHub with performance improvements and bug fixes.
                      </p>
                      <button
                        onClick={() => handleDownloadAndInstallUpdate(settings.updateUrl)}
                        className="flex items-center justify-center space-x-1.5 px-3 py-2 bg-amber-600 hover:bg-amber-500 text-slate-950 font-bold rounded-lg text-xs shadow-md transition-all"
                      >
                        <Download className="w-3.5 h-3.5" />
                        <span>Download & Relaunch Update</span>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* Release Notes Display */}
              <div className="space-y-3">
                <div className="flex items-center space-x-2">
                  <FileText className="w-4 h-4 text-brand-500" />
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Latest Release Notes</h3>
                </div>
                <div className="p-4 rounded-xl border border-slate-900 bg-slate-900/30 text-xs text-slate-300 leading-relaxed font-mono whitespace-pre-wrap max-h-40 overflow-y-auto">
                  {settings.latestReleaseNotes || `• v${appVersion}: Custom Prompt Preset Creation, Library Management, and Auto-Updater.`}
                </div>
              </div>

              {/* Application Screenshots & Feature Showcase */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <ImageIcon className="w-4 h-4 text-brand-500" />
                    <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">Feature Screenshots Showcase</h3>
                  </div>
                  <div className="flex space-x-1 text-[10px]">
                    {(['hud', 'settings', 'shortcuts'] as const).map((tab) => (
                      <button
                        key={tab}
                        onClick={() => setActiveFeatureTab(tab)}
                        className={`px-2 py-0.5 rounded transition-all capitalize ${
                          activeFeatureTab === tab
                            ? 'bg-brand-600 text-white font-semibold'
                            : 'bg-slate-800 text-slate-400 hover:text-slate-200'
                        }`}
                      >
                        {tab}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="p-3 rounded-xl border border-slate-900 bg-dark-900/40 flex flex-col items-center justify-center min-h-[140px] text-center space-y-2">
                  {activeFeatureTab === 'hud' ? (
                    <div className="space-y-1.5">
                      <div className="px-4 py-3 rounded-xl border border-brand-500/30 bg-slate-900/80 shadow-lg text-left max-w-sm">
                        <div className="flex items-center justify-between text-[11px] mb-1">
                          <span className="font-bold text-brand-400 flex items-center space-x-1">
                            <Sparkles className="w-3 h-3 mr-1" /> Vibe Prompt Improver HUD
                          </span>
                          <span className="text-[9px] bg-slate-800 text-slate-400 px-1 rounded font-mono">Cursor Overlay</span>
                        </div>
                        <p className="text-[10px] text-slate-300 font-mono">
                          Goal: Implement custom prompt library presets...
                        </p>
                      </div>
                      <span className="text-[10px] text-slate-500">Floating HUD overlay pops up near cursor in any IDE or browser</span>
                    </div>
                  ) : activeFeatureTab === 'settings' ? (
                    <div className="space-y-1.5">
                      <div className="px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-left max-w-sm text-xs">
                        <div className="font-semibold text-slate-200">LLM Provider & Model Selector</div>
                        <span className="text-[10px] text-slate-400">OpenAI GPT-4o, Anthropic Claude, Google Gemini, OpenRouter</span>
                      </div>
                      <span className="text-[10px] text-slate-500">Configure API keys and model parameters locally</span>
                    </div>
                  ) : (
                    <div className="space-y-1.5">
                      <div className="px-4 py-2.5 rounded-lg border border-slate-800 bg-slate-900 text-center max-w-sm text-xs font-mono text-brand-400">
                        Ctrl + Shift + P
                      </div>
                      <span className="text-[10px] text-slate-500">Customizable global shortcut recorder for system-wide activation</span>
                    </div>
                  )}
                </div>
              </div>

              {/* Downloadable Links & Shortcuts for Previous Releases */}
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-500">
                    Previous Releases & Direct Download Links
                  </h3>
                  <button
                    onClick={() => window.api.openExternalUrl('https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases')}
                    className="text-brand-500 hover:text-brand-400 font-semibold underline text-[11px] flex items-center space-x-0.5"
                  >
                    <span>GitHub Releases</span>
                    <ExternalLink className="w-3 h-3 ml-0.5" />
                  </button>
                </div>

                <div className="space-y-2 max-h-52 overflow-y-auto">
                  {settings.allReleases && settings.allReleases.length > 0 ? (
                    settings.allReleases.map((rel) => (
                      <div 
                        key={rel.id} 
                        className="p-3 rounded-lg bg-dark-900/30 border border-slate-900 flex flex-col space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-2">
                            <span className="text-xs font-bold text-slate-200 font-mono">{rel.tagName}</span>
                            <span className="text-[10px] text-slate-400">{rel.name}</span>
                          </div>
                          <span className="text-[10px] text-slate-500">
                            {rel.publishedAt ? new Date(rel.publishedAt).toLocaleDateString() : ''}
                          </span>
                        </div>

                        <div className="flex flex-wrap gap-1.5">
                          {rel.assets.map((asset) => (
                            <button
                              key={asset.name}
                              onClick={() => handleDownloadAndInstallUpdate(asset.downloadUrl)}
                              className="text-[10px] px-2 py-1 bg-slate-900 hover:bg-slate-800 border border-slate-800 text-slate-300 rounded flex items-center space-x-1 transition-colors"
                            >
                              <Download className="w-2.5 h-2.5 text-brand-400" />
                              <span className="truncate max-w-[140px]">{asset.name}</span>
                            </button>
                          ))}
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="p-3 rounded-lg bg-dark-900/20 border border-slate-900 text-xs text-slate-400 text-center">
                      Click "Check for Updates Now" above to load all previous release download links.
                    </div>
                  )}
                </div>
              </div>

            </div>
          )}
        </div>
      </div>

      {/* Footer Save Row */}
      <div className="px-6 py-3 border-t border-slate-900 bg-dark-900/60 flex items-center justify-between">
        <div className="flex items-center space-x-3 text-xs text-slate-500">
          <span>Active Provider: <span className="text-brand-500 font-semibold uppercase">{settings.activeProvider}</span></span>
          <span className="text-slate-800">•</span>
          <span>Active Mode: <span className="text-brand-400 font-semibold">{settings.activePromptMode || 'vibe-coding'}</span></span>
        </div>
        
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
