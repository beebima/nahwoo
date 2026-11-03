# NAHWOO — Baseline Safety Snapshot & Editorial V5 Roadmap
Date: 2026-11-03
Status: BASELINE SAVED — EDITORIAL WORK NOT YET APPLIED

## Verified baseline
- Repository: beebima/nahwoo, main
- Last Android source revision before this documentation commit: `50bc734aa6b87bf560e36a1ad5cc2f4b561e10b9`
- Android versionName: `0.1.8.14`; versionCode: `21`.
- V4 Reading-First Level 01–16 integrated, Premium Smart Reader present.
- V4 replacement Level 17–24 is **NOT yet integrated in main**; patch is an external handoff artifact awaiting source integration and Android QA.
- Recovery snapshot branch: `backup/v0.1.8.14-pre-editorial-v5-20261103` pointing to `50bc734aa6b87bf560e36a1ad5cc2f4b561e10b9`.
- This document is NOT a V0.1.8.15 Android release and does not claim an APK build.

## Source packet pending integration
- Provided: `NAHWOO_V4_LEVEL_17-24_KOMPILASI_LENGKAP(1).zip`
- SHA-256: `b99c9936fb9716d94860891ad0fb44757fdb6a63d94cf75b770737fdbd605858`
- Verified archive inventory: 8 levels, 80 sublevels, 1,600 questions.
- Existing local patch files have been prepared but NOT committed to the repository.
- Before integration, fix the renderer V4 gating in `nahwooLessonMarkup`: it currently considers only 1–16 as V4. Preserve content ordering, semantic cards and quick-check behavior for 17–24; check evaluation storage/versioning and progress compatibility.
- Run source parity checks, JSON/key correspondence QA, reader preview, mobile viewport/dark mode/font QA, Android build, and physical-device validation before declaring release.

## 24-step Editorial V5 workflow — only after user approval
The owner requested exactly one editorial version per level:
- Level 01 -> `V0.1.8.15.01`, Level 02 -> `V0.1.8.15.02`, ... Level 24 -> `V0.1.8.15.24`.
- For each level: audit source; rewrite narrative, section headings, opening and activity copy; preserve Arabic text/harakat, learning objectives, unique data IDs, question correctness and evaluation keys; generate source/QA report and reader preview; submit for explicit user approval (ACC); **ONLY AFTER ACC**, commit/push to GitHub.
- No auto-upload, pre-approval pushes, unattended commits, or silent changes in other levels.
- Use incrementing Android `versionCode` for APK releases; `versionName` may take the owner-approved suffix. Do not declare builds green without checking CI.
- After each accepted level, audit duplicates against all prior levels AND completed V5 versions.

## Editorial V5 standards
1. Every narrative sentence and opening must be meaningfully individualized per sublevel. Same grammar lesson may be repeated for spaced learning, but narration, angles, and analogies must differ.
2. Conversational Indonesian, inclusive `kita` voice (not `aku/saya` when teaching), friendly but scholarly accurate; avoid stiff school-textbook formula.
3. Remove empty/redundant labels like `Contoh Bahasa Arab` in the reader UI. Arabic examples should be recognizable through visual hierarchy, not repetitive generic headings.
4. Vary opening styles: diagnostic question, mistake analysis, direct comparison of Arabic expressions, mini situation or short example. Do not copy a fixed opening template.
5. Remove filler, forced analogies and duplicated explanations; keep purposeful instruction, grammar evidence, source fidelity, and explicit uncertainty where unvowelled text allows multiple readings.
6. Premium Smart Reader remains selective: open paragraphs; warm yellow target cards; blue focused Arabic; green analysis; purple exercises; soft red warnings; blue takeaway. Never box every paragraph.
7. Keep app features and personal settings intact; verify scroll, Arabic RTL/harakat, inline Arabic size, light/dark theme, 320–390 px and Android device.

## Release policy
- This baseline backup and documentation upload are **explicitly authorized on 2026-11-03**.
- Future editorial updates `V0.1.8.15.01` through `V0.1.8.15.24` require **an explicit ACC from the user for each push**.
- A prepared local file is not a committed GitHub change; a successful static QA is not an Android build.
