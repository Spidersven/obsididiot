import React, { useEffect, useState } from "react";
import { invoke } from "@tauri-apps/api/tauri";
import { validateManifest } from "./plugins/loader";

const demoManifest = {
  name: "ai-auto-linker",
  schemaVersion: "1.0",
  version: "1.0.0",
  permissions: ["readNotes", "writeLinks", "useAI"],
  entry: "main.js",
  events: ["onNoteSave"]
};

export default function App() {
  const [manifestValid, setManifestValid] = useState<boolean | null>(null);
  const [plugins, setPlugins] = useState<any[]>([]);
  const [scanDir, setScanDir] = useState<string>("");

  useEffect(() => {
    setManifestValid(validateManifest(demoManifest));
  }, []);

  async function runScan() {
    try {
      if (!scanDir) {
        alert("Enter a plugin directory path to scan (for dev/testing).");
        return;
      }
      // call the Rust command (scan_plugins) implemented in src-tauri/src/main.rs
      const res: any = await invoke("scan_plugins", { dir: scanDir });
      if (Array.isArray(res)) setPlugins(res);
    } catch (e) {
      console.error("scan_plugins failed", e);
      alert("scan_plugins failed. See console for details.");
    }
  }

  return (
    <div style={{ padding: 28 }}>
      <h1>Obsidian++ Pro</h1>
      <p style={{ color: "var(--muted)" }}>
        Windows-ready Tauri + React starter — core files organized and build-ready.
      </p>

      <section style={{ marginTop: 18 }}>
        <h2>Plugin manifest test</h2>
        <pre style={{ background: "#f6f8fa", padding: 12 }}>{JSON.stringify(demoManifest, null, 2)}</pre>
        <p>
          Validation:{" "}
          <strong style={{ color: manifestValid ? "green" : "red" }}>
            {manifestValid === null ? "checking…" : manifestValid ? "OK" : "Invalid"}
          </strong>
        </p>
      </section>

      <section style={{ marginTop: 18 }}>
        <h2>Scan plugins (dev)</h2>
        <div>
          <input
            value={scanDir}
            onChange={(e) => setScanDir(e.target.value)}
            placeholder="Enter plugin folder path (e.g., C:\\Users\\You\\AppData\\Roaming\\obsidianplusplus\\plugins)"
            style={{ width: "100%", padding: 8, marginBottom: 8 }}
          />
          <button onClick={runScan} style={{ padding: "8px 12px", background: "var(--accent)", color: "#fff", border: "none", borderRadius: 6 }}>
            Scan plugins
          </button>
        </div>

        <pre style={{ background: "#f6f8fa", padding: 12, marginTop: 12 }}>{JSON.stringify(plugins, null, 2)}</pre>
      </section>
    </div>
  );
}