// The Sidebar's version label. In prod, nginx serves the deployed release tag at /version.json
// (set per deploy by Terraform, see .github/scripts/release-tag.sh), so the app shows the same
// vYYYY.MM.DD.N as the GitHub Release. Anywhere it isn't set (vite dev, a local image) the label
// falls back to the build number baked in at build time.

export const RELEASES_URL = 'https://github.com/thermcampos/app-ledger-finance/releases';

export const BUILD_LABEL = import.meta.env.VITE_BUILD_NUMBER || 'nightly';

const RELEASE_TAG = /^v\d{4}\.\d{2}\.\d{2}\.\d+$/;

/** Resolves to the deployed release tag, or null when there isn't one. Never rejects. */
export async function fetchReleaseVersion(fetchImpl = globalThis.fetch) {
  try {
    const res = await fetchImpl('/version.json', { cache: 'no-store' });
    if (!res.ok) return null;
    const { version } = await res.json();
    return typeof version === 'string' && RELEASE_TAG.test(version) ? version : null;
  } catch {
    return null;
  }
}

/** The release's own page when the tag is known, else the Releases list. */
export function releaseUrl(version) {
  return version ? `${RELEASES_URL}/tag/${version}` : RELEASES_URL;
}
