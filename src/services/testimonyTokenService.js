/**
 * Secure Anonymous Testimonial Token Service
 * 
 * Manages client-side cryptographic deletion tokens stored in localStorage.
 * Tokens are never shared publicly. Only the SHA-256 hash of the token is sent to the server on creation.
 * During deletion, the client presents the private token to prove ownership.
 */

const STORAGE_KEY = 'fc_testimony_tokens';

/**
 * Generate a cryptographically secure 256-bit random hex token (64 characters).
 */
export function generateDeletionToken() {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.getRandomValues) {
    const buffer = new Uint8Array(32);
    window.crypto.getRandomValues(buffer);
    return Array.from(buffer)
      .map((b) => b.toString(16).padStart(2, '0'))
      .join('');
  }
  // Fallback if crypto.getRandomValues is unavailable
  return Array.from({ length: 64 }, () => Math.floor(Math.random() * 16).toString(16)).join('');
}

/**
 * Compute the SHA-256 hash of a string using the Web Crypto API.
 * Returns a 64-character lowercase hex string.
 */
export async function hashDeletionToken(token) {
  if (typeof window !== 'undefined' && window.crypto && window.crypto.subtle) {
    const encoder = new TextEncoder();
    const data = encoder.encode(token);
    const hashBuffer = await window.crypto.subtle.digest('SHA-256', data);
    const hashArray = Array.from(new Uint8Array(hashBuffer));
    return hashArray.map((b) => b.toString(16).padStart(2, '0')).join('');
  }
  throw new Error('Web Crypto API is required for token hashing');
}

/**
 * Read the token map from localStorage.
 * Format: { [testimonyId]: rawTokenString }
 */
export function getStoredTokens() {
  if (typeof window === 'undefined' || !window.localStorage) return {};
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) return {};
    const parsed = JSON.parse(raw);
    return typeof parsed === 'object' && parsed !== null ? parsed : {};
  } catch (err) {
    console.warn('Failed to parse local testimony tokens:', err);
    return {};
  }
}

/**
 * Save an ownership token for a specific testimony in localStorage.
 */
export function saveLocalTestimonyToken(testimonyId, token) {
  if (typeof window === 'undefined' || !window.localStorage || !testimonyId || !token) return;
  try {
    const tokens = getStoredTokens();
    tokens[testimonyId] = token;
    localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
  } catch (err) {
    console.error('Failed to save local testimony token:', err);
  }
}

/**
 * Retrieve the deletion token for a testimony from localStorage.
 */
export function getLocalTestimonyToken(testimonyId) {
  if (!testimonyId) return null;
  const tokens = getStoredTokens();
  return tokens[testimonyId] || null;
}

/**
 * Remove an ownership token for a testimony from localStorage (e.g. after successful delete).
 */
export function removeLocalTestimonyToken(testimonyId) {
  if (typeof window === 'undefined' || !window.localStorage || !testimonyId) return;
  try {
    const tokens = getStoredTokens();
    if (tokens[testimonyId]) {
      delete tokens[testimonyId];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(tokens));
    }
  } catch (err) {
    console.error('Failed to remove local testimony token:', err);
  }
}

/**
 * Check whether the current browser owns a specific testimony.
 */
export function isTestimonyOwner(testimonyId) {
  if (!testimonyId) return false;
  const tokens = getStoredTokens();
  return Boolean(tokens[testimonyId]);
}
