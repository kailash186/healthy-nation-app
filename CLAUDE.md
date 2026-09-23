# Healthy Nation App — Agent Notes

Expo SDK 54 / React Native 0.81 / React 19 / TypeScript / Expo Router.

## Commands

```bash
npm install        # install deps
npm start          # Expo dev server
npm run web        # web preview
npm run lint       # ESLint (expo lint)
npm run typecheck  # tsc --noEmit
```

## UI/UX work

Use the `ui-ux-pro-max` skill in `.claude/skills/ui-ux-pro-max/` for any design,
build, review, or polish task. Query with **`--stack react-native`** (this is a
mobile app, not html-tailwind):

```bash
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "healthcare mobile app" --design-system -p "Healthy Nation"
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<topic>" --stack react-native
python3 .claude/skills/ui-ux-pro-max/scripts/search.py "<topic>" --domain ux
```

Theme tokens live in `constants/colors.ts`; icons come from `lucide-react-native`.

## Browser testing

Use the `webapp-testing` skill in `.claude/skills/webapp-testing/` (Playwright).
Run `python3 .claude/skills/webapp-testing/scripts/with_server.py --help` first.
A ready-made smoke test for the web build lives in `tests/e2e/smoke_web.py`:

```bash
pip install playwright && python3 -m playwright install chromium   # one-time
python3 .claude/skills/webapp-testing/scripts/with_server.py \
  --server "npx expo start --web --port 8081" --port 8081 \
  -- python3 tests/e2e/smoke_web.py
```
