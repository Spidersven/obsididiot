```markdown
# Plugins (Professional) — spec & host responsibilities

This document describes the plugin model the host must enforce. The goal is to allow third-party extensions while protecting user data and system integrity.

Manifest schema (recommended)
```json
{
  "name": "ai-auto-linker",
  "schemaVersion": "1.0",
  "version": "1.0.0",
  "description": "Suggest links between notes using AI",
  "author": "Author Name",
  "license": "MIT",
  "permissions": ["readNotes", "writeLinks", "useAI"],
  "recommendedPermissions": {
    "readNotes": "Read note contents to compute suggestions",
    "writeLinks": "Create or update backlinks",
    "useAI": "Call configured LLM adapter"
  },
  "entry": "main.wasm",
  "events": ["onNoteSave", "onCommandPalette"],
  "signature": "" // optional vendor signature for integrity/provenance
}
```

Host validation checklist
- JSON schema validation (required fields: name, schemaVersion, version, entry, permissions).
- Permission whitelist: only allow enumerated capabilities.
- Signature verification (optional but strongly recommended).
- Path & size caps: plugin bundle must live inside the plugin folder and be small.
- Disallow native binaries unless explicitly approved.

Sandboxing options (recommended order)
1. Process isolation (recommended)
   - Spawn plugin as a restricted child process. Use IPC (stdin/stdout or socket).
   - Restrict OS capabilities (job objects, limited filesystem view).
   - Proxy granular host APIs only (readNotes, writeLinks, openDialog).
2. WASM sandbox
   - Run plugin compiled to WASM under a trusted runtime with limited imports.
3. Worker + permission proxy (least secure)
   - Run plugin in a WebWorker and route privileged API calls through the Rust backend.

Runtime controls
- Enforce permissions on every API call.
- Maintain an append-only audit log of privileged operations.
- Resource limits (CPU / memory / runtime) and crash/restart policy.
- Explicit user consent for exposing secrets.

Loading sequence
1. Host scans plugin folder (use the Tauri scan_plugins command).
2. Validate manifest & permissions.
3. Verify signatures + bundle integrity (optional).
4. Spawn sandbox with capability object.
5. Register event listeners proxied to sandbox.
6. Monitor health and audit activity.

Do not ship a plugin system that runs arbitrary third-party JS in the renderer. Use a host-side sandbox before allowing external plugins.
```