import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec, spawn } from 'child_process';

const isDev = !app.isPackaged;

function getSendKeysPath(): string {
  const possiblePaths = [
    path.join(app.getAppPath(), 'bin/sendkeys.exe'),
    path.join(__dirname, '../../bin/sendkeys.exe'),
    path.join(process.resourcesPath, 'app.asar.unpacked/bin/sendkeys.exe'),
    path.join(process.resourcesPath, 'bin/sendkeys.exe'),
  ];
  for (const p of possiblePaths) {
    if (fs.existsSync(p)) {
      return p;
    }
  }
  // Fallback to app.asar.unpacked path
  return path.join(process.resourcesPath, 'app.asar.unpacked/bin/sendkeys.exe');
}

/**
 * Simulates Ctrl+C (Cmd+C on macOS) — 100% no visible window on Windows
 * Uses sendkeys.exe compiled from C# which waits for physical modifiers release
 */
export function simulateCopy(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      spawn(exePath, ['copy'], {
        windowsHide: true,
        detached: false,
        stdio: 'ignore'
      }).on('close', () => resolve());
    } else if (process.platform === 'darwin') {
      exec(`osascript -e 'delay 0.1' -e 'tell application "System Events" to keystroke "c" using {command down}'`, () => {
        resolve();
      });
    } else {
      // Linux
      exec('xdotool key ctrl+c', () => {
        resolve();
      });
    }
  });
}

/**
 * Simulates Ctrl+V (Cmd+V on macOS) — 100% no visible window on Windows
 * Uses sendkeys.exe compiled from C# which waits for physical modifiers release
 */
export function simulatePaste(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      spawn(exePath, ['paste'], {
        windowsHide: true,
        detached: false,
        stdio: 'ignore'
      }).on('close', () => resolve());
    } else if (process.platform === 'darwin') {
      exec(`osascript -e 'delay 0.1' -e 'tell application "System Events" to keystroke "v" using {command down}'`, () => {
        resolve();
      });
    } else {
      // Linux
      exec('xdotool key ctrl+v', () => {
        resolve();
      });
    }
  });
}
