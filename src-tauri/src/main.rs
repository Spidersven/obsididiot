#![cfg_attr(not(debug_assertions), windows_subsystem = "windows")]

use serde::{Deserialize, Serialize};
use std::fs;
use std::path::{Path, PathBuf};
use tauri::{Manager};

#[derive(Serialize, Deserialize, Debug)]
struct PluginManifest {
  name: String,
  version: Option<String>,
  schemaVersion: Option<String>,
  description: Option<String>,
  permissions: Option<Vec<String>>,
  entry: Option<String>,
  events: Option<Vec<String>>
}

/// Minimal manifest validation at host level: ensure fields exist & are correct types.
/// The host MUST perform stricter validation (permission whitelist, signature verification) before loading.
fn validate_manifest_json(path: &Path, json: &serde_json::Value) -> bool {
  if !json.get("name").and_then(|v| v.as_str()).is_some() {
    tracing::warn!("manifest at {} missing name", path.display());
    return false;
  }
  if !json.get("entry").and_then(|v| v.as_str()).is_some() {
    tracing::warn!("manifest at {} missing entry", path.display());
    return false;
  }
  if let Some(perms) = json.get("permissions") {
    if !perms.is_array() {
      tracing::warn!("manifest at {} has non-array permissions", path.display());
      return false;
    }
  }
  true
}

/// Scan a plugins directory for *.json manifests and return parsed manifests.
/// This command is safe to call from the renderer (it only reads files within the specified dir).
#[tauri::command]
fn scan_plugins(dir: String) -> Result<Vec<(String, serde_json::Value)>, String> {
  let p = PathBuf::from(&dir);
  if !p.exists() || !p.is_dir() {
    return Err(format!("Plugin directory does not exist or is not a directory: {}", p.display()));
  }

  // Disallow paths outside user's profile as a simple safety check (optional enhancement)
  // TODO: add stronger sandboxing and path normalization checks
  let mut results: Vec<(String, serde_json::Value)> = Vec::new();

  let read_dir = fs::read_dir(&p).map_err(|e| format!("read_dir failed: {}", e))?;
  for entry in read_dir {
    if let Ok(entry) = entry {
      let path = entry.path();
      if path.is_file() {
        if let Some(ext) = path.extension().and_then(|s| s.to_str()) {
          if ext.eq_ignore_ascii_case("json") {
            match fs::read_to_string(&path) {
              Ok(txt) => match serde_json::from_str::<serde_json::Value>(&txt) {
                Ok(json) => {
                  if validate_manifest_json(&path, &json) {
                    if let Some(name) = json.get("name").and_then(|v| v.as_str()) {
                      results.push((name.to_string(), json));
                    }
                  } else {
                    tracing::warn!("Invalid manifest schema: {}", path.display());
                  }
                }
                Err(e) => {
                  tracing::warn!("Failed to parse JSON {}: {}", path.display(), e);
                }
              },
              Err(e) => {
                tracing::warn!("Failed to read {}: {}", path.display(), e);
              }
            }
          }
        }
      }
    }
  }

  Ok(results)
}

fn main() {
  tauri::Builder::default()
    .invoke_handler(tauri::generate_handler![scan_plugins])
    .setup(|app| {
      // Example: create plugin dir if missing under config_dir
      if let Some(data_dir) = tauri::api::path::config_dir() {
        let plugin_dir = data_dir.join("obsidianplusplus").join("plugins");
        if !plugin_dir.exists() {
          let _ = std::fs::create_dir_all(&plugin_dir);
        }
      }
      Ok(())
    })
    .run(tauri::generate_context!())
    .expect("error while running tauri application");
}