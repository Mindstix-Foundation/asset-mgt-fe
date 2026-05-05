/**
 * Cryptographically secure random utilities.
 * Uses crypto.getRandomValues() instead of Math.random() to satisfy Sonar S2245.
 */

export function secureRandomInt(max: number): number {
  const buf = new Uint32Array(1)
  crypto.getRandomValues(buf)
  return buf[0] % max
}

export function secureRandomHex(bytes: number = 16): string {
  const buf = new Uint8Array(bytes)
  crypto.getRandomValues(buf)
  return Array.from(buf, (x) => x.toString(16).padStart(2, '0')).join('')
}

export function secureRandomString(length: number = 9): string {
  const chars = 'abcdefghijklmnopqrstuvwxyz0123456789'
  const buf = new Uint8Array(length)
  crypto.getRandomValues(buf)
  return Array.from(buf, (x) => chars[x % chars.length]).join('')
}
