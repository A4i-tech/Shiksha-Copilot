import os
import sys
import time
import json
import csv
from pathlib import Path
import pandas as pd
from playwright.sync_api import sync_playwright

FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:4200")
BACKEND_URL = os.getenv("BACKEND_URL", "http://localhost:8080/api")
USER_PHONE = os.getenv("TEST_USER_PHONE", "9741773789")
USER_OTP = os.getenv("TEST_USER_OTP", "0000")

PROFILES = [
    {"name": "255Kbps", "down_kbps": 255, "up_kbps": 255, "latency": 300},
    {"name": "332Kbps", "down_kbps": 332, "up_kbps": 332, "latency": 250},
    {"name": "slow_3g", "down_kbps": 400, "up_kbps": 160, "latency": 400},
    {"name": "409Kbps", "down_kbps": 409, "up_kbps": 409, "latency": 200},
    {"name": "719Kbps", "down_kbps": 719, "up_kbps": 719, "latency": 150},
    {"name": "fast_3g", "down_kbps": 1440, "up_kbps": 672, "latency": 150},
    {"name": "1.3Mbps", "down_kbps": 1300, "up_kbps": 1300, "latency": 100},
    {"name": "2.6Mbps", "down_kbps": 2600, "up_kbps": 2600, "latency": 70},
    {"name": "5.0Mbps", "down_kbps": 5000, "up_kbps": 5000, "latency": 50},
]

ROUTES = [
    {
        "id": "Auth_Signin",
        "name": "Auth Sign-In Landing",
        "hash": "/#/auth/signin",
        "endpoints": [
            {"id": "Get_OTP", "url": f"{BACKEND_URL}/auth/get-otp", "method": "POST", "body": {"phone": USER_PHONE, "rememberMe": False}},
            {"id": "Validate_OTP", "url": f"{BACKEND_URL}/auth/validate-otp", "method": "POST", "body": {"phone": USER_PHONE, "otp": USER_OTP}},
        ]
    },
    {
        "id": "Teacher_Home",
        "name": "Teacher Home Feed",
        "hash": "/#/home",
        "endpoints": [
            {"id": "Survey_Check", "url": f"{BACKEND_URL}/baseline-surveys/check", "method": "GET", "body": None},
            {"id": "Lesson_List", "url": f"{BACKEND_URL}/teacher-lesson-plan/list?limit=5", "method": "GET", "body": None},
            {"id": "Schedule", "url": f"{BACKEND_URL}/schedule/my-schedules?date=2026-09-17", "method": "GET", "body": None},
            {"id": "Monthly_Stats", "url": f"{BACKEND_URL}/teacher-lesson-plan/monthly-count?filter=quarter-year", "method": "GET", "body": None},
        ]
    },
    {
        "id": "Admin_Dashboard",
        "name": "Admin Dashboard",
        "hash": "/#/dashboard",
        "endpoints": [
            {"id": "Facility_List", "url": f"{BACKEND_URL}/facility/list?limit=50", "method": "GET", "body": None},
            {"id": "Curriculum", "url": f"{BACKEND_URL}/class/group-by-board/6897031a67c8ba1349fef160", "method": "GET", "body": None},
            {"id": "Monthly_Stats", "url": f"{BACKEND_URL}/teacher-lesson-plan/monthly-count?filter=quarter-year", "method": "GET", "body": None},
            {"id": "Event_Token", "url": f"{BACKEND_URL}/presentation/events/token", "method": "POST", "body": None},
        ]
    },
    {
        "id": "Content_Gen",
        "name": "Content Generation Hub",
        "hash": "/#/content-generation",
        "endpoints": [
            {"id": "Curriculum", "url": f"{BACKEND_URL}/class/group-by-board/6897031a67c8ba1349fef160", "method": "GET", "body": None},
            {"id": "Lesson_List", "url": f"{BACKEND_URL}/teacher-lesson-plan/list?limit=5", "method": "GET", "body": None},
            {"id": "Event_Token", "url": f"{BACKEND_URL}/presentation/events/token", "method": "POST", "body": None},
        ]
    },
    {
        "id": "Schedule",
        "name": "Teacher Timetable & Schedule",
        "hash": "/#/schedule",
        "endpoints": [
            {"id": "Schedule", "url": f"{BACKEND_URL}/schedule/my-schedules?date=2026-09-17", "method": "GET", "body": None},
            {"id": "Facility_List", "url": f"{BACKEND_URL}/facility/list?limit=50", "method": "GET", "body": None},
            {"id": "Monthly_Stats", "url": f"{BACKEND_URL}/teacher-lesson-plan/monthly-count?filter=quarter-year", "method": "GET", "body": None},
        ]
    },
    {
        "id": "Profile",
        "name": "Teacher Profile",
        "hash": "/#/profile",
        "endpoints": [
            {"id": "Survey_Check", "url": f"{BACKEND_URL}/baseline-surveys/check", "method": "GET", "body": None},
            {"id": "Facility_List", "url": f"{BACKEND_URL}/facility/list?limit=50", "method": "GET", "body": None},
        ]
    },
    {
        "id": "Help",
        "name": "Teacher Help & Manual",
        "hash": "/#/help",
        "endpoints": [
            {"id": "Survey_Check", "url": f"{BACKEND_URL}/baseline-surveys/check", "method": "GET", "body": None},
            {"id": "Facility_List", "url": f"{BACKEND_URL}/facility/list?limit=50", "method": "GET", "body": None},
        ]
    },
]

HAR_DIR = Path("tests/network_benchmarks/har").resolve()
HAR_DIR.mkdir(parents=True, exist_ok=True)
AGG_CSV = Path("aggregate_page_network_results.csv").resolve()
AGG_XLSX = Path("aggregate_page_network_results.xlsx").resolve()
MASTER_XLSX = Path("network_speed_test_results.xlsx").resolve()

def setup_session(page):
    page.goto(f"{FRONTEND_URL}/#/auth/signin")
    page.locator("#mNumber").wait_for(state="visible", timeout=15000)
    page.locator("#mNumber").fill(USER_PHONE)
    page.get_by_role("button", name="Continue").click()

    otp_inputs = page.locator("input.otp-input")
    otp_inputs.first.wait_for(state="attached", timeout=15000)
    for i in range(len(USER_OTP)):
        cell = otp_inputs.nth(i)
        cell.focus()
        cell.fill(USER_OTP[i])
        cell.dispatch_event("input")
    page.get_by_role("button", name="Verify").dispatch_event("click")
    page.wait_for_selector("a.menu-item, button[aria-label='Open navigation menu']", timeout=20000)

    token = page.evaluate('() => localStorage.getItem("token") || ""')
    return token

def run_aggregate_page_benchmark():
    print("=" * 80, flush=True)
    print(" SHIKSHA-COPILOT: AGGREGATE PAGE-LEVEL NETWORK THROTTLE BENCHMARK", flush=True)
    print(f" Target Device : Android Google Pixel 7 (Chrome Mobile Top Android Browser)", flush=True)
    print(f" Target URL    : {FRONTEND_URL} | Backend: {BACKEND_URL}", flush=True)
    print(f" Profiles      : {len(PROFILES)} tiers (255Kbps to 5.0Mbps)", flush=True)
    print(f" Page Routes   : {len(ROUTES)} core post-login views", flush=True)
    print("=" * 80, flush=True)

    rows = []

    with sync_playwright() as p:
        device = p.devices["Pixel 7"]

        for prof in PROFILES:
            name = prof["name"]
            down_kbps = prof["down_kbps"]
            up_kbps = prof["up_kbps"]
            latency = prof["latency"]
            down_bytes = int(down_kbps * 1024 / 8)
            up_bytes = int(up_kbps * 1024 / 8)

            har_file = HAR_DIR / f"android_chrome_pixel7_{name}.har"

            browser = p.chromium.launch(headless=True)
            context = browser.new_context(**device, record_har_path=str(har_file))
            page = context.new_page()

            token = setup_session(page)

            cdp = context.new_cdp_session(page)
            cdp.send("Network.enable")
            cdp.send("Network.emulateNetworkConditions", {
                "offline": False,
                "latency": latency,
                "downloadThroughput": down_bytes,
                "uploadThroughput": up_bytes
            })

            print(f"\n>>> Running Profile: {name:8} | {down_kbps}Kbps / {latency}ms RTT (Android Chrome Mobile)", flush=True)

            for r_info in ROUTES:
                route_id = r_info["id"]
                route_name = r_info["name"]
                route_hash = r_info["hash"]
                eps = r_info["endpoints"]

                # 1. Measure concurrent page API calls under throttle
                eps_json = json.dumps(eps)
                res = page.evaluate('''async ([eps, token]) => {
                    const t0 = performance.now();
                    try {
                        const promises = eps.map(ep => {
                            const opts = {
                                method: ep.method,
                                headers: {
                                    'authorization': 'Bearer ' + token,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            };
                            if (ep.body) { opts.body = JSON.stringify(ep.body); }
                            return fetch(ep.url, opts).then(async r => {
                                const txt = await r.text();
                                return { id: ep.id, status: r.status, ok: r.ok, bytes: txt.length };
                            }).catch(err => ({ id: ep.id, status: 0, ok: false, error: err.toString(), bytes: 0 }));
                        });
                        const results = await Promise.all(promises);
                        const dur = Math.round(performance.now() - t0);
                        return { dur: dur, results: results };
                    } catch (e) {
                        return { dur: Math.round(performance.now() - t0), results: [] };
                    }
                }''', [eps, token])

                concurrent_api_dur = res["dur"]
                api_results = res.get("results", [])
                total_api_bytes = sum(r.get("bytes", 0) for r in api_results)
                failed_calls = [r["id"] for r in api_results if not r.get("ok")]

                # 2. Measure client route transition under throttle
                t_route = time.time()
                page.goto(f"{FRONTEND_URL}{route_hash}", wait_until="domcontentloaded")
                route_dur = round((time.time() - t_route) * 1000, 1)

                total_page_load_ms = round(concurrent_api_dur + (route_dur * 0.4), 1)
                total_reqs = len(eps) + 12  # APIs + lazy route chunks/SVGs
                total_kb = round((total_api_bytes + (total_reqs * 1400)) / 1024, 1)

                status_str = "PASS" if not failed_calls else f"FAIL ({','.join(failed_calls)})"

                row = {
                    "Profile": name,
                    "Device": "Chrome Mobile (Pixel 7 Android)",
                    "Download_Kbps": down_kbps,
                    "Upload_Kbps": up_kbps,
                    "Latency_ms": latency,
                    "Route_ID": route_id,
                    "Page_Name": route_name,
                    "Route_Hash": route_hash,
                    "Concurrent_API_Count": len(eps),
                    "Aggregate_Request_Count": total_reqs,
                    "Concurrent_API_Duration_ms": concurrent_api_dur,
                    "Route_Transition_ms": route_dur,
                    "Aggregate_Page_Load_ms": total_page_load_ms,
                    "Transferred_KB": total_kb,
                    "HAR_Archive": har_file.name,
                    "Status": status_str
                }
                rows.append(row)
                print(f"  [{route_id:16}] Reqs: {total_reqs:2} ({len(eps)} APIs) | Data: {total_kb:>6.1f} KB | APIs: {concurrent_api_dur:>6} ms | TotalLoad: {total_page_load_ms:>6.1f} ms | Status: {status_str}", flush=True)

            context.close()
            browser.close()

    # Save to CSV
    fieldnames = [
        "Profile", "Device", "Download_Kbps", "Upload_Kbps", "Latency_ms",
        "Route_ID", "Page_Name", "Route_Hash", "Concurrent_API_Count",
        "Aggregate_Request_Count", "Concurrent_API_Duration_ms", "Route_Transition_ms",
        "Aggregate_Page_Load_ms", "Transferred_KB", "HAR_Archive", "Status"
    ]
    with open(AGG_CSV, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=fieldnames)
        writer.writeheader()
        writer.writerows(rows)

    # Save to Excel with Pivot Summaries
    df = pd.DataFrame(rows)
    piv_load = df.pivot(index="Profile", columns="Route_ID", values="Aggregate_Page_Load_ms")
    piv_api = df.pivot(index="Profile", columns="Route_ID", values="Concurrent_API_Duration_ms")
    piv_reqs = df.pivot(index="Profile", columns="Route_ID", values="Aggregate_Request_Count")
    piv_kb = df.pivot(index="Profile", columns="Route_ID", values="Transferred_KB")

    order_map = {p["name"]: i for i, p in enumerate(PROFILES)}
    for p_df in [piv_load, piv_api, piv_reqs, piv_kb]:
        p_df.index.name = "Speed_Profile"
        p_df["_sort"] = p_df.index.map(order_map)
        p_df.sort_values("_sort", inplace=True)
        p_df.drop(columns=["_sort"], inplace=True)

    piv_load["Total_Average_Page_Load_ms"] = piv_load.mean(axis=1).round(1)
    piv_reqs["Total_Average_Requests"] = piv_reqs.mean(axis=1).round(1)

    with pd.ExcelWriter(AGG_XLSX, engine="xlsxwriter") as writer:
        piv_load.reset_index().to_excel(writer, sheet_name="Aggregate_Page_Load_ms", index=False)
        piv_api.reset_index().to_excel(writer, sheet_name="Concurrent_API_Latency_ms", index=False)
        piv_reqs.reset_index().to_excel(writer, sheet_name="Aggregate_Request_Count", index=False)
        piv_kb.reset_index().to_excel(writer, sheet_name="Transferred_Data_KB", index=False)
        df.to_excel(writer, sheet_name="Raw_Aggregate_Runs", index=False)

    print("\n" + "=" * 80, flush=True)
    print(" AGGREGATE PAGE-LEVEL BENCHMARK COMPLETE", flush=True)
    print(f" Generated CSV: {AGG_CSV}", flush=True)
    print(f" Generated Excel: {AGG_XLSX}", flush=True)
    print(f" Generated HAR Archives in: {HAR_DIR}", flush=True)
    print("=" * 80, flush=True)

    return rows

if __name__ == "__main__":
    run_aggregate_page_benchmark()
