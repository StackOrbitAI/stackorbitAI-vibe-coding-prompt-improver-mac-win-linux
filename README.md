<div align="center">

# ⚡ stackorbitAI — Vibe Coding Prompt Improver

<p align="center">
  <b>The ultra-fast, cross-platform background desktop utility to capture, enhance, and auto-paste AI coding prompts in any application.</b>
</p>

<p align="center">
  <img src="https://img.shields.io/badge/version-1.0.24-6c5ce7?style=for-the-badge" alt="Version 1.0.24"/>
  <img src="https://img.shields.io/badge/platform-Windows%20%7C%20macOS%20%7C%20Linux-00cec9?style=for-the-badge" alt="Platforms"/>
  <img src="https://img.shields.io/badge/license-MIT-00b894?style=for-the-badge" alt="MIT License"/>
  <img src="https://img.shields.io/badge/electron-30.1.0-47a248?style=for-the-badge&logo=electron" alt="Electron"/>
  <img src="https://img.shields.io/badge/react-19.0.0-61dafb?style=for-the-badge&logo=react" alt="React"/>
</p>

</div>

---

## 📥 Direct Download Links (v1.0.24 Latest Release)

> Select your operating system below for direct one-click installer downloads:

### 🪟 Windows (.exe)

| Architecture | Download Link | File Size | Recommended For |
|---|---|---|---|
| **Windows x64** | [⬇️ Download Vibe-Prompt-Improver-Windows-v1.0.24-x64.exe](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Windows-v1.0.24-x64.exe) | ~85 MB | Standard 64-bit Intel/AMD PCs |
| **Windows ARM64** | [⬇️ Download Vibe-Prompt-Improver-Windows-v1.0.24-arm64.exe](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Windows-v1.0.24-arm64.exe) | ~88 MB | Snapdragon / Surface Pro ARM |
| **Windows Universal** | [⬇️ Download Vibe-Prompt-Improver-Windows-v1.0.24.exe](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Windows-v1.0.24.exe) | ~171 MB | All Windows PCs (Combined) |

### 🍎 macOS (.dmg)

| Chip Type | Download Link | File Size | Recommended For |
|---|---|---|---|
| **Apple Silicon** | [⬇️ Download Vibe-Prompt-Improver-Mac-v1.0.24-arm64.dmg](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Mac-v1.0.24-arm64.dmg) | ~107 MB | Mac M1 / M2 / M3 / M4 |
| **Intel Mac** | [⬇️ Download Vibe-Prompt-Improver-Mac-v1.0.24-x64.dmg](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Mac-v1.0.24-x64.dmg) | ~113 MB | Intel Core Macs |

### 🐧 Linux (.AppImage / .deb / .rpm)

| Package Format | Architecture | Download Link | File Size |
|---|---|---|---|
| **AppImage** | x86_64 | [⬇️ Download Vibe-Prompt-Improver-Linux-v1.0.24-x64.AppImage](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Linux-v1.0.24-x86_64.AppImage) | ~114 MB |
| **Debian / Ubuntu** | amd64 (.deb) | [⬇️ Download Vibe-Prompt-Improver-Linux-v1.0.24-amd64.deb](https://github.com/StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux/releases/download/v1.0.24/Vibe-Prompt-Improver-Linux-v1.0.24-amd64.deb) | ~78 MB |

---

## 🛠️ Complete Installation & Setup Guide

### 🪟 Windows Setup Guide

1. **Download**: Download `Vibe-Prompt-Improver-Windows-v1.0.24-x64.exe` from the table above.
2. **Install**: Double-click the `.exe` file and follow the setup wizard.
3. **Desktop Shortcut & Start Menu**: The installer automatically creates a **StackOrbitAI Vibe Improver** shortcut on your Desktop and in your Start Menu.
4. **First Launch**: The app starts automatically in the background and places an icon in your System Tray (near the clock).
5. **Updating / Stopping Running Instances**:
   - To stop an existing background instance before installing an update, right-click the System Tray icon and select **Quit**.
   - Or open Command Prompt (`cmd.exe`) and run:
     ```cmd
     taskkill /F /IM stackorbitai-vibe-coding-prompt-improver.exe
     ```

---

### 🍎 macOS Setup Guide

1. **Download**: Download `Vibe-Prompt-Improver-Mac-v1.0.24-arm64.dmg` (or `x64.dmg` for Intel Macs).
2. **Install**: Double-click the `.dmg` file and drag **StackOrbitAI Vibe Improver** into your `Applications` folder.
3. **First Launch Security**:
   - If macOS displays *"App from unidentified developer"*, open **System Settings -> Privacy & Security -> General** and click **Open Anyway**.
   - Or open Terminal and run:
     ```bash
     xattr -cr "/Applications/StackOrbitAI Vibe Improver.app"
     ```

---

### 🐧 Linux Setup Guide

- **AppImage**:
  ```bash
  chmod +x Vibe-Prompt-Improver-Linux-v1.0.24-x86_64.AppImage
  ./Vibe-Prompt-Improver-Linux-v1.0.24-x86_64.AppImage
  ```
- **Debian / Ubuntu (.deb)**:
  ```bash
  sudo dpkg -i Vibe-Prompt-Improver-Linux-v1.0.24-amd64.deb
  ```

---

## ⌨️ How to Use & Customize Shortcuts

1. **Highlight Any Text**: Highlight raw or informal prompt text in Cursor, VS Code, Windsurf, ChatGPT, or your browser.
2. **Trigger Shortcut**:
   - **Windows / Linux**: Press `Ctrl+Shift+P` *(or `Ctrl+Shift+X`)*
   - **macOS**: Press `Command+Shift+P` *(or `Cmd+Shift+X`)*
3. **Auto-Enhance & Auto-Paste**: The floating HUD overlay appears, enhances your prompt using AI, copies it to the clipboard, and automatically pastes the improved prompt back into your input box!
4. **Change Shortcut**: Open **Settings -> Shortcut** tab, click the recorder box, press your custom keys, click **Done**, and click **Save Settings**.

---

## 📚 Prompt Library & Custom Preset Builder

Customize the exact AI transformation instructions applied whenever hotkeys are triggered:

1. Open **Settings -> Prompt Library** tab.
2. Choose from pre-configured built-in prompt modes:
   - **Improve & Structure Prompt (Vibe Coding Standard - Default)**: Transforms raw inputs into structured English prompts with Goal, Requirements, Constraints & Output format.
   - **Enhanced Prompt & Technical Precision**: Adds implied technical details and framework best practices.
   - **Always Correct Prompt Without Meaning Change**: Fixes grammar and translates while preserving 100% intent.
   - **Correct Prompt Grammar in English**: Translates Hindi/Hinglish to clean technical English.
3. **Add Custom Preset**: Click **+ Add Custom Preset**, enter your preset Title, Description, and custom AI System Instruction (e.g. *"I want to correct my prompt in English without meaning change"*), then click **Save & Set Active Default**.

---

## 🔄 Automatic Background Update Service

- **Periodic Version Checks**: Checks GitHub Releases automatically every 24 hours in the background.
- **Manual Version Check**: Click **Check for Updates Now** inside **Settings -> Updates** tab.
- **Single-Instance Clean Exit**: Clicking **Download & Relaunch Update** gracefully unregisters hotkeys and closes background tray instances before installing.

---

## 📜 License

MIT © [StackOrbitAI](https://github.com/StackOrbitAI)
