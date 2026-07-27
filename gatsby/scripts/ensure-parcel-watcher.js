/**
 * Self-heal for CI agents whose npm install skips optional dependencies,
 * which leaves @parcel/watcher without its platform binary and breaks
 * `gatsby build` ("No prebuild or local build of @parcel/watcher found").
 * Runs as the `prebuild` hook; a no-op when the binary is present.
 */
const { execSync } = require("child_process");

try {
	require("@parcel/watcher");
	console.log("@parcel/watcher OK");
	return;
} catch (e) {
	console.warn(`@parcel/watcher failed to load: ${e.message}`);
}

const { platform, arch } = process;
// CI/dev machines are glibc; musl (Alpine) would need a -musl suffix
const suffix = platform === "linux" ? "-glibc" : "";
const { version } = require("@parcel/watcher/package.json");
const pkg = `@parcel/watcher-${platform}-${arch}${suffix}@${version}`;

console.log(`Installing ${pkg} explicitly (cannot be skipped as optional)...`);
execSync(`npm install --no-save ${pkg}`, { stdio: "inherit" });

// Fail the build here, with a clear message, if the heal didn't work
require("@parcel/watcher");
console.log("@parcel/watcher OK after install");
