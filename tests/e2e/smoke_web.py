"""Smoke test for the Expo web build using Playwright.

Run (server managed automatically by the webapp-testing skill helper):

    python3 .claude/skills/webapp-testing/scripts/with_server.py \
        --server "npx expo start --web --port 8081" --port 8081 \
        -- python3 tests/e2e/smoke_web.py

Prereqs: pip install playwright && python3 -m playwright install chromium
"""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8081"

ROUTES = {
    "/": "Daily Vitals",
    "/assistant": "AI Symptom",  # welcome message / banner text
    "/doctors": "Dr. Rajesh Kumar",
    "/health": "Current Readings",
    "/profile": "Medical History",
    "/pharmacy": "MediCare Plus",
}


def main() -> int:
    failures: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        page = browser.new_page(viewport={"width": 390, "height": 844})
        errors: list[str] = []
        page.on("console", lambda m: errors.append(m.text) if m.type == "error" else None)
        page.on("pageerror", lambda e: errors.append(str(e)))

        for path, expected in ROUTES.items():
            page.goto(BASE + path)
            page.wait_for_load_state("networkidle")
            try:
                page.get_by_text(expected, exact=False).first.wait_for(timeout=15000)
                print(f"PASS {path}: found '{expected}'")
            except Exception:
                page.screenshot(path=f"/tmp/smoke{path.replace('/', '_') or '_home'}.png", full_page=True)
                failures.append(f"{path}: missing '{expected}'")
                print(f"FAIL {path}: missing '{expected}'")

        # Doctor search filters the list
        page.goto(BASE + "/doctors")
        page.wait_for_load_state("networkidle")
        page.get_by_placeholder("Search by name").fill("neuro")
        page.get_by_text("Dr. Priya Singh").wait_for(timeout=5000)
        if page.get_by_text("Dr. Rajesh Kumar").count() == 0:
            print("PASS /doctors: search filters results")
        else:
            failures.append("/doctors: search did not filter")

        browser.close()

    if errors:
        print("Console errors:\n  " + "\n  ".join(errors[:10]))
    if failures:
        print("\nFAILURES:\n  " + "\n  ".join(failures))
        return 1
    print("\nAll smoke checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
