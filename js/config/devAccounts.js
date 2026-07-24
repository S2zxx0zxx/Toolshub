export const DEV_ACCOUNTS = [
  'satyamk82476@gmail.com'
];

/**
 * Checks if the given email belongs to a developer account.
 * Note: This is a client-side UI flag only. Real authorization is enforced
 * by the Cloudflare Worker server-side. This function simply unlocks the UI 
 * elements (like the dev login button or Exclusive UI) for developers testing the app.
 */
export function isDevAccount(email) {
  if (!email) return false;
  return DEV_ACCOUNTS.includes(email.toLowerCase());
}
