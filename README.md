<div align="center">

# ⚡ stackorbitAI — Vibe Coding Prompt Improver

<p align="center">
  <b>The ultra-fast, cross-platform background desktop utility to capture, enhance, and auto-paste AI coding prompts in any application.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.8-6c5ce7?style=for-the-badge" alt="Version 1.0.8"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-00cec9?style=for-the-badge" alt="Platforms"/>
  <img src="https://img.shields.io/badge/license-MIT-00b894?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/electron-30.1.0-47a248?style=for-the-badge&logo=electron" alt="Electron"/>
  <img src="https://img.shields.io/badge/react-19.0.0-61dafb?style=for-the-badge&logo=react" alt="React"/>
</p>

</div>

---

## 📥 Download v1.0.8 (Latest Release)

> **Direct download links for all supported operating systems and CPU architectures:**

### 🪟 Windows (.exe)

| Architecture | Download Link | File Size |
|---|---|---|
| **Windows x64** (Standard 64-bit PC — Recommended) | [⬇️ Download .exe (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.8-x64.exe) | ~85 MB |
| **Windows ARM64** (Snapdragon / Surface) | [⬇️ Download .exe (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.8-arm64.exe) | ~88 MB |
| **Windows Universal Installer** | [⬇️ Download .exe (Universal)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.8.exe) | ~171 MB |

### 🍎 macOS (.dmg)

| Chip Type | Download Link | File Size |
|---|---|---|
| **Apple Silicon (M1 / M2 / M3 / M4)** | [⬇️ Download .dmg (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8-arm64.dmg) | ~107 MB |
| **Intel Mac (x64)** | [⬇️ Download .dmg (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8.dmg) | ~112 MB |

### 🐧 Linux (.AppImage / .deb / .rpm)

| Package Format | Architecture | Download Link |
|---|---|---|
| **AppImage** (Portable, works on all Linux) | x86_64 | [⬇️ Download .AppImage](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8.AppImage) |
| **AppImage** (Portable) | arm64 | [⬇️ Download .AppImage (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8-arm64.AppImage) |
| **Debian / Ubuntu (.deb)** | amd64 | [⬇️ Download .deb](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver_1.0.8_amd64.deb) |
| **Debian / Ubuntu (.deb)** | arm64 | [⬇️ Download .deb (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver_1.0.8_arm64.deb) |
| **Fedora / RHEL (.rpm)** | x86_64 | [⬇️ Download .rpm](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8.x86_64.rpm) |
| **Fedora / RHEL (.rpm)** | aarch64 | [⬇️ Download .rpm (aarch64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.8/stackorbitai-vibe-coding-prompt-improver-1.0.8.aarch64.rpm) |

---

## ⚡ How It Works

1. **Type Anywhere**: Write your raw coding prompt in any app (VS Code, Cursor, ChatGPT, Claude.ai, Notepad, terminal — anywhere).
2. **Select Your Text**: Highlight the prompt text you want to improve.
3. **Press Global Shortcut**: Press `Ctrl+Shift+X` (or your custom combo).
4. **AI Enhancement**: Floating HUD overlay pops up, captures your selected text, and rewrites it into a structured, technically precise coding prompt using AI.
5. **Auto-Paste**: The improved prompt is instantly pasted back into your active input — ready to use!

---

## ✨ Features & Changelog

### 🌟 v1.0.8 — Shortcut Enhancement & Zero-Popup Fix
- **🔧 CMD Window ELIMINATED**: Replaced the old `sendkeys.exe` binary with a native PowerShell `-WindowStyle Hidden` approach. No CMD console window will ever appear when pressing the enhancement shortcut.
- **🚀 Faster Key Simulation**: PowerShell's `System.Windows.Forms.SendKeys` is called natively — no external binary spawn overhead.
- **📦 Smaller Installer**: Removed the bundled `sendkeys.exe` binary from installer packages.

### v1.0.7 — Fixes & New Icon
- Correct GitHub Releases URL in the app's Updates tab.
- New sleek circular metallic app icon across Windows, macOS, and Linux shortcuts.
- Single instance protection — no duplicate background processes.

### v1.0.6 — CMD Popup First Fix Attempt
- Added `windowsHide: true` to child process calls.
- Recompiled sendkeys.exe with `/target:winexe`.

---

## 🛠️ Core Capabilities

- **Universal Compatibility**: Works system-wide across all browsers, IDEs, terminals, and text inputs — no browser extension needed.
- **Multi-Provider AI**: Configure OpenAI (GPT-4o), Anthropic Claude, Google Gemini, or OpenRouter.
- **Customizable Global Hotkey**: Set any modifier+key combination.
- **Privacy First**: API keys stored securely and locally on your device only.
- **24-Hour Auto Update Checker**: Integrated with GitHub Releases API.

---

## 💻 Tech Stack

- **Electron 30** — Cross-platform desktop runtime
- **React 19 & TypeScript** — Dashboard and HUD UI
- **Tailwind CSS** — Dark-mode styling
- **Vite & tsup** — Lightning-fast build tooling
- **electron-builder** — Multi-arch installer packaging

---

## 🛠️ Local Development

```bash
# Clone
git clone https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux.git
cd stackorbitAI-vibe-coding-prompt-improver-mac-win-linux

# Install
npm install --legacy-peer-deps

# Development mode
npm run dev

# Build production packages
npm run package:win    # Windows .exe
npm run package:mac    # macOS .dmg  
npm run package:linux  # Linux .AppImage / .deb
```

---

## 📜 License

MIT © [StackOrbitAI](https://github.com/StackOrbitAI)
