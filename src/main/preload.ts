import { contextBridge, ipcRenderer } from 'electron';

contextBridge.exposeInMainWorld('api', {
  getSettings: () => ipcRenderer.invoke('get-settings'),
  saveSettings: (settings: any) => ipcRenderer.invoke('save-settings', settings),
  getModels: (provider: string) => ipcRenderer.invoke('get-models', provider),
  closeSettings: () => ipcRenderer.send('close-settings'),
  getAppVersion: () => ipcRenderer.invoke('get-app-version'),
  checkForUpdates: () => ipcRenderer.invoke('check-for-updates'),
  openExternalUrl: (url: string) => ipcRenderer.send('open-external-url', url),
  onHUDUpdate: (callback: (data: any) => void) => {
    const listener = (_event: any, data: any) => callback(data);
    ipcRenderer.on('hud-update', listener);
    return () => {
      ipcRenderer.off('hud-update', listener);
    };
  }
});
