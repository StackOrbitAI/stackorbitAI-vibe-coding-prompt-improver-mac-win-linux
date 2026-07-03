import { app, globalShortcut, Tray, BrowserWindow } from 'electron';
import { store, ReleaseItem } from './store';

const GITHUB_REPO = 'StackOrbitAI/stackorbitAI-vibe-coding-prompt-improver-mac-win-linux';

function isNewerVersion(current: string, latest: string): boolean {
  const cleanCurrent = current.replace(/^v/, '');
  const cleanLatest = latest.replace(/^v/, '');
  
  const currParts = cleanCurrent.split('.').map(Number);
  const lateParts = cleanLatest.split('.').map(Number);
  
  for (let i = 0; i < Math.max(currParts.length, lateParts.length); i++) {
    const curr = currParts[i] || 0;
    const late = lateParts[i] || 0;
    if (late > curr) return true;
    if (curr > late) return false;
  }
  return false;
}

export async function fetchReleasesHistory(): Promise<ReleaseItem[]> {
  try {
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases`, {
      headers: {
        'User-Agent': 'StackOrbitAI-Updater',
        'Accept': 'application/vnd.github+json'
      }
    });

    if (!response.ok) return [];

    const data = await response.json();
    if (!Array.isArray(data)) return [];

    return data
      .filter((r: any) => !r.draft)
      .map((r: any) => ({
        id: r.id,
        tagName: r.tag_name || '',
        name: r.name || r.tag_name || '',
        publishedAt: r.published_at || '',
        body: r.body || '',
        htmlUrl: r.html_url || `https://github.com/${GITHUB_REPO}/releases`,
        assets: (r.assets || []).map((a: any) => ({
          name: a.name || '',
          size: a.size || 0,
          downloadUrl: a.browser_download_url || '',
        }))
      }));
  } catch (e) {
    console.error('Failed to fetch releases history:', e);
    return [];
  }
}

export async function checkForUpdates(manual: boolean = false): Promise<{
  success: boolean;
  updateAvailable: boolean;
  latestVersion: string;
  releaseNotes: string;
  publishedAt: string;
  allReleases: ReleaseItem[];
  error?: string;
}> {
  try {
    const currentVersion = app.getVersion();
    const allReleases = await fetchReleasesHistory();
    
    const latestRelease = allReleases[0];
    const latestVersion = latestRelease ? latestRelease.tagName : currentVersion;
    const releaseNotes = latestRelease ? latestRelease.body : '';
    const publishedAt = latestRelease ? latestRelease.publishedAt : '';
    const htmlUrl = latestRelease ? latestRelease.htmlUrl : `https://github.com/${GITHUB_REPO}/releases`;

    const updateAvailable = isNewerVersion(currentVersion, latestVersion);

    // Save check state to store
    store.set({
      lastUpdateCheck: Date.now(),
      latestVersionAvailable: latestVersion,
      isUpdateAvailable: updateAvailable,
      updateUrl: htmlUrl,
      latestReleaseNotes: releaseNotes,
      allReleases: allReleases
    });

    return {
      success: true,
      updateAvailable,
      latestVersion,
      releaseNotes,
      publishedAt,
      allReleases
    };
  } catch (error: any) {
    console.error('Failed to check for updates:', error);
    return {
      success: false,
      updateAvailable: false,
      latestVersion: '',
      releaseNotes: '',
      publishedAt: '',
      allReleases: [],
      error: error.message || 'Unknown error'
    };
  }
}

/**
 * Taskbar & Tray Cleanup when updating — ensures seamless transition
 */
export function prepareAppExitForUpdate(tray: Tray | null, windows: (BrowserWindow | null)[]) {
  try {
    // 1. Unregister all hotkeys
    globalShortcut.unregisterAll();

    // 2. Destroy tray icon to remove app from notification area
    if (tray) {
      tray.destroy();
    }

    // 3. Destroy all windows to remove app from Windows Taskbar immediately
    for (const win of windows) {
      if (win && !win.isDestroyed()) {
        win.destroy();
      }
    }
  } catch (e) {
    console.error('Error during update cleanup:', e);
  }
}

export function initAutoUpdater() {
  const ONE_DAY = 24 * 60 * 60 * 1000;
  
  const runCheckIfNeeded = async () => {
    const lastCheck = store.get('lastUpdateCheck') || 0;
    const timeSinceLastCheck = Date.now() - lastCheck;
    
    if (timeSinceLastCheck >= ONE_DAY) {
      console.log('Running scheduled 24-hour automatic update check...');
      await checkForUpdates(false);
    }
  };

  // Run initial check on app startup (after 5 seconds delay)
  setTimeout(() => {
    runCheckIfNeeded().catch(err => console.error('Startup update check failed:', err));
  }, 5000);

  // Check every hour if we need to perform the daily update check
  setInterval(() => {
    runCheckIfNeeded().catch(err => console.error('Scheduled update check failed:', err));
  }, 60 * 60 * 1000);
}
