# Research: 11 - Security Hardening & Polish

## Current State Analysis
- **Security**: Global rate limiting and Helmet headers are active. CORS is restricted to valid origins.
- **Accessibility**: Standard HTML tags used, but needs verification for complex components (Modals, Custom Selects).
- **Design**: "Deep Glass" theme is consistent in core features but needs a final pass on edge cases (Settings, Profile).
- **Polish**: App feels fast but needs small "micro-interactions" to feel truly premium.

## Technical Strategy
1. **Granular Rate Limiting**: Implement specialized limiters for AI (cost management) and Auth (brute-force protection).
2. **Input Sanitization**: Audit critical POST/PUT routes to ensure Zod validation is rigorous.
3. **Accessibility (WCAG 2.1)**:
   - Add `aria-label` to all icon-only buttons.
   - Ensure color contrast on zinc-500 text meets standards.
   - Implement focus-trap for all custom modals.
4. **Visual Perfection**:
   - Standardize border-radius across all feature cards (using `rounded-3xl` as standard).
   - Ensure glass-morphism consistency (blur amount, opacity).
5. **Sanctuary Polish**: Refine the transition into Focus Mode with better typography and a "Zen" layout.

## Requirements Mapping
- **SEC-01**: Stricter rate limiting on sensitive endpoints.
- **ACC-01**: WCAG 2.1 Level AA compliance.
- **POL-01**: Consistent "Deep Glass" branding across all modules.

## Proposed Waves
- **Wave 1**: Security Hardening (Rate limits & Validation).
- **Wave 2**: Accessibility Audit & Fixes.
- **Wave 3**: Visual Standardization & Polish.
- **Wave 4**: Final Readiness Review.
