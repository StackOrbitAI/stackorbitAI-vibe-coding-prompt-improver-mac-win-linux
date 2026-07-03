import { app, BrowserWindow, globalShortcut, ipcMain, clipboard, screen, Tray, Menu, nativeImage } from 'electron';
import path from 'path';
import fs from 'fs';
import { store } from './services/store';
import { simulateCopy, simulatePaste } from './services/keyboard';
import { improvePrompt } from './services/ai';

let settingsWindow: BrowserWindow | null = null;
let hudWindow: BrowserWindow | null = null;
let tray: Tray | null = null;
let isProcessing = false;

// Determine if we're in development mode
const isDev = !app.isPackaged;

function createSettingsWindow() {
  if (settingsWindow) {
    settingsWindow.show();
    settingsWindow.focus();
    return;
  }

  settingsWindow = new BrowserWindow({
    width: 650,
    height: 520,
    resizable: false,
    frame: true,
    show: false,
    title: 'StackOrbitAI Vibe Coding Settings',
    backgroundColor: '#0f172a', // Dark theme background
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  // Load local Vite dev server in dev, or local index.html in production
  if (isDev) {
    settingsWindow.loadURL('http://localhost:5173');
    // Open DevTools in dev
    // settingsWindow.webContents.openDevTools();
  } else {
    settingsWindow.loadFile(path.join(__dirname, '../renderer/index.html'));
  }

  // Prevent settings window from closing entirely, just hide it
  settingsWindow.on('close', (event) => {
    event.preventDefault();
    settingsWindow?.hide();
  });
}

function createHUDWindow() {
  hudWindow = new BrowserWindow({
    width: 380,
    height: 180,
    frame: false,
    transparent: true,
    alwaysOnTop: true,
    skipTaskbar: true,
    resizable: false,
    show: false,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  if (isDev) {
    hudWindow.loadURL('http://localhost:5173#hud');
  } else {
    hudWindow.loadFile(path.join(__dirname, '../renderer/index.html'), { hash: 'hud' });
  }

  // Set ignore mouse events so the overlay is click-through
  hudWindow.setIgnoreMouseEvents(true);
}

function positionHUDNearCursor() {
  if (!hudWindow) return;
  const cursorPoint = screen.getCursorScreenPoint();
  const primaryDisplay = screen.getPrimaryDisplay();
  const { width, height } = primaryDisplay.workAreaSize;
  const winBounds = hudWindow.getBounds();

  // Position offset near mouse cursor
  let x = cursorPoint.x + 15;
  let y = cursorPoint.y + 15;

  // Prevent window from spawning off-screen
  if (x + winBounds.width > width) {
    x = cursorPoint.x - winBounds.width - 15;
  }
  if (y + winBounds.height > height) {
    y = cursorPoint.y - winBounds.height - 15;
  }

  hudWindow.setPosition(x, y);
}

// Global shortcut registration helper
function registerGlobalShortcut() {
  globalShortcut.unregisterAll();

  const shortcut = store.get('shortcut');
  const isPaused = store.get('isPaused');

  if (isPaused || !shortcut) return;

  try {
    const success = globalShortcut.register(shortcut, () => {
      triggerEnhancementFlow();
    });
    if (!success) {
      console.error(`Failed to register shortcut: ${shortcut}`);
    }
  } catch (e) {
    console.error(`Error registering shortcut ${shortcut}:`, e);
  }
}

// Unified enhancement logic
async function triggerEnhancementFlow() {
  if (isProcessing) return;
  isProcessing = true;

  try {
    // 1. Back up clipboard
    const originalClipboardText = clipboard.readText();

    // 2. Clear clipboard to detect if copying succeeds
    clipboard.clear();

    // 3. Simulate OS-level copy
    await simulateCopy();
    
    // Tiny delay to let clipboard populate
    await new Promise((r) => setTimeout(r, 100));
    const capturedText = clipboard.readText();

    if (!capturedText || !capturedText.trim()) {
      // Restore clipboard and abort if no text selected
      clipboard.writeText(originalClipboardText);
      isProcessing = false;
      return;
    }

    // 4. Position and show HUD
    if (!hudWindow) {
      createHUDWindow();
    }
    positionHUDNearCursor();
    hudWindow?.show();

    hudWindow?.webContents.send('hud-update', {
      status: 'enhancing',
      progress: 5,
      preview: '',
    });

    let currentProgress = 5;
    // Fast mock increment up to 80% to keep HUD active during connection establishment
    const progressTimer = setInterval(() => {
      if (currentProgress < 75) {
        currentProgress += 5;
        hudWindow?.webContents.send('hud-update', {
          status: 'enhancing',
          progress: currentProgress,
          preview: '',
        });
      }
    }, 400);

    let streamText = '';

    // 5. Query LLM
    await improvePrompt(capturedText, {
      onChunk: (chunk) => {
        streamText += chunk;
        // As stream progresses, push progress towards 95%
        if (currentProgress < 95) {
          currentProgress += 1;
        }
        hudWindow?.webContents.send('hud-update', {
          status: 'enhancing',
          progress: currentProgress,
          preview: streamText,
        });
      },
      onError: (error) => {
        clearInterval(progressTimer);
        hudWindow?.webContents.send('hud-update', {
          status: 'error',
          progress: 0,
          preview: error,
        });
        
        // Restore original clipboard content
        clipboard.writeText(originalClipboardText);

        setTimeout(() => {
          hudWindow?.hide();
          isProcessing = false;
        }, 3000);
      },
      onDone: async (finalText) => {
        clearInterval(progressTimer);
        
        hudWindow?.webContents.send('hud-update', {
          status: 'success',
          progress: 100,
          preview: finalText,
        });

        // 6. Write enhanced text to clipboard
        clipboard.writeText(finalText);

        // 7. Simulate paste
        await simulatePaste();

        // 8. Restore original clipboard content after paste completes
        setTimeout(() => {
          clipboard.writeText(originalClipboardText);
        }, 300);

        // Hide HUD after 1 second
        setTimeout(() => {
          hudWindow?.hide();
          isProcessing = false;
        }, 1000);
      },
    });

  } catch (err: any) {
    console.error('Enhancement error:', err);
    hudWindow?.webContents.send('hud-update', {
      status: 'error',
      progress: 0,
      preview: err.message || 'An unexpected error occurred.',
    });
    setTimeout(() => {
      hudWindow?.hide();
      isProcessing = false;
    }, 3000);
  }
}

// System Tray management
function createTray() {
  const iconPath = path.join(app.getAppPath(), 'build', 'icon.png');
  let iconImage;

  if (fs.existsSync(iconPath)) {
    iconImage = nativeImage.createFromPath(iconPath).resize({ width: 16, height: 16 });
  } else {
    iconImage = nativeImage.createEmpty();
  }

  tray = new Tray(iconImage);
  tray.setToolTip('StackOrbitAI Vibe Coding Prompt Improver');

  updateTrayMenu();
}

function updateTrayMenu() {
  if (!tray) return;

  const isPaused = store.get('isPaused');

  const contextMenu = Menu.buildFromTemplate([
    {
      label: 'Open Settings',
      click: () => {
        if (!settingsWindow) {
          createSettingsWindow();
        }
        settingsWindow?.show();
      },
    },
    {
      label: isPaused ? '▶ Resume Listener' : '⏸ Pause Listener',
      click: () => {
        const newPauseState = !isPaused;
        store.set('isPaused', newPauseState);
        registerGlobalShortcut();
        updateTrayMenu();
      },
    },
    { type: 'separator' },
    {
      label: 'Quit',
      click: () => {
        globalShortcut.unregisterAll();
        // Since we prevent default on settings window close, we need to bypass it here
        settingsWindow?.destroy();
        app.quit();
      },
    },
  ]);

  tray.setContextMenu(contextMenu);
}

// Application Lifecycle
app.whenReady().then(() => {
  createSettingsWindow();
  createHUDWindow();
  createTray();
  registerGlobalShortcut();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) {
      createSettingsWindow();
    }
  });
});

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('will-quit', () => {
  globalShortcut.unregisterAll();
});

// IPC Handlers
ipcMain.handle('get-settings', () => {
  return store.store;
});

ipcMain.handle('save-settings', (event, updatedSettings) => {
  store.set(updatedSettings);
  registerGlobalShortcut();
  updateTrayMenu();
  return store.store;
});

ipcMain.on('close-settings', () => {
  settingsWindow?.hide();
});

// Dynamic models resolver
ipcMain.handle('get-models', async (event, provider) => {
  // Static model lists as robust fallbacks
  const fallbackModels: Record<string, string[]> = {
    openai: ['gpt-4o-mini', 'gpt-4o', 'gpt-4-turbo', 'gpt-3.5-turbo'],
    claude: ['claude-3-5-haiku-20241022', 'claude-3-5-sonnet-20241022', 'claude-3-opus-20240229'],
    gemini: ['gemini-1.5-flash', 'gemini-1.5-pro', 'gemini-2.0-flash-exp'],
    openrouter: ['meta-llama/llama-3-70b-instruct:free', 'google/gemini-flash-1.5-exp:free', 'mistralai/mistral-7b-instruct:free', 'openai/gpt-4o-mini'],
  };

  try {
    if (provider === 'openai') {
      const apiKey = store.get('openaiKey');
      if (!apiKey) return fallbackModels.openai;
      const res = await fetch('https://api.openai.com/v1/models', {
        headers: { Authorization: `Bearer ${apiKey}` },
      });
      if (res.ok) {
        const data = await res.json();
        const models = data.data
          .map((m: any) => m.id)
          .filter((id: string) => id.includes('gpt-') || id.includes('o1-'));
        return models.length > 0 ? models : fallbackModels.openai;
      }
    } else if (provider === 'openrouter') {
      const res = await fetch('https://openrouter.ai/api/v1/models');
      if (res.ok) {
        const data = await res.json();
        const models = data.data.map((m: any) => m.id);
        return models.length > 0 ? models : fallbackModels.openrouter;
      }
    } else if (provider === 'gemini') {
      const apiKey = store.get('geminiKey');
      if (!apiKey) return fallbackModels.gemini;
      const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models?key=${apiKey}`);
      if (res.ok) {
        const data = await res.json();
        const models = data.models
          .map((m: any) => m.name.replace('models/', ''))
          .filter((name: string) => name.includes('gemini-'));
        return models.length > 0 ? models : fallbackModels.gemini;
      }
    }
  } catch (e) {
    console.error(`Failed to fetch dynamic models for ${provider}, using fallbacks:`, e);
  }

  return fallbackModels[provider] || [];
});
