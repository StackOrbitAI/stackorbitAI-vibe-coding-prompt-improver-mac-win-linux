import { app } from 'electron';
import path from 'path';
import { execFile, exec } from 'child_process';

const getSendKeysPath = (): string => {
  if (app.isPackaged) {
    return path.join(process.resourcesPath, 'bin', 'sendkeys.exe');
  }
  return path.join(app.getAppPath(), 'bin', 'sendkeys.exe');
};

/**
 * Simulates Ctrl+C (Cmd+C on macOS) via OS scripting/binary execution
 */
export function simulateCopy(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      execFile(exePath, ['^c'], () => {
        // We resolve regardless of errors to ensure the flow isn't permanently blocked
        resolve();
      });
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
 * Simulates Ctrl+V (Cmd+V on macOS) via OS scripting/binary execution
 */
export function simulatePaste(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      const exePath = getSendKeysPath();
      execFile(exePath, ['^v'], () => {
        resolve();
      });
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
