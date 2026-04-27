import {
  DEFAULT_AUTHENTICATED_ROUTE,
  HIDDEN_MVP_ROUTES,
  canAccessMvpInviteOnly,
  canAccessInternalMvpAdmin,
  isHiddenMvpRoute,
} from '@/config/routes/access';

describe('route access rules', () => {
  it('pins the authenticated default route to the MVP workspace', () => {
    expect(DEFAULT_AUTHENTICATED_ROUTE).toBe('/mvp');
  });

  it('marks the out-of-scope product routes as hidden from the MVP shell', () => {
    expect(HIDDEN_MVP_ROUTES).toEqual(
      expect.arrayContaining([
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
      ]),
    );
    expect(isHiddenMvpRoute('/tasks')).toBe(true);
    expect(isHiddenMvpRoute('/habits')).toBe(true);
    expect(isHiddenMvpRoute('/calendar')).toBe(true);
  });

  it('only enables the internal admin surface for local or explicitly enabled environments', () => {
    expect(canAccessInternalMvpAdmin({ dev: false, hostname: 'app.lifeos.test' })).toBe(false);
    expect(canAccessInternalMvpAdmin({ dev: true, hostname: 'app.lifeos.test' })).toBe(true);
    expect(canAccessInternalMvpAdmin({ dev: false, hostname: 'localhost' })).toBe(true);
    expect(canAccessInternalMvpAdmin({ dev: false, hostname: 'app.lifeos.test', internalAdminFlag: 'true' })).toBe(true);
  });

  it('enforces invite-only MVP access outside local and development environments', () => {
    expect(canAccessMvpInviteOnly({ dev: false, hostname: 'app.lifeos.test' })).toBe(false);
    expect(canAccessMvpInviteOnly({ dev: false, hostname: 'app.lifeos.test', inviteCode: 'INVITE-123' })).toBe(true);
    expect(canAccessMvpInviteOnly({ dev: false, hostname: 'app.lifeos.test', invitedPartner: true })).toBe(true);
    expect(canAccessMvpInviteOnly({ dev: false, hostname: 'localhost' })).toBe(true);
    expect(canAccessMvpInviteOnly({ dev: true, hostname: 'app.lifeos.test' })).toBe(true);
    expect(canAccessMvpInviteOnly({ dev: false, hostname: 'app.lifeos.test', inviteGateBypassFlag: 'true' })).toBe(true);
  });
});
