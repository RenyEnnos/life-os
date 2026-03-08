export function isElectronRuntime(): boolean {
  return typeof window !== 'undefined' && typeof window.electron !== 'undefined'
}

export function isDesktopApp(): boolean {
  return isElectronRuntime()
}
