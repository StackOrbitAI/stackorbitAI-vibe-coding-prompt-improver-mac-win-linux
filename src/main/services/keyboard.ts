import { app } from 'electron';
import path from 'path';
import { execFile, exec, spawn } from 'child_process';

/**
 * Simulates Ctrl+C (Cmd+C on macOS) — 100% no visible window on Windows
 * Uses PowerShell with -WindowStyle Hidden instead of sendkeys.exe
 */
export function simulateCopy(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // PowerShell approach: completely invisible, no CMD window ever appears
      spawn('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-WindowStyle', 'Hidden',
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; Start-Sleep -Milliseconds 80; [System.Windows.Forms.SendKeys]::SendWait('^c')`
      ], {
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
 * Uses PowerShell with -WindowStyle Hidden instead of sendkeys.exe
 */
export function simulatePaste(): Promise<void> {
  return new Promise((resolve) => {
    if (process.platform === 'win32') {
      // PowerShell approach: completely invisible, no CMD window ever appears
      spawn('powershell.exe', [
        '-NoProfile',
        '-NonInteractive',
        '-WindowStyle', 'Hidden',
        '-Command',
        `Add-Type -AssemblyName System.Windows.Forms; Start-Sleep -Milliseconds 80; [System.Windows.Forms.SendKeys]::SendWait('^v')`
      ], {
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
