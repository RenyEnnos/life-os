const INTERNAL_HOSTNAMES = new Set(['localhost', '127.0.0.1']);

export const DEFAULT_AUTHENTICATED_ROUTE = '/mvp';

export const HIDDEN_MVP_ROUTES = [
  '/tasks',
  '/habits',
  '/ai-assistant',
  '/focus',
  '/gamification',
  '/design',
  '/projects',
  '/university',
  '/calendar',
  '/journal',
  '/health',
  '/finances',
] as const;

export function isHiddenMvpRoute(path: string): boolean {
  return HIDDEN_MVP_ROUTES.includes(path as (typeof HIDDEN_MVP_ROUTES)[number]);
}

export function canAccessInternalMvpAdmin(options?: {
  dev?: boolean;
  hostname?: string;
  internalAdminFlag?: string | boolean;
}): boolean {
  const hostname = options?.hostname ?? '';
  const internalAdminFlag = options?.internalAdminFlag;

  if (internalAdminFlag === true || internalAdminFlag === 'true') {
    return true;
  }

  if (options?.dev) {
    return true;
  }

  return INTERNAL_HOSTNAMES.has(hostname);
}

export function canAccessMvpInviteOnly(options?: {
  dev?: boolean;
  hostname?: string;
  inviteCode?: string;
  invitedPartner?: string | boolean;
  inviteGateBypassFlag?: string | boolean;
}): boolean {
  const hostname = options?.hostname ?? '';
  const inviteCode = options?.inviteCode?.trim();
  const invitedPartner = options?.invitedPartner;
  const inviteGateBypassFlag = options?.inviteGateBypassFlag;

  if (inviteGateBypassFlag === true || inviteGateBypassFlag === 'true') {
    return true;
  }

  if (options?.dev || INTERNAL_HOSTNAMES.has(hostname)) {
    return true;
  }

  if (invitedPartner === true || invitedPartner === 'true') {
    return true;
  }

  return Boolean(inviteCode);
}

export function getMvpRuntimeAccess() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : '';

  return {
    defaultAuthenticatedRoute: DEFAULT_AUTHENTICATED_ROUTE,
    canAccessInternalAdmin: canAccessInternalMvpAdmin({
      dev: import.meta.env.DEV,
      hostname,
      internalAdminFlag: import.meta.env.VITE_ENABLE_INTERNAL_MVP_ADMIN,
    }),
  };
}
