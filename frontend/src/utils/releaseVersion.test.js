import { describe, expect, it } from 'vitest';
import { fetchReleaseVersion, releaseUrl, RELEASES_URL } from './releaseVersion';

const respond = (body, { ok = true } = {}) => async () => ({
  ok,
  json: async () => (typeof body === 'string' ? JSON.parse(body) : body),
});

describe('fetchReleaseVersion', () => {
  it('returns the deployed release tag', async () => {
    expect(await fetchReleaseVersion(respond({ version: 'v2026.11.18.2' }))).toBe('v2026.11.18.2');
  });

  it('returns null when the pod has no release set (empty version)', async () => {
    expect(await fetchReleaseVersion(respond({ version: '' }))).toBeNull();
  });

  it('returns null for anything that is not a release tag', async () => {
    expect(await fetchReleaseVersion(respond({ version: '<script>' }))).toBeNull();
    expect(await fetchReleaseVersion(respond({ version: 42 }))).toBeNull();
    expect(await fetchReleaseVersion(respond({}))).toBeNull();
  });

  it('returns null on a non-2xx response', async () => {
    expect(await fetchReleaseVersion(respond({ version: 'v2026.11.18.2' }, { ok: false }))).toBeNull();
  });

  it('returns null when the body is not JSON (vite dev serves index.html)', async () => {
    expect(await fetchReleaseVersion(respond('<!doctype html>'))).toBeNull();
  });

  it('returns null when the request fails', async () => {
    const offline = async () => {
      throw new TypeError('Failed to fetch');
    };
    expect(await fetchReleaseVersion(offline)).toBeNull();
  });

  it('asks for /version.json without the HTTP cache', async () => {
    let call;
    await fetchReleaseVersion(async (...args) => {
      call = args;
      return { ok: false };
    });
    expect(call).toEqual(['/version.json', { cache: 'no-store' }]);
  });
});

describe('releaseUrl', () => {
  it('links to the release page when the tag is known', () => {
    expect(releaseUrl('v2026.11.18.2')).toBe(`${RELEASES_URL}/tag/v2026.11.18.2`);
  });

  it('links to the releases list otherwise', () => {
    expect(releaseUrl(null)).toBe(RELEASES_URL);
  });
});
