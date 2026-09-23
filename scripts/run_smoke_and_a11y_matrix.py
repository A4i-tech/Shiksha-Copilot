import os
import sys
import time
import csv
import json
import subprocess
from pathlib import Path
from concurrent.futures import ThreadPoolExecutor, as_completed

BROWSER_CACHE_DIR = Path("tests/.browser_binaries").resolve()
OUTPUT_CSV = Path("smoke_and_accessibility_matrix.csv").resolve()

VERSION_MATRIX = [
    {"name": "Playwright Chromium (Headless)", "type": "chromium", "version": "latest", "download": False},
    {"name": "Playwright Firefox (Headless)", "type": "firefox", "version": "latest", "download": False},
    {"name": "Playwright WebKit / Safari Engine", "type": "webkit", "version": "latest", "download": False},
    {"name": "Google Chrome (Installed)", "type": "chromium", "version": "system", "channel": "chrome", "download": False},
    {"name": "Microsoft Edge (Installed)", "type": "chromium", "version": "system", "channel": "msedge", "download": False},
    {"name": "Chrome Mobile (Pixel 7 Android)", "type": "chromium", "device": "Pixel 7", "version": "latest", "download": False},
    {"name": "Mobile Safari (iPhone 13 iOS)", "type": "webkit", "device": "iPhone 13", "version": "latest", "download": False},
    {"name": "Chrome v134", "type": "chromium", "browser": "chrome", "version": "134.0.6998.35", "download": True},
    {"name": "Chrome v133", "type": "chromium", "browser": "chrome", "version": "133.0.6943.98", "download": True},
    {"name": "Chrome v132", "type": "chromium", "browser": "chrome", "version": "132.0.6834.110", "download": True},
    {"name": "Chrome v131", "type": "chromium", "browser": "chrome", "version": "131.0.6778.85", "download": True},
    {"name": "Chrome v130", "type": "chromium", "browser": "chrome", "version": "130.0.6723.69", "download": True},
    {"name": "Chrome v129", "type": "chromium", "browser": "chrome", "version": "129.0.6668.70", "download": True},
    {"name": "Chrome v128", "type": "chromium", "browser": "chrome", "version": "128.0.6613.84", "download": True},
    {"name": "Chrome v127", "type": "chromium", "browser": "chrome", "version": "127.0.6533.72", "download": True},
    {"name": "Chrome v126", "type": "chromium", "browser": "chrome", "version": "126.0.6478.61", "download": True},
    {"name": "Chrome v125", "type": "chromium", "browser": "chrome", "version": "125.0.6422.141", "download": True},
    {"name": "Chrome v124", "type": "chromium", "browser": "chrome", "version": "124.0.6367.91", "download": True},
    {"name": "Chrome v123", "type": "chromium", "browser": "chrome", "version": "123.0.6312.86", "download": True},
    {"name": "Chrome v122", "type": "chromium", "browser": "chrome", "version": "122.0.6261.94", "download": True},
    {"name": "Chrome v121", "type": "chromium", "browser": "chrome", "version": "121.0.6167.85", "download": True},
    {"name": "Chrome v120", "type": "chromium", "browser": "chrome", "version": "120.0.6099.109", "download": True},
    {"name": "Chrome v119", "type": "chromium", "browser": "chrome", "version": "119.0.6045.105", "download": True},
    {"name": "Chrome v118", "type": "chromium", "browser": "chrome", "version": "118.0.5993.70", "download": True},
    {"name": "Chrome v117", "type": "chromium", "browser": "chrome", "version": "117.0.5938.88", "download": True},
    {"name": "Chrome v116", "type": "chromium", "browser": "chrome", "version": "116.0.5845.96", "download": True},
    {"name": "Chrome v115", "type": "chromium", "browser": "chrome", "version": "115.0.5790.170", "download": True},
]

def get_installed_browser_path(version):
    for exe in BROWSER_CACHE_DIR.rglob("chrome.exe"):
        if version in str(exe):
            return str(exe)
    for exe in BROWSER_CACHE_DIR.rglob("firefox.exe"):
        if version in str(exe):
            return str(exe)
    return None

def download_browser(browser_name, version):
    cached = get_installed_browser_path(version)
    if cached:
        return cached

    target = f"{browser_name}@{version}"
    BROWSER_CACHE_DIR.mkdir(parents=True, exist_ok=True)
    cmd = ["npx", "@puppeteer/browsers", "install", target, "--path", str(BROWSER_CACHE_DIR)]
    res = subprocess.run(cmd, capture_output=True, text=True, shell=True)
    if res.returncode != 0:
        return None
    return get_installed_browser_path(version)

def run_smoke_on_version(config):
    name = config["name"]
    b_type = config.get("type", "chromium")
    channel = config.get("channel")
    device = config.get("device")
    version = config["version"]
    exec_path = None

    if config.get("download"):
        exec_path = download_browser(config["browser"], version)
        if not exec_path:
            return {
                "Category": "Smoke Test",
                "Browser / Target": name,
                "Device": device if device else "Desktop",
                "Engine": b_type,
                "Version": version,
                "Status": "SKIPPED (DOWNLOAD FAILED)",
                "Duration (s)": 0,
                "Issues / Details": "Failed to download browser binary"
            }

    cmd = ["pytest", "tests/smoke/test_teacher_panel.py", "tests/smoke/test_admin_panel.py", f"--browser-type={b_type}"]
    if channel:
        cmd.append(f"--channel={channel}")
    if exec_path:
        cmd.append(f"--browser-path={exec_path}")
    if device:
        cmd.append(f"--device={device}")

    start = time.time()
    res = subprocess.run(cmd, capture_output=True, text=True)
    dur = round(time.time() - start, 2)

    status = "PASSED" if res.returncode == 0 else "FAILED"
    details = "Teacher and Admin navigation items actionable" if status == "PASSED" else res.stdout[-250:].strip()

    return {
        "Category": "Smoke Test",
        "Browser / Target": name,
        "Device": device if device else "Desktop",
        "Engine": b_type,
        "Version": version,
        "Status": status,
        "Duration (s)": dur,
        "Issues / Details": details
    }

def run_accessibility_scan():
    print("\n[RUNNING] Accessibility Scanner (axe-core WCAG 2.1 AA)...")
    env = os.environ.copy()
    env.setdefault("FRONTEND_URL", "http://localhost:4200")

    start = time.time()
    res = subprocess.run(["node", "tests/accessibility/run-accessibility.js"], capture_output=True, text=True, env=env)
    dur = round(time.time() - start, 2)

    # Find the latest generated json report in tests/accessibility/results
    results_dir = Path("tests/accessibility/results")
    latest_json = None
    if results_dir.exists():
        json_files = sorted(results_dir.glob("accessibility-report-*.json"), key=os.path.getmtime, reverse=True)
        if json_files:
            latest_json = json_files[0]

    a11y_rows = []
    if latest_json and latest_json.exists():
        with open(latest_json, "r", encoding="utf-8") as f:
            data = json.load(f)
        for run in data.get("runs", []):
            score_pct = f"{round(run.get('score', 0) * 100)}%"
            summary = run.get("summary", {})
            issues_desc = f"Score: {score_pct}, Critical: {summary.get('critical', 0)}, Serious: {summary.get('serious', 0)}, Moderate: {summary.get('moderate', 0)}, Minor: {summary.get('minor', 0)}"
            score_val = run.get("score", 0)
            status = "PASSED" if score_val >= 0.9 and summary.get("critical", 0) == 0 else "WARNING (Low Score / Issues)"
            
            a11y_rows.append({
                "Category": "Accessibility (WCAG 2.1)",
                "Browser / Target": run.get("url"),
                "Device": "Desktop",
                "Engine": "Chromium + axe-core",
                "Version": data.get("axeCoreVersion", "4.10.x"),
                "Status": status,
                "Duration (s)": dur,
                "Issues / Details": issues_desc
            })

    if not a11y_rows:
        a11y_rows.append({
            "Category": "Accessibility (WCAG 2.1)",
            "Browser / Target": "All Pages",
            "Device": "Desktop",
            "Engine": "axe-core",
            "Version": "4.10",
            "Status": "PASSED" if res.returncode == 0 else "FAILED",
            "Duration (s)": dur,
            "Issues / Details": res.stdout[-250:].strip()
        })

    return a11y_rows

def main():
    max_workers = 6
    print("=" * 70)
    print(" SHIKSHA-COPILOT SMOKE + ACCESSIBILITY CROSS-BROWSER MATRIX")
    print(f" Target URL : http://localhost:4200")
    print(f" Workers    : {max_workers} parallel threads")
    print("=" * 70)

    # 1. Run Smoke Tests across Browser Versions in Parallel
    smoke_results = []
    print("\n[RUNNING] Parallel Browser Version Smoke Tests...")
    with ThreadPoolExecutor(max_workers=max_workers) as executor:
        futures = {executor.submit(run_smoke_on_version, cfg): cfg for cfg in VERSION_MATRIX}
        for f in as_completed(futures):
            r = f.result()
            print(f"  --> {r['Browser / Target']:35} | {r.get('Device', 'Desktop'):10} | {r['Version']:12} | {r['Status']:8} ({r['Duration (s)']}s)")
            smoke_results.append(r)

    matrix_order = {cfg["name"]: i for i, cfg in enumerate(VERSION_MATRIX)}
    smoke_results.sort(key=lambda r: matrix_order.get(r["Browser / Target"], 999))

    # 2. Run Accessibility Scan
    a11y_results = run_accessibility_scan()

    # 3. Combine and Save CSV
    all_rows = smoke_results + a11y_results

    with open(OUTPUT_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=[
            "Category", "Browser / Target", "Device", "Engine", "Version", "Status", "Duration (s)", "Issues / Details"
        ])
        writer.writeheader()
        writer.writerows(all_rows)

    print("\n" + "=" * 70)
    print("                    FINAL MATRIX SUMMARY")
    print("=" * 70)
    for row in all_rows:
        print(f"[{row['Category']:15}] {row['Browser / Target']:40} | {row['Status']}")
    print("=" * 70)
    print(f"\nMatrix CSV generated: {OUTPUT_CSV}")

if __name__ == "__main__":
    main()
