```markdown
# Obsidian++ — Windows-ready (professional) starter

This repository is a Tauri + React starter scaffold focused on a professional Windows distribution workflow:
- Native Windows bundles (MSI / NSIS)
- Stronger Tauri allowlist & hardened CSP
- Rust backend entry (src-tauri) for safe OS-level operations
- Plugin scanning command (Rust) + renderer-side manifest validation stub
- CI-ready scripts and recommended build/signing flow

Quick start (dev)
1. Install prerequisites:
   - Node 18+, Rust toolchain, Visual Studio Build Tools (for MSVC target)
   - Tauri prerequisites: https://tauri.app
2. Install deps:
   - npm ci
3. Run in dev:
   - npm run tauri:dev

Windows build (local)
1. Prepare icons in src-tauri/icons (icon.ico, icon-128x128.png, icon-512x512.png).
   - Example generation (ImageMagick + png2ico):
     convert icon-512.png -resize 256x256 icon-256.png
     png2ico src-tauri/icons/icon.ico icon-256.png icon-128.png
2. Build:
   - npm run build
   - npm run build:windows-nsis   # or npm run build:windows-msi
3. Artifacts:
   - src-tauri/target/release/bundle/windows

Code signing (recommended)
- Sign EXE & installers before publishing:
  signtool sign /tr http://timestamp.digicert.com /td SHA256 /fd SHA256 /a /f "cert.pfx" /p "<password>" "path\\to\\ObsidianPlusPlus.exe"
- On CI: prefer OIDC + KeyVault or GitHub Secrets with restricted access.

CI (recommended)
- Use windows-latest runner. Install WiX/NSIS via choco.
- Steps: checkout → setup node/rust → npm ci → npm run build → tauri build --bundle nsis/msi → sign → upload artifacts.

Security & plugins
- Do not run third-party plugin JS in renderer with full privileges.
- Use the Rust backend to scan/validate manifests and spawn sandboxes (WASM or restricted child processes).
- See PLUGINS.md for manifest schema, validation, and sandbox recommendations.

Next steps I can implement
- GitHub Actions workflow for building & signing (OIDC or PFX)
- Generate icon png/ico files from an SVG you provide
- Implement a process-based plugin sandbox demo (host IPC + sample plugin)

If you want me to apply these files to a branch or create a PR, tell me the target branch name or grant repository access.
```