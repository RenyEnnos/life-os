import { ipcMain, type IpcMainInvokeEvent } from 'electron';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

import { isLocalDesktopAuthAllowed } from '../auth/desktopSession';

export function isTrustedRendererUrl(rawUrl: string) {
  const url = new URL(rawUrl);
  if (url.protocol === 'file:' && process.env.DIST) {
    return path.resolve(fileURLToPath(rawUrl)) === path.resolve(process.env.DIST, 'index.html');
  }
  const devUrl = process.env.VITE_DEV_SERVER_URL;
  return Boolean(isLocalDesktopAuthAllowed() && devUrl && url.origin === new URL(devUrl).origin);
}

export function assertTrustedIpcSender(event: IpcMainInvokeEvent) {
  const rawUrl = event.senderFrame?.url;
  if (rawUrl && isTrustedRendererUrl(rawUrl)) return;
  throw new Error('Untrusted Electron IPC sender');
}

export const handleTrusted = <Args extends unknown[]>(
  channel: string,
  handler: (event: IpcMainInvokeEvent, ...args: Args) => unknown,
) => ipcMain.handle(channel, async (event, ...args) => {
  assertTrustedIpcSender(event);
  return handler(event, ...(args as Args));
});
