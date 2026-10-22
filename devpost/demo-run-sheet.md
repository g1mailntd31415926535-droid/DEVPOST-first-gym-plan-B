# Demo Recording Run Sheet

This is a recording plan, not submission copy and not narration. The learner writes and speaks the narration; this sheet only keeps the screen actions aligned with what the app actually does.

Target length: **1:30–1:50**. Record the running app at **390 × 844**. Do not record code, slides, terminals, or personal tabs.

## Pre-flight (before recording)

1. Start the app: `npm run dev` (Windows: `npm.cmd run dev`).
2. Open <http://localhost:5173>, then set DevTools device mode to **390 × 844**.
3. Reload once to reset the in-memory session to Home.
4. Confirm the Home screen **does not** show “Live data is unavailable”. It should use the live Supabase catalog. If the banner appears, fix the network/`.env.local` setup before recording; do not record the fallback unless that is the intended demo.
5. Check the console is clean, then close DevTools so it is not in frame.
6. Hide bookmarks, personal tabs, notifications, email, and any file explorer window. Do not open `.env.local`.
7. Keep the mouse movement slow and deliberate. Use **Skip rest — train now** so the video does not wait for real rest timers.

The Home screen avatar “TD” is a static sample label. There is no account, auth, or user profile in the app.

## Verified flow

The screen labels below were checked against the current app.

| Time | Screen | Action / thing to show |
| --- | --- | --- |
| 0:00–0:11 | Home | Introduce the problem, who it is for, and the purpose of Gym Plan B. |
| 0:11–0:16 | Home | Tap the play button on the **Test Set** card. |
| 0:16–0:21 | Exercise 1 check | **Incline Barbell Press**; show the “machine busy” choice. |
| 0:21–0:26 | Busy choice | Tap **See suggested swaps**. |
| 0:26–0:41 | Exercise swap list | Show **3 matching exercises**. Point out the **Recommend** card, its reason, and the **Different movement style** tag on the cable fly. Explain that only the same muscle group + region is listed, ranked by movement similarity and type. |
| 0:41–0:51 | Training | Choose the **Recommend** option (**Incline Dumbbell Press**). Show the training screen. |
| 0:51–1:03 | Training / rest | Complete sets 1–3, tapping **Skip rest — train now** after each. This is required to reach the next exercise; the app does not skip an unfinished exercise. |
| 1:03–1:08 | Exercise 2 check | **Flat Bench Press** appears. |
| 1:08–1:13 | Busy choice | Tap **Machine busy — swap exercise** → **Do another exercise first**. |
| 1:13–1:25 | Pick what to train now | Point to **WAITING FOR ITS MACHINE — Flat Bench Press**. It correctly shows the exercise that is currently busy. Explain that it moves to the end of the queue and is **not deleted**. Pick **Lateral Raise**. |
| 1:25–1:30 | Exercise 2 check | **Lateral Raise**; tap **Machine free — train now**. |
| 1:30–1:39 | Training | Scroll to **Next up**: **Lat Pulldown**, **Squat**, then **Flat Bench Press** last. This is the visible proof that the deferred exercise returns later. |
| 1:39–1:50 | Training (or Home) | Summarize the Recommendation Engine principle: hard same-region filter first, then movement/type ranking; different movement styles are labeled honestly. End on the product value. |

## Correction to the earlier shot list

The earlier note said the picker would show **Incline** when **Flat Bench** was busy. That was a description error in the plan, not an app bug. In the current app, the picker shows the **exercise that is actually busy**:

- Incline busy → picker shows **Incline Barbell Press**.
- Flat Bench busy → picker shows **Flat Bench Press**.

Verified in the current flow: after finishing Incline Dumbbell Press and reaching Flat Bench, the picker shows **“WAITING FOR ITS MACHINE — Flat Bench Press”**, and after choosing Lateral Raise, **“NEXT UP”** ends with **Flat Bench Press**.

## What not to change for the recording

- No new UI, data, or engine behavior is needed for this demo.
- Do not fake a deferred exercise, hide a state, or edit data just to make the shot work.
- If a click does not match this sheet, stop and report it; the app may have changed and the run sheet should be updated before recording.
