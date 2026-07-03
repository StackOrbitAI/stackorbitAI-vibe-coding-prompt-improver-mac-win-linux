# 🚀 stackorbitAI — Vibe Coding Prompt Improver

A production-ready, ultra-lightweight cross-platform desktop application (macOS, Windows, and Linux) that runs silently in the background (tray), captures selected text on a global shortcut trigger, improves the raw coding prompt using an LLM in real-time, and inserts the enhanced prompt back into the active text field.

Ideal for enhancing prompts across ChatGPT, Claude.ai, Cursor, VS Code, or any browser/local text field.

---

## 🌟 Key Features

* **Zero-Configuration Background Service**: Minimizes to system tray/menu bar on boot, listening globally.
* **OS-Native Key Simulation (Anti-Gybe)**: Avoids heavy and buggy C++ native node module compilations (`robotjs`/`nut-js`) by leveraging fast native scripting:
  * **Windows**: Spawns a compiled 10ms C# simulator (`bin/sendkeys.exe`).
  * **macOS**: Spawns built-in AppleScript (`osascript`).
  * **Linux**: Spawns `xdotool`.
* **Glassmorphic Floating HUD**: Transparent overlay appears near the active cursor on trigger, displaying a streaming preview, custom animations, and a smooth token-based progress bar (0–100%).
* **Encrypted API Settings Panel**: Sleek, minimal dark-themed interface containing 2 tabs ("API Keys" and "Shortcut") with encrypted local storage powered by `electron-store`.
* **Dynamic Provider Suite**: Supports OpenAI (GPT), Anthropic Claude, Google Gemini (via OpenAI compatibility), and OpenRouter with real-time dynamic model fetching and static fallback drop-downs.
* **Non-Disruptive Insertion**: Writes the enhanced prompt to the clipboard and pastes it back directly, immediately restoring the user's original clipboard content.

---

## 📂 File Structure

```
stackorbitAI — Vibe Coding Prompt Improver/
├── package.json                    # Main dependencies and build config
├── tsconfig.json                   # TypeScript compiler configuration
├── vite.config.ts                  # Vite configuration for bundling React Renderer
├── tailwind.config.js              # Tailwind styling directives
├── postcss.config.js               # CSS processing options
├── .gitignore                      # Git exclusion list
├── bin/
│   └── sendkeys.exe                # [Compiled] Windows C# keyboard simulator binary
├── scripts/
│   └── dev.js                      # Local development runtime orchestrator
├── src/
│   ├── main/
│   │   ├── index.ts                # Electron Main process and lifecycle
│   │   ├── preload.ts              # Secure context-bridge IPC declarations
│   │   └── services/
│   │       ├── ai.ts               # SSE stream parser (OpenAI, Claude, OpenRouter, Gemini)
│   │       ├── keyboard.ts         # OS-specific simulated key event wrappers
│   │       ├── store.ts            # Encrypted setting configuration store
│   │       └── sendkeys.cs         # C# keyboard simulator source code
│   └── renderer/
│       ├── index.html              # Main HTML mounting container
│       ├── main.tsx                # React app mount script
│       ├── index.css               # Tailwind imports and scrollbar declarations
│       ├── App.tsx                 # Simple view router between Settings and HUD
│       └── components/
│           ├── Settings.tsx        # Configurations layout and hotkey recorder
│           └── HUD.tsx             # Floating status progress window
```

---

## 🛠️ Installation & Setup (Local Development)

This workspace contains a portable Node.js toolchain located inside the `node/` folder. All commands execute locally without depending on system-wide Node/npm installations.

### 1. Install Dependencies
Run the command below in the project root folder. The `--legacy-peer-deps` flag prevents warnings from React 19:
```bash
# Windows (portable Node.js syntax)
.\node\npm.cmd install --legacy-peer-deps

# Standard (if Node.js is installed globally on your machine)
npm install --legacy-peer-deps
```

### 2. Run the Development Server
Launches the React hot-reload Vite server and compiles the Electron main files in watch mode:
```bash
# Windows (portable Node.js syntax)
.\node\npm.cmd run dev

# Standard (if Node.js is installed globally on your machine)
npm run dev
```

---

## 📦 Production Builds (Cross-Platform Packing)

We configure `electron-builder` to package assets and target each OS platform.

### Windows (`.exe` NSIS installer)
```bash
# Compiles React renderer, main thread, and generates the Windows NSIS setup package
.\node\npm.cmd run package:win
```
*Output file:* `release/stackorbitai-vibe-coding-prompt-improver-Setup-[version]-x64.exe`

### macOS (`.dmg` Apple Silicon + Intel)
Multi-arch DMG packaging compiles both `arm64` and `x64` binaries:
```bash
npm run package:mac
```
*Output file:* `release/stackorbitai-vibe-coding-prompt-improver-[version]-arm64.dmg` (for M1/M2/M3) and `release/stackorbitai-vibe-coding-prompt-improver-[version]-x64.dmg` (for Intel).

### Linux (`.AppImage` and `.deb`)
```bash
npm run package:linux
```
*Output files:* `release/stackorbitai-vibe-coding-prompt-improver-[version].AppImage` and `release/stackorbitai-vibe-coding-prompt-improver_[version]_amd64.deb`.

---

## 📋 Implementation Details

### Keyboard Simulation Implementation
Instead of relying on native node packages which require C++ compilation, we delegate system-wide simulated copying and pasting to:
* **Windows**: A custom compiled C# console app using `System.Windows.Forms.SendKeys` that takes an input key argument (e.g. `^c` for Ctrl+C, `^v` for Ctrl+V) and triggers it with a 100ms key-release buffer delay.
* **macOS**: An AppleScript command executing keystrokes within `System Events`:
  `osascript -e 'delay 0.1' -e 'tell application "System Events" to keystroke "c" using {command down}'`
* **Linux**: A terminal tool execution:
  `xdotool key ctrl+c`

### Settings Store Encryption
Credentials and API keys are stored in a local JSON config encrypted using AES-256-CBC, managed natively by `electron-store`'s `encryptionKey` option, protecting model API keys from plain-text file reading attacks.
