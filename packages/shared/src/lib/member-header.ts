/**
 * Header name the API expects on every mutating /api/wg/[code]/* request.
 *
 * Lives in a server-safe module (no `'use client'`) so both API routes and
 * client code can import it without triggering Next.js's client/server
 * boundary wrapping.
 */
export const MEMBER_ID_HEADER = 'x-manawg-member-id';

/**
 * Header carrying the HMAC session token derived from
 * `MEMBER_SESSION_SECRET` (see `@/lib/wg/member-token`). Optional on most
 * requests (legacy `x-manawg-member-id`-only auth still works for
 * non-destructive routes) but required for admin-gated mutations
 * (WG delete/rename/rotate-share-code).
 */
export const MEMBER_TOKEN_HEADER = 'x-manawg-member-token';
