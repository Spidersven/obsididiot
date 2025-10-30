// Minimal manifest validator and loader outline.
// IMPORTANT: This is a design-time stub. Do NOT use to run untrusted plugins in production.

export type Manifest = {
  name?: string;
  schemaVersion?: string;
  version?: string;
  permissions?: string[];
  recommendedPermissions?: Record<string, string>;
  entry?: string;
  events?: string[];
  signature?: string;
};

const ALLOWED_PERMISSIONS = new Set([
  "readNotes",
  "writeLinks",
  "useAI",
  "openDialog",
  "readConfig"
]);

export function validateManifest(manifest: Manifest): boolean {
  if (!manifest || typeof manifest !== "object") return false;
  if (!manifest.name || typeof manifest.name !== "string") return false;
  if (!manifest.schemaVersion || typeof manifest.schemaVersion !== "string") return false;
  if (!manifest.version || typeof manifest.version !== "string") return false;
  if (!manifest.entry || typeof manifest.entry !== "string") return false;
  if (!Array.isArray(manifest.permissions)) return false;

  for (const p of manifest.permissions) {
    if (!ALLOWED_PERMISSIONS.has(p)) {
      console.warn("Manifest contains unknown permission:", p);
      return false;
    }
  }

  // future: verify signature, zip size, and a content whitelist
  return true;
}

/*
 loadPluginSandbox(bundlePath, allowedPermissions)
 - In production: spawn a restricted child process (recommended) or instantiate a WASM runner.
 - Provide an audited RPC surface and strong runtime checks for each call.
*/
export async function loadPluginSandbox(bundlePath: string, allowedPermissions: string[]) {
  if (!bundlePath) throw new Error("bundlePath required");
  if (!Array.isArray(allowedPermissions)) throw new Error("allowedPermissions required");

  // TODO: implement process-level sandbox or WASM runtime
  return {
    id: `plugin-stub-${Date.now()}`,
    permitted: allowedPermissions
  };
}