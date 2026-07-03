<div align="center">

<img src="https://img.shields.io/badge/version-1.0.0-blueviolet?style=for-the-badge" alt="Version 1.0.0"/>
<img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-informational?style=for-the-badge" alt="Platforms"/>
<img src="https://img.shields.io/badge/license-MIT-green?style=for-the-badge" alt="MIT License"/>
<img src="https://img.shields.io/badge/Electron-React-blue?style=for-the-badge&logo=electron" alt="Electron + React"/>

# ⚡ stackorbitAI — Vibe Coding Prompt Improver

### The cross-platform background utility that supercharges your coding prompts using AI — in any app, instantly.

</div>

---

## 📥 Download v1.0.0

> **Pick the right installer for your OS and chip below.**

### 🪟 Windows

| Architecture | Download |
|---|---|
| **Windows x64** (64-bit Intel/AMD — most PCs) | [⬇️ Download .exe (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.0-x64.exe) |
| **Windows ARM64** (Surface Pro X, Snapdragon PCs) | [⬇️ Download .exe (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.0-arm64.exe) |
| **Windows Universal** (Both x64 + arm64 combined) | [⬇️ Download .exe (universal)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-Setup-1.0.0.exe) |

### 🍎 macOS

| Architecture | Download |
|---|---|
| **macOS Intel** (older Mac with Intel chip) | [⬇️ Download .dmg (x64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-x64.dmg) |
| **macOS Apple Silicon** (M1 / M2 / M3 / M4) | [⬇️ Download .dmg (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-arm64.dmg) |

### 🐧 Linux

| Format | Architecture | Download |
|---|---|---|
| **AppImage** (Universal, no install needed) | x86_64 (64-bit) | [⬇️ Download .AppImage](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-x86_64.AppImage) |
| **AppImage** (Universal) | arm64 | [⬇️ Download .AppImage (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-arm64.AppImage) |
| **Debian / Ubuntu (.deb)** | amd64 (64-bit) | [⬇️ Download .deb](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-amd64.deb) |
| **Debian / Ubuntu (.deb)** | arm64 | [⬇️ Download .deb (arm64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-arm64.deb) |
| **RPM (Fedora / CentOS / RHEL)** | x86_64 | [⬇️ Download .rpm](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-x86_64.rpm) |
| **RPM** | aarch64 | [⬇️ Download .rpm (aarch64)](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.0/stackorbitai-vibe-coding-prompt-improver-1.0.0-aarch64.rpm) |

---

## 🚀 What Does It Do?

**stackorbitAI Vibe Coding Prompt Improver** runs silently in the background (system tray / menu bar).

1. 📝 You type a rough, quick coding prompt in **any app** — ChatGPT, Claude.ai, Cursor, VS Code, Notepad, anything.
2. ⌨️ Press your **global keyboard shortcut** (default: `Ctrl+Shift+Space` / `⌘+Shift+Space`)
3. 🤖 The app **captures** the selected text, sends it to an AI model (OpenAI / Gemini / Anthropic), and gets back a **dramatically improved, professional-grade prompt**.
4. 📋 The improved prompt is **automatically pasted** back into the same text field — no copy-paste needed.

---

## ✨ Key Features

| Feature | Description |
|---|---|
| 🌐 **Works Everywhere** | Browser, IDE, any desktop app — no integration needed |
| ⚡ **Global Shortcut** | Trigger from any window with a customizable hotkey |
| 🤖 **Multi-AI Support** | OpenAI GPT-4o, Google Gemini, Anthropic Claude |
| 🎨 **Beautiful HUD** | Floating overlay shows real-time AI enhancement |
| 🔒 **Privacy First** | Your API keys stay local on your machine |
| 🖥️ **System Tray** | Runs silently in background, zero distraction |
| ⚙️ **Customizable** | Change shortcut, AI model, prompt style |

---

## 🛠️ Tech Stack

- **Electron** — Cross-platform desktop shell
- **React + TypeScript** — UI components
- **Tailwind CSS** — Styling
- **Vite** — Build tool
- **electron-builder** — Cross-platform packaging (win/mac/linux)
- **GitHub Actions** — Automated CI/CD builds and releases

---

## 🏗️ Build From Source

```bash
# Clone the repo
git clone https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux.git
cd stackorbitAI-vibe-coding-prompt-improver-mac-win-linux

# Install dependencies
npm install --legacy-peer-deps

# Start in development mode
npm run dev

# Build for your current platform
npm run package:win    # Windows
npm run package:mac    # macOS
npm run package:linux  # Linux
```

---

## 📜 License

MIT © [StackOrbitAI](https://github.com/StackOrbitAI)

---

<div align="center">
  Made with ❤️ by <a href="https://github.com/StackOrbitAI">StackOrbitAI</a>
</div>
