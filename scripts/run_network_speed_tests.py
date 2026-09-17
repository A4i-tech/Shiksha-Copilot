import os
import sys
import time
import json
import csv
from pathlib import Path
import pandas as pd
from playwright.sync_api import sync_playwright

FRONTEND_URL = "http://localhost:4200"
BACKEND_URL = "http://localhost:8080/api"
USER_PHONE = "9741773789"
USER_OTP = "0000"

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

RUNS_PER_PROFILE = 10
CSV_FILE = Path("network_speed_test_results.csv").resolve()
XLSX_FILE = Path("network_speed_test_results.xlsx").resolve()

def setup_session(page):
    print("[SETUP] Logging in to retrieve session & teacher tokens...", flush=True)
    page.goto(f"{FRONTEND_URL}/#/auth/signin")
    page.locator("#mNumber").wait_for(state="visible", timeout=15000)
    page.locator("#mNumber").fill(USER_PHONE)
    page.get_by_role("button", name="Continue").click()

    otp_inputs = page.locator("input.otp-input")
    otp_inputs.first.wait_for(state="attached", timeout=15000)
    for i in range(4):
        cell = otp_inputs.nth(i)
        cell.focus()
        cell.fill(USER_OTP[i])
        cell.dispatch_event("input")
    page.get_by_role("button", name="Verify").dispatch_event("click")
    page.locator("a.menu-item").first.wait_for(state="visible", timeout=20000)

    token = page.evaluate('() => localStorage.getItem("token") || sessionStorage.getItem("token") || ""')
    user_id = page.evaluate('() => { try { const u = JSON.parse(localStorage.getItem("user") || sessionStorage.getItem("user") || "{}"); return u._id || u.id || "668d07ee2d23c6b67dbb76f1"; } catch(e){ return "668d07ee2d23c6b67dbb76f1"; } }')

    print(f"[SETUP] Token acquired (len={len(token)}) | Teacher ID: {user_id}", flush=True)
    return token, user_id

def run_suite():
    print("=" * 70, flush=True)
    print("Shiksha-Copilot: Automated Network Speed & Throttle Testing Suite", flush=True)
    print(f"Profiles: {len(PROFILES)} | Iterations per Profile: {RUNS_PER_PROFILE} | Target: {FRONTEND_URL}", flush=True)
    print("=" * 70, flush=True)

    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page()
        token, user_id = setup_session(page)

        # 10 Key endpoints evaluated per iteration matching the Seeds benchmark
        endpoints = [
            {"id": "Get_OTP", "name": "Get OTP (Auth)", "method": "POST", "url": f"{BACKEND_URL}/auth/get-otp", "body": {"phone": USER_PHONE, "rememberMe": False}},
            {"id": "Verify_OTP", "name": "Verify OTP (Auth)", "method": "POST", "url": f"{BACKEND_URL}/auth/validate-otp", "body": {"phone": USER_PHONE, "otp": USER_OTP}},
            {"id": "Survey_Check", "name": "Survey Status", "method": "GET", "url": f"{BACKEND_URL}/baseline-surveys/check", "body": None},
            {"id": "Endline_Check", "name": "Endline Check", "method": "GET", "url": f"{BACKEND_URL}/endline-surveys/check", "body": None},
            {"id": "Lesson_List", "name": "Lesson Plan List", "method": "GET", "url": f"{BACKEND_URL}/teacher-lesson-plan/list?limit=5", "body": None},
            {"id": "Schedule", "name": "Teacher Schedule", "method": "GET", "url": f"{BACKEND_URL}/schedule/my-schedules?date=2026-09-17", "body": None},
            {"id": "Monthly_Stats", "name": "Monthly Analytics", "method": "GET", "url": f"{BACKEND_URL}/teacher-lesson-plan/monthly-count?filter=quarter-year", "body": None},
            {"id": "Curriculum", "name": "Class Curriculum", "method": "GET", "url": f"{BACKEND_URL}/class/group-by-board/6897031a67c8ba1349fef160", "body": None},
            {"id": "Facilities", "name": "School Facilities", "method": "GET", "url": f"{BACKEND_URL}/facility/list?limit=50", "body": None},
            {"id": "Event_Token", "name": "Realtime Token", "method": "POST", "url": f"{BACKEND_URL}/presentation/events/token", "body": None},
        ]

        fieldnames = [
            "Profile", "Download_Kbps", "Upload_Kbps", "Latency_ms", "Run_Index",
            "Get_OTP_ms", "Verify_OTP_ms", "Survey_Check_ms", "Endline_Check_ms", "Lesson_List_ms",
            "Schedule_ms", "Monthly_Stats_ms", "Curriculum_ms", "Facilities_ms",
            "Event_Token_ms", "Total_Avg_ms", "Fail_Rate_Pct", "Status"
        ]

        with open(CSV_FILE, "w", newline="", encoding="utf-8") as f:
            writer = csv.DictWriter(f, fieldnames=fieldnames)
            writer.writeheader()

        raw_rows = []

        cdp = page.context.new_cdp_session(page)
        cdp.send("Network.enable")

        for prof in PROFILES:
            name = prof["name"]
            down_kbps = prof["down_kbps"]
            up_kbps = prof["up_kbps"]
            latency = prof["latency"]
            down_bytes = int(down_kbps * 1024 / 8)
            up_bytes = int(up_kbps * 1024 / 8)

            print(f"\n>>> Profile: {name.ljust(8)} | Down: {str(down_kbps)+'Kbps':<8} | Up: {str(up_kbps)+'Kbps':<8} | Latency: {latency}ms", flush=True)

            cdp.send("Network.emulateNetworkConditions", {
                "offline": False,
                "latency": latency,
                "downloadThroughput": down_bytes,
                "uploadThroughput": up_bytes
            })

            for run_idx in range(1, RUNS_PER_PROFILE + 1):
                timings = {}
                fails = []

                for ep in endpoints:
                    ep_id = ep["id"]
                    method = ep["method"]
                    url = ep["url"]
                    body_json = json.dumps(ep["body"]) if ep["body"] else None

                    res = page.evaluate('''async ([url, method, body, token]) => {
                        const t0 = performance.now();
                        try {
                            const opts = {
                                method: method,
                                headers: {
                                    'authorization': token,
                                    'Content-Type': 'application/json',
                                    'Accept': 'application/json'
                                }
                            };
                            if (body) { opts.body = body; }
                            const r = await fetch(url, opts);
                            const text = await r.text();
                            const dur = performance.now() - t0;
                            return { status: r.status, dur: Math.round(dur), ok: r.ok };
                        } catch (err) {
                            return { status: 0, dur: Math.round(performance.now() - t0), ok: false, error: err.toString() };
                        }
                    }''', [url, method, body_json, token])

                    dur_ms = res["dur"]
                    timings[ep_id] = dur_ms
                    if not res["ok"] and res["status"] not in (200, 201, 304):
                        fails.append(f"{ep_id}:{res['status']}")

                total_dur = sum(timings.values())
                total_ops = len(endpoints)
                fail_rate = round((len(fails) / total_ops) * 100, 1)
                status_str = "PASS" if not fails else f"FAIL ({'; '.join(fails)})"

                row = {
                    "Profile": name,
                    "Download_Kbps": down_kbps,
                    "Upload_Kbps": up_kbps,
                    "Latency_ms": latency,
                    "Run_Index": run_idx,
                    "Get_OTP_ms": timings["Get_OTP"],
                    "Verify_OTP_ms": timings["Verify_OTP"],
                    "Survey_Check_ms": timings["Survey_Check"],
                    "Endline_Check_ms": timings["Endline_Check"],
                    "Lesson_List_ms": timings["Lesson_List"],
                    "Schedule_ms": timings["Schedule"],
                    "Monthly_Stats_ms": timings["Monthly_Stats"],
                    "Curriculum_ms": timings["Curriculum"],
                    "Facilities_ms": timings["Facilities"],
                    "Event_Token_ms": timings["Event_Token"],
                    "Total_Avg_ms": round(total_dur / total_ops, 1),
                    "Fail_Rate_Pct": fail_rate,
                    "Status": status_str
                }

                raw_rows.append(row)
                with open(CSV_FILE, "a", newline="", encoding="utf-8") as f:
                    writer = csv.DictWriter(f, fieldnames=fieldnames)
                    writer.writerow(row)

                print(f"  Run {run_idx:>2}/{RUNS_PER_PROFILE}: TotalAvg={round(total_dur/total_ops):>4}ms | OTP={timings['Verify_OTP']:>4}ms | LessonList={timings['Lesson_List']:>4}ms | Fail={fail_rate}%", flush=True)

        browser.close()

    # Step 2: Build Aggregate Averages and Max tables
    df = pd.DataFrame(raw_rows)

    ep_cols = [
        "Get_OTP_ms", "Verify_OTP_ms", "Survey_Check_ms", "Endline_Check_ms", "Lesson_List_ms",
        "Schedule_ms", "Monthly_Stats_ms", "Curriculum_ms", "Facilities_ms",
        "Event_Token_ms", "Total_Avg_ms"
    ]

    avg_df = df.groupby("Profile")[ep_cols].mean().round(1).reset_index()
    max_df = df.groupby("Profile")[ep_cols].max().round(1).reset_index()
    fail_df = df.groupby("Profile")["Fail_Rate_Pct"].mean().round(1).reset_index()

    order_map = {p["name"]: i for i, p in enumerate(PROFILES)}
    avg_df["_sort"] = avg_df["Profile"].map(order_map)
    avg_df = avg_df.sort_values("_sort").drop(columns=["_sort"])
    max_df["_sort"] = max_df["Profile"].map(order_map)
    max_df = max_df.sort_values("_sort").drop(columns=["_sort"])

    with pd.ExcelWriter(XLSX_FILE, engine="xlsxwriter") as writer:
        avg_df.to_excel(writer, sheet_name="Average_Response_Time", index=False)
        max_df.to_excel(writer, sheet_name="Max_Response_Time", index=False)
        fail_df.to_excel(writer, sheet_name="Fail_Rate", index=False)
        df.to_excel(writer, sheet_name="Raw_Run_Data", index=False)

    print("\n" + "=" * 70, flush=True)
    print("SUITE COMPLETED SUCCESSFULLY", flush=True)
    print(f"Generated Artifacts:\n- {CSV_FILE}\n- {XLSX_FILE}", flush=True)
    print("=" * 70, flush=True)

if __name__ == "__main__":
    run_suite()
