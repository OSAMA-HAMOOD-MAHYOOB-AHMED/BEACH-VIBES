export const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const isValidEmail = (email) => typeof email === 'string' && EMAIL_RE.test(email);
