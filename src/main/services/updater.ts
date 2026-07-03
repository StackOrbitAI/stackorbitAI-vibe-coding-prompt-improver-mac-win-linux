import { app } from 'electron';
import { store } from './store';

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

export async function checkForUpdates(manual: boolean = false): Promise<{
  success: boolean;
  updateAvailable: boolean;
  latestVersion: string;
  error?: string;
}> {
  try {
    const currentVersion = app.getVersion();
    
    const response = await fetch(`https://api.github.com/repos/${GITHUB_REPO}/releases/latest`, {
      headers: {
        'User-Agent': 'StackOrbitAI-Updater'
      }
    });

    if (!response.ok) {
      throw new Error(`GitHub API returned status ${response.status}`);
    }

    const releaseData = await response.json();
    const latestVersion = releaseData.tag_name || '';
    const htmlUrl = releaseData.html_url || `https://github.com/${GITHUB_REPO}/releases`;

    const updateAvailable = isNewerVersion(currentVersion, latestVersion);

    // Save check state to store
    store.set({
      lastUpdateCheck: Date.now(),
      latestVersionAvailable: latestVersion,
      isUpdateAvailable: updateAvailable,
      updateUrl: htmlUrl
    });

    return {
      success: true,
      updateAvailable,
      latestVersion
    };
  } catch (error: any) {
    console.error('Failed to check for updates:', error);
    return {
      success: false,
      updateAvailable: false,
      latestVersion: '',
      error: error.message || 'Unknown error'
    };
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
