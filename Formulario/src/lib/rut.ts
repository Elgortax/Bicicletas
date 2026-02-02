const BASE_MULTIPLIER = 2;
const MAX_MULTIPLIER = 7;

export function normalizeRut(raw: string) {
  return raw.replace(/\./g, "").replace(/-/g, "").toUpperCase();
}

export function formatRut(raw: string) {
  const normalized = normalizeRut(raw);
  if (normalized.length < 2) {
    return normalized;
  }
  const body = normalized.slice(0, -1);
  const verifier = normalized.slice(-1);
  return `${Number(body).toLocaleString("es-CL")}-${verifier}`;
}

export function isValidRut(raw: string) {
  const cleaned = normalizeRut(raw);
  if (!/^\d{7,8}[0-9K]$/.test(cleaned)) {
    return false;
  }
  const body = cleaned.slice(0, -1);
  const verifier = cleaned.slice(-1);
  return calculateVerifier(body) === verifier;
}

function calculateVerifier(body: string) {
  let multiplier = BASE_MULTIPLIER;
  let sum = 0;
  for (let i = body.length - 1; i >= 0; i -= 1) {
    sum += Number(body[i]) * multiplier;
    multiplier = multiplier === MAX_MULTIPLIER ? BASE_MULTIPLIER : multiplier + 1;
  }
  const mod = 11 - (sum % 11);
  if (mod === 11) return "0";
  if (mod === 10) return "K";
  return `${mod}`;
}
