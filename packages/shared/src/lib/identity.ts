'use client';

import { z } from 'zod';
import { MEMBER_ID_HEADER, MEMBER_TOKEN_HEADER } from './member-header';
import { isValidShareCode, normalizeShareCode } from './share-code';

const STORAGE_PREFIX = 'manawg_identity:';
const KNOWN_WGS_KEY = 'manawg_known_wgs';

const UUID_V4_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const NAME_MAX_LENGTH = 80;

const storedIdentitySchema = z.object({
	memberId: z.string().regex(UUID_V4_PATTERN, 'memberId must be a valid UUID v4'),
	name: z.string().min(1).max(NAME_MAX_LENGTH),
	// Session token (see @/lib/wg/member-token). Optional so identities
	// stored before this field existed keep parsing — they just stay
	// "legacy" until WgContextProvider's self-heal effect backfills it.
	memberToken: z.string().min(1).optional(),
});

const knownWgSchema = z.object({
	code: z.string(),
	name: z.string().min(1).max(NAME_MAX_LENGTH),
	lastVisitedAt: z.number().finite(),
});

/**
 * Build the auth header object for a given member id. Use this in every
 * mutating fetch call so server-side `requireMember` can verify membership.
 *
 * Pass `memberToken` whenever it is known (from `StoredIdentity.memberToken`)
 * so the request is "verified" rather than merely "legacy" — required for
 * admin-gated routes (WG delete/rename/rotate share code).
 */
export function memberAuthHeader(memberId: string, memberToken?: string): Record<string, string> {
	return {
		[MEMBER_ID_HEADER]: memberId,
		...(memberToken ? { [MEMBER_TOKEN_HEADER]: memberToken } : {}),
	};
}

export interface StoredIdentity {
	memberId: string;
	name: string;
	memberToken?: string;
}

export interface KnownWg {
	code: string;
	name: string;
	lastVisitedAt: number;
}

function safeLocalStorage(): Storage | null {
	if (typeof window === 'undefined') return null;
	try {
		return window.localStorage;
	} catch {
		return null;
	}
}

export function getIdentity(wgId: string): StoredIdentity | null {
	const ls = safeLocalStorage();
	if (!ls) return null;
	const raw = ls.getItem(STORAGE_PREFIX + wgId);
	if (!raw) return null;
	try {
		const parsed: unknown = JSON.parse(raw);
		const result = storedIdentitySchema.safeParse(parsed);
		if (!result.success) return null;
		const { memberId, name, memberToken } = result.data;
		return { memberId, name, ...(memberToken ? { memberToken } : {}) };
	} catch {
		return null;
	}
}

export function setIdentity(wgId: string, identity: StoredIdentity): void {
	const ls = safeLocalStorage();
	if (!ls) return;
	ls.setItem(STORAGE_PREFIX + wgId, JSON.stringify(identity));
}

export function clearIdentity(wgId: string): void {
	const ls = safeLocalStorage();
	if (!ls) return;
	ls.removeItem(STORAGE_PREFIX + wgId);
}

const MAX_KNOWN_WGS = 20;

export function getKnownWgs(): KnownWg[] {
	const ls = safeLocalStorage();
	if (!ls) return [];
	try {
		const raw = ls.getItem(KNOWN_WGS_KEY);
		if (!raw) return [];
		const parsed: unknown = JSON.parse(raw);
		if (!Array.isArray(parsed)) return [];
		const seen = new Set<string>();
		const known: KnownWg[] = [];
		for (const item of parsed) {
			const result = knownWgSchema.safeParse(item);
			if (!result.success) continue;
			const code = normalizeShareCode(result.data.code);
			if (!isValidShareCode(code) || seen.has(code)) continue;
			seen.add(code);
			known.push({ ...result.data, code });
			if (known.length >= MAX_KNOWN_WGS) break;
		}
		return known;
	} catch {
		return [];
	}
}

export function rememberWg(entry: KnownWg): void {
	const ls = safeLocalStorage();
	if (!ls) return;
	const code = normalizeShareCode(entry.code);
	if (!isValidShareCode(code) || entry.name.trim().length === 0) return;
	const normalizedEntry = { ...entry, code, name: entry.name.trim() };
	const existing = getKnownWgs().filter((w) => w.code !== code);
	const next = [normalizedEntry, ...existing].slice(0, MAX_KNOWN_WGS);
	try {
		ls.setItem(KNOWN_WGS_KEY, JSON.stringify(next));
	} catch {
		// Remembering recent WGs is a convenience; blocked storage must not block the WG.
	}
}

export function forgetWg(code: string): void {
	const ls = safeLocalStorage();
	if (!ls) return;
	const normalizedCode = normalizeShareCode(code);
	const filtered = getKnownWgs().filter((w) => w.code !== normalizedCode);
	try {
		ls.setItem(KNOWN_WGS_KEY, JSON.stringify(filtered));
	} catch {
		// Best-effort cleanup only.
	}
}
