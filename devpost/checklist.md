---
doc: checklist
status: approved
---

# Build Checklist

Build mode: learn

## Slices

- [x] **1. App chạy được và hạt nhân hoạt động: danh sách bài thay thế được xếp hạng**
  Becomes usable: Mở app ở localhost, thấy màn chính mẫu, bấm ▶ Test Set, tới sheet kiểm máy, bấm "Đang bận" → sheet hai lựa chọn → "Chọn bài đề xuất" → danh sách top 3 do **engine thật** xếp hạng từ dữ liệu seed (cùng vùng cơ, 80/20, tag Recommend / kiểu chuyển động khác, lý do). Chọn một bài → màn tập tối giản hiện bài mới đã thay vào vị trí cũ.
  Why now: Đây là kernel — nếu engine sai thì mọi thứ sau đó vô nghĩa. Scaffold nằm trong chính slice này; vòng lặp lõi chạy end-to-end ngay từ đầu để mọi slice sau có chỗ đứng.
  PRD ref: `prd.md > The Core Journey` (bước 1–5), `prd.md > Recommendation Engine`, `prd.md > Buổi tập và thay bài`
  Spec ref: `spec.md > Stack`, `spec.md > File Structure`, `spec.md > Components` (`App`, `HomeScreen`, `CheckSheet`, `BusyChoiceSheet`, `ReplacementListScreen`, `lib/recommendation.ts`, `data/exercises.ts`), `spec.md > Verification Plan`
  Build: Scaffold Vite + React + TS + Tailwind theo file structure; seed data cho 5 bài gốc + ứng viên (metadata theo bảng phân loại đã duyệt); viết `lib/recommendation.ts` thuần + `recommendation.test.ts`; dựng 4 màn/sheet đầu và state machine `useReducer`; kg = 99 placeholder, tên bài tiếng Anh, UI tiếng Việt.
  Verify (mechanical): `npm.cmd run build` (hoặc `tsc --noEmit`) không lỗi; `npm.cmd test` passes các case: cùng vùng mới vào danh sách; Incline không trả Flat/Middle; khác family bị tag "kiểu chuyển động khác" và không được Recommend; `needs-review` không lọt top; vùng không có ứng viên → danh sách rỗng. Dev server khởi động không lỗi console.
  Learner check: Mở `http://localhost:5173`, bấm vào Test Set, bấm "Đang bận" → "Chọn bài đề xuất", xem danh sách có đúng kiểu "một bài cùng vùng cơ đứng đầu kèm lý do" như bạn hình dung không, và nói cảm giác giao diện so với mockup.
  Commit: `feat: ranked replacement list with recommendation engine`

- [x] **2. Buổi tập hoàn chỉnh: màn tập, đồng hồ nghỉ, và lựa chọn "tập bài khác trước"**
  Becomes usable: Từ bài đã thay, màn tập hiển thị đủ chips (khóa tạ 99, khoảng rep, nghỉ), set hiện tại + chip S1–S4, "Tiếp theo"; bấm "Hoàn thành set" → màn nghỉ đếm ngược đúng theo `default_rest_seconds`, có "Bỏ qua – tập tiếp", hết giờ tự sang set kế; chọn "Bài khác trong giáo án" thì bài bị bận được hoãn, quay lại vẫn hỏi lại máy trống không; đi hết Test Set tới màn kết thúc buổi.
  Why now: Hoàn thiện vòng lặp người dùng thật (tập → nghỉ → bài kế) trước khi nối dữ liệu thật, để lỗi hành vi lộ ra khi còn rẻ; đồng hồ là chỗ dễ sai khi tab bị ẩn.
  PRD ref: `prd.md > The Core Journey` (bước 6–8), `prd.md > Buổi tập và thay bài`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Components` (`TrainingScreen`, `RestScreen`, `App`), `spec.md > Data Model` (state shape), `spec.md > Important Failure Modes` (đồng hồ khi tab ẩn)
  Build: TrainingScreen + RestScreen + `TimerRing` + `useRestTimer` dựa trên `restEndsAt`; logic hoãn bài (`deferred`) và quay lại; màn kết thúc buổi; empty state cho danh sách thay thế rỗng.
  Verify (mechanical): `npm.cmd run build` sạch; vitest cho logic hoãn/đổi bài (bài bị bận vẫn nằm trong danh sách, đổi xong đúng vị trí); chạy dev server, bấm hết một buổi, xác nhận đồng hồ đếm đúng và "Bỏ qua" sang set kế; ẩn tab 10 giây rồi quay lại, đồng hồ vẫn đúng.
  Learner check: Chạy trọn một buổi tập trong app — thay một bài, hoàn thành 2 set, dùng "Bỏ qua – tập tiếp", thử nút "Bài khác trong giáo án" — và báo chỗ nào chậm/khó hiểu so với cách bạn tập thật.
  Commit: `feat: full training session with rest timer and deferred exercises`

- [ ] **3. Dữ liệu thật: Supabase project mới, giữ nguyên Exercise ID, có fallback offline**
  Becomes usable: App đọc bảng `exercises` từ Supabase mới (chỉ đọc, RLS select-only), hiển thị đúng 5 bài Test Set + ứng viên từ dữ liệu thật; nếu thiếu `.env.local` hoặc mất mạng → tự chạy seed + banner "đang dùng dữ liệu mẫu", demo không chết.
  Why now: Sau khi hành vi đã đúng, thay nguồn dữ liệu là thay đúng một lớp; làm sớm hơn sẽ trộn lỗi dữ liệu với lỗi UI. Đây cũng là chỗ kiểm chứng yêu cầu "không đụng Supabase cũ, giữ UUID".
  PRD ref: `prd.md > Dữ liệu`, `prd.md > States and Boundaries`
  Spec ref: `spec.md > Data Model` (bảng + migration), `spec.md > External Services and Dependencies` (Supabase), `spec.md > Important Failure Modes`
  Build: `supabase/schema.sql` (DDL + RLS select-only) và script/hướng dẫn import giữ `id`; `lib/supabase.ts` + `data/exercises.ts` fetch/fallback; `.env.example`; learner tự tạo project + chạy SQL + export/import đúng các dòng cần (không copy auth/users/credentials, không đụng project cũ).
  Verify (mechanical): Chạy `select count(*)` trên project mới → đúng số dòng đã import; gọi REST `GET /rest/v1/exercises?select=id,name` trả 200 với UUID khớp bản cũ; app với `.env.local` hiển thị dữ liệu Supabase (không banner); tạm đổi key sai → app chuyển seed + banner; xác nhận project cũ không có thay đổi nào.
  Learner check: Mở app khi đã cấu hình Supabase, xác nhận tên bài/sets/reps/rest hiển thị giống dữ liệu app gym cũ của bạn; thử tạm xoá `.env.local` xem banner dữ liệu mẫu có hiện và app vẫn dùng được không.
  Commit: `feat: connect Supabase read-only data with offline seed fallback`

- [ ] **4. Hình ảnh: ảnh động tác RepDB + cơ thể tô đỏ vùng cơ (MuscleMap)**
  Becomes usable: Mỗi card thay thế và màn tập có ảnh minh họa động tác (RepDB, chỉ các bài trong Test Set + ứng viên), kèm hình cơ thể tô đỏ đúng nhóm/vùng cơ; nếu MuscleMap không tách được region cụ thể → tô nhóm thô + nhãn chữ region (không giả chính xác); màn Credits hiển thị attribution RepDB.
  Why now: Đây là lớp "kể chuyện" của sản phẩm; làm sau khi dữ liệu thật ổn để ảnh gắn đúng `id`, và là chỗ có rủi ro kỹ thuật đã biết (mức tách vùng của MuscleMap) cần lộ ra sớm.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Screens and Layout`
  Spec ref: `spec.md > Components` (`MuscleFigure`), `spec.md > External Services and Dependencies` (RepDB license + MuscleMap), `spec.md > Decisions and Open Issues` (điều chưa chắc của MuscleMap)
  Build: Kiểm tra `MUSCLE_GROUP_PARTS` của `@musclemap/assets`; điền `lib/muscleMapMapping.ts` hoặc ghi rõ fallback; tải đúng file ảnh RepDB cần dùng vào `public/exercises/` (không đóng gói cả dataset, không dùng premium-samples), gắn `image_asset`; dựng `MuscleFigure`, ảnh trong card + màn tập; CreditsScreen + attribution.
  Verify (mechanical): Bảng mapping phủ hết 5 vùng cần (hoặc fallback được ghi rõ); mọi card có ảnh load được (không 404 trong console); tô đỏ đúng nhóm ở 5 bài gốc; attribution hiển thị trong app.
  Learner check: Mở một danh sách thay thế và xem ảnh + hình cơ thể — nhóm cơ tô đỏ có đúng chỗ bạn kỳ vọng không, style ảnh có chấp nhận được cho video demo không?
  Commit: `feat: exercise illustrations and red muscle-region highlighting`

- [ ] **5. Đóng gói demo: polish theo mockup, trạng thái rỗng, README và attribution**
  Becomes usable: Toàn bộ hành trình mượt và đúng chất mockup (màu, bo góc, typography, khoảng thở); empty state "Chưa có bài thay thế phù hợp (vùng X)" đúng chỗ; README có cách chạy, attribution RepDB, và mục minh bạch tài nguyên (dữ liệu tái sử dụng từ Gym Tracker); app sẵn sàng quay video 1 phút theo kịch bản PRD.
  Why now: Polish sau cùng để không phí công chỉnh thứ sẽ đổi; README/attribution là điều kiện nộp bài, không phải trang trí.
  PRD ref: `prd.md > Look and Feel`, `prd.md > Non-Goals`, `prd.md > What We're Building`
  Spec ref: `spec.md > Look and Feel`, `spec.md > Where It Runs and How Someone Tries It`, `spec.md > External Services and Dependencies`
  Build: Chỉnh style theo mockup; kiểm tra empty state, banner offline, copy UI; viết README (chạy app, attribution, transparency note theo scope); dọn lỗi console; rà lại không có secret/learner-profile trong repo.
  Verify (mechanical): `npm.cmd run build` + `npm.cmd test` sạch; mở DevTools 390×844 đối chiếu mockup; chạy đúng kịch bản demo 1 phút không lỗi console; README có đủ 3 mục bắt buộc; `git status` sạch và không có `.env.local`/`learner-profile.md` bị track.
  Learner check: Tự bấm lại toàn bộ kịch bản demo trên khung điện thoại, xem có chỗ nào lệch so với hình dung ban đầu, rồi thử quay nháp 1 phút bằng điện thoại/quay màn hình.
  Commit: `chore: demo polish, README and attribution`

## Hands-on Checkpoints

- [x] Early usable behavior explored — sau slice 1 (danh sách thay thế xếp hạng)
- [ ] Final kick-the-tires exploration and feedback completed

## Final Review

- [ ] Final review complete — feedback resolved and learner confirms ready to ship

## Code Tour and App Map

- [ ] Learning activity complete — guided route, focused alternative, prior practice connected, or brief recap
- [ ] Optional edit and transfer reflection addressed — offered/declined/already covered/not applicable as appropriate
- [ ] `devpost/app-map.html` generated from finished code, checked, and shown, including a project-grounded practice to reuse

Activity and evidence: [what actually happened; real document/test/code references; unfinished work if interrupted]
Route and stops: [actual paths and symbols; guided stops completed, or reference-only route]
Edit outcome: [tried/kept/reverted/declined/not applicable; verification if changed]
Reflection: [offered/answered/declined/already covered — personal answer belongs only in the ignored profile]
Activity mode: [live app and editor, explicit static fallback, focused alternative, prior practice, or recap]

## Revisions

- Slice 1: lựa chọn "Bài khác trong giáo án tập trước" đã hiện trong sheet nhưng còn disabled; hành vi hoãn bài thật thuộc slice 2 (đúng thứ tự đã duyệt).
- Slice 1: Test Set được resolve theo **tên bài** (`TEST_PLAN_ORDER`) thay vì UUID seed, để khi import UUID thật từ Gym Tracker ở slice 3 không phải sửa logic kế hoạch.
- Slice 1: nâng vitest lên 3.x để khớp Vite 6 (vitest 2 kéo Vite 5 riêng và làm `tsc` báo lỗi type của plugin).
- Slice 1: chỉ bundle font Inter subset latin + vietnamese (đủ cho UI tiếng Việt, giảm số file font).
- Build: **toàn bộ copy UI đổi sang tiếng Anh** theo yêu cầu learner (nộp Devpost); `prd.md` + `spec.md` đã cập nhật quyết định ngôn ngữ.
- Slice 2: session reducer tách ra `lib/session.ts` (thuần, test được) với **queue slot** thay vì `currentIndex`, để hoãn bài = đưa slot về cuối queue; `restEndsAt` là deadline tuyệt đối; thêm `restTarget` để biết hết nghỉ thì sang set kế hay bài kế.
- Slice 2 (feedback learner): "Do another exercise first" mở **danh sách bài còn lại trong plan** để user tự chọn (không tự nhảy sang bài kế), có nút Back ở mọi trạng thái, và empty state + Back khi bài hiện tại là bài duy nhất còn lại. `prd.md` + `spec.md` đã cập nhật.
- Slice 3 (code path): `loadExercises()` async + loading gate; Supabase lỗi/thiếu config/thiếu bài Test Set → seed + banner "Sample data". `lib/supabase.ts` chỉ dùng anon key; `supabase/schema.sql` bật RLS select-only, không có policy ghi; `supabase/IMPORT.md` hướng dẫn export read-only + insert giữ UUID. **Chưa import dữ liệu thật** — chờ learner export và duyệt metadata.
- Slice 3 (dữ liệu): export full 100 bài từ project cũ; import **26 dòng** (5 Test Set + ứng viên đã phân loại mỗi vùng + 3 `needs-review`). Giữ UUID gốc, tên rút về nhãn tiếng Anh đã duyệt, sets/reps/rest/equipment copy nguyên. Seed offline viết lại y hệt DB.
- Slice 3 (mở rộng theo yêu cầu learner): thêm Smith Machine Bench Press, Pec Deck Fly, One-Arm Dumbbell Row, Goblet Squat; nâng Low-to-High Cable Fly, Push-Up, Chin-Up, Front Squat lên `classified`. Kết quả: Flat Bench có 5 ứng viên (top 3 + xem thêm), Squat/Lat Pulldown có 4; Shoulders/Side vẫn 2 vì dữ liệu thật không có bài khác — không bịa.

