"""Smoke test for the Healthy Nation web build (Playwright).

    python3 .claude/skills/webapp-testing/scripts/with_server.py \
        --server "npx expo start --web --port 8081" --port 8081 \
        -- python3 tests/e2e/smoke_web.py
"""
import sys

from playwright.sync_api import sync_playwright

BASE = "http://localhost:8081"

# route -> text expected somewhere on the page (case-insensitive)
ROUTES = {
    "/": "needs attention",
    "/appointments": "appointments",
    "/tasks": "care tasks",
    "/updates": "updates",
    "/care": "providers",
    "/reminders": "reminders",
    "/appointments/a-1": "how to prepare",
    "/tasks/t-3": "mark as done",
    "/updates/u-1": "message",
    "/people/p-mother": "health records",
    "/records/rec-2": "results",
    "/care-plans/cp-1": "steps",
    "/providers/pr-singh": "cares for",
    "/tasks/new": "priority",
    "/definitely-missing": "couldn",
}


def has_text(page, text: str, timeout=60000):
    page.wait_for_function(
        "t => document.body.innerText.toLowerCase().includes(t)", arg=text.lower(), timeout=timeout
    )


def main() -> int:
    failures: list[str] = []
    with sync_playwright() as p:
        browser = p.chromium.launch(headless=True)
        errors: list[str] = []
        for label, viewport in (("mobile", {"width": 390, "height": 844}), ("desktop", {"width": 1440, "height": 900})):
            page = browser.new_page(viewport=viewport)
            page.on("pageerror", lambda e: errors.append(str(e)))
            for path, expected in ROUTES.items():
                page.goto(BASE + path, wait_until="domcontentloaded", timeout=120000)
                try:
                    has_text(page, expected)
                    print(f"PASS [{label}] {path}")
                except Exception:
                    page.screenshot(path=f"/tmp/smoke-{label}{path.replace('/', '_') or '_home'}.png", full_page=True)
                    failures.append(f"[{label}] {path}: missing '{expected}'")
                    print(f"FAIL [{label}] {path}")

            # Interaction: completing a task removes it from the open list
            page.goto(BASE + "/tasks", wait_until="domcontentloaded")
            has_text(page, "Refill metformin")
            page.get_by_role("checkbox").first.click()
            page.wait_for_timeout(300)
            if page.get_by_text("Completed").count() == 0:
                failures.append(f"[{label}] task toggle did not move item to Completed")
            page.close()
        browser.close()

    if errors:
        print("Page errors:\n  " + "\n  ".join(errors[:10]))
        failures.append("page errors present")
    if failures:
        print("\nFAILURES:\n  " + "\n  ".join(failures))
        return 1
    print("\nAll smoke checks passed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
