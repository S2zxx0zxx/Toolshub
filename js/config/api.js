/**
 * Centralized API configuration for all frontend-to-worker communication.
 *
 * If the worker is redeployed to a new URL, change it HERE only.
 * Do not hardcode this string in individual service files.
 *
 * Previously duplicated in: aiApi.js, ragService.js, searchService.js
 */
export const API_ENDPOINT = 'https://toolshub-api-worker.theliquidlounge-co.workers.dev';
