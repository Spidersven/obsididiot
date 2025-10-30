```markdown
1. Implement secure plugin sandbox (priority: high)
   - Process isolation (child processes) with IPC OR WASM runtime with capability imports.
   - Enforce permission checks in host for each API call and maintain an audit log.

2. Implement Google (and other) OAuth in Tauri backend
   - Use OS keyring for refresh/access tokens. Avoid storing tokens in localStorage.

3. Implement differential sync for Drive/Dropbox
   - Prioritize conflict resolution and chunked transfers for large vaults.

4. Add rich editor features
   - TipTap or Slate with block references, transclusion and sync with markdown files.

5. Graph visualization & backlink indexing
   - Implement vault indexer in Rust for performance, visualize with Cytoscape.js.

6. Tests & CI
   - Unit, integration and e2e (Playwright). Add Windows build + signing CI.

7. Hardening
   - Path validation, vault encryption, audit trails, code signing before release.
```