<div align="center">

# ⚡ stackorbitAI — Vibe Coding Prompt Improver

<p align="center">
  <b>The ultra-fast, cross-platform background desktop utility to capture, enhance, and auto-paste AI coding prompts in any application.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.11-6c5ce7?style=for-the-badge" alt="Version 1.0.11"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-00cec9?style=for-the-badge" alt="Platforms"/>
  <img src="https://img.shields.io/badge/license-MIT-00b894?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/electron-30.1.0-47a248?style=for-the-badge&logo=electron" alt="Electron"/>
  <img src="https://img.shields.io/badge/react-19.0.0-61dafb?style=for-the-badge&logo=react" alt="React"/>
</p>

</div>

---

## 📥 Download v1.0.11 (Latest Release)

> **Direct download links for all supported operating systems and CPU architectures:**

### 🪟 Windows (.exe)

| Architecture | Download Link | File Size |
|---|---|---|
| **Windows x64** (Standard 64-bit PC — Recommended) | [⬇️ Download .exe (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.11-x64.exe) | ~85 MB |
| **Windows ARM64** (Snapdragon / Surface) | [⬇️ Download .exe (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.11-arm64.exe) | ~88 MB |
| **Windows Universal Installer** | [⬇️ Download .exe (Universal)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.11.exe) | ~171 MB |

### 🍎 macOS (.dmg)

| Chip Type | Download Link | File Size |
|---|---|---|
| **Apple Silicon (M1 / M2 / M3 / M4)** | [⬇️ Download .dmg (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11-arm64.dmg) | ~107 MB |
| **Intel Mac (x64)** | [⬇️ Download .dmg (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11.dmg) | ~112 MB |

### 🐧 Linux (.AppImage / .deb / .rpm)

| Package Format | Architecture | Download Link |
|---|---|---|
| **AppImage** (Portable, works on all Linux) | x86_64 | [⬇️ Download .AppImage](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11.AppImage) |
| **AppImage** (Portable) | arm64 | [⬇️ Download .AppImage (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11-arm64.AppImage) |
| **Debian / Ubuntu (.deb)** | amd64 | [⬇️ Download .deb](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver_1.0.11_amd64.deb) |
| **Debian / Ubuntu (.deb)** | arm64 | [⬇️ Download .deb (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver_1.0.11_arm64.deb) |
| **Fedora / RHEL (.rpm)** | x86_64 | [⬇️ Download .rpm](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11.x86_64.rpm) |
| **Fedora / RHEL (.rpm)** | aarch64 | [⬇️ Download .rpm (aarch64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.11/stackorbitai-vibe-coding-prompt-improver-1.0.11.aarch64.rpm) |

---

## ⌨️ Usage Instructions & Shortcuts

### 1. Default Activation Shortcuts

The software runs quietly in the system tray. Select any prompt text in your code editor or browser and press the global hotkey:

- **Windows & Linux**: `Ctrl+Shift+P` *(or `Ctrl+Shift+X`)*
- **macOS**: `Command+Shift+P` *(or `Cmd+Shift+X`)*

---

### 2. How to Change Shortcut Keys

1. Launch the app or open **Settings** by double-clicking the System Tray icon.
2. Select the **Shortcut** tab from the left sidebar navigation menu.
3. Click inside the **Shortcut Recorder** box (it will prompt: *"Press key combination..."*).
4. Press your desired key combination on your keyboard (e.g. `Ctrl+Alt+S` or `Cmd+Shift+K`).
5. Click **Done** and press **Save Settings** in the bottom-right corner to activate the shortcut immediately system-wide.

---

## 🔄 Software Updates & Notification Behavior

- **Automated Check**: Scans for new version releases every 24 hours in the background.
- **Manual Check**: Click **Check for Updates Now** inside the **Updates** tab at any time.

---

## ✨ Features & Changelog

### 🌟 v1.0.11 — Enhanced Paste Focus & Clean Release Body
- **Focus Stealing Prevention**: HUD overlay uses `showInactive()` so target editor (VS Code, Cursor, Chrome, ChatGPT) retains keyboard focus when HUD pops up.
- **Reliable Paste Continuity**: Consecutive prompt enhancements no longer get stuck or overwrite clipboard prematurely.
- **Clean Release Page Layout**: GitHub Release page now presents clean direct download links per OS platform without extra generic text block instructions.

---

## 📜 License

MIT © [StackOrbitAI](https://github.com/StackOrbitAI)
