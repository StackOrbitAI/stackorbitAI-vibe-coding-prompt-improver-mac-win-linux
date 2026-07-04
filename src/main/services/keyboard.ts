import { app } from 'electron';
import path from 'path';
import fs from 'fs';
import { exec, spawn } from 'child_process';

function getSendKeysPath(): string {
  // In packaged apps, app.getAppPath() returns ...resources/app.asar
  // but spawn cannot execute inside asar archives — must use app.asar.unpacked
  const appPath = app.getAppPath().replace('app.asar', 'app.asar.unpacked');
  const possiblePaths = [
    // Packaged: unpacked from asar
    path.join(process.resourcesPath, 'app.asar.unpacked', 'bin', 'sendkeys.exe'),
    // Dev mode: project root
    path.join(appPath, 'bin', 'sendkeys.exe'),
    path.join(__dirname, '..', '..', 'bin', 'sendkeys.exe'),
  ];
  for (const p of possiblePaths) {
    try {
      if (fs.existsSync(p)) {
        return p;
      }
    } catch { /* ignore */ }
  }
  // Last resort fallback
  return path.join(process.resourcesPath, 'app.asar.unpacked', 'bin', 'sendkeys.exe');
}

/**
 * Simulates Ctrl+C (Cmd+C on macOS)
 * Windows: uses native sendkeys.exe (Win32 keybd_event API)
 */
export function simulateCopy(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      const child = spawn(exePath, ['copy'], {
        windowsHide: true,
        detached: false,
        stdio: 'ignore'
      });
      child.on('close', () => resolve());
      child.on('error', (err) => {
        console.error('sendkeys.exe copy error:', err.message, 'path:', exePath);
        resolve(); // Don't crash, just continue
      });
    } else if (process.platform === 'darwin') {
      exec(`osascript -e 'delay 0.1' -e 'tell application "System Events" to keystroke "c" using {command down}'`, () => {
        resolve();
      });
    } else {
      exec('xdotool key ctrl+c', () => {
        resolve();
      });
    }
  });
}

/**
 * Simulates Ctrl+V (Cmd+V on macOS)
 * Windows: uses native sendkeys.exe (Win32 keybd_event API)
 */
export function simulatePaste(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      const child = spawn(exePath, ['paste'], {
        windowsHide: true,
        detached: false,
        stdio: 'ignore'
      });
      child.on('close', () => resolve());
      child.on('error', (err) => {
        console.error('sendkeys.exe paste error:', err.message, 'path:', exePath);
        resolve(); // Don't crash, just continue
      });
    } else if (process.platform === 'darwin') {
      exec(`osascript -e 'delay 0.1' -e 'tell application "System Events" to keystroke "v" using {command down}'`, () => {
        resolve();
      });
    } else {
      exec('xdotool key ctrl+v', () => {
        resolve();
      });
    }
  });
}

