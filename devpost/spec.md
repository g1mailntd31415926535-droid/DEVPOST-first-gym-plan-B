---
doc: spec
status: approved
---

# Gym Plan B — Technical Spec

## How This Works, In Plain Language

App là **một trang web** dựng giống điện thoại (React + Vite, TypeScript). Dữ liệu bài tập nằm trong **một bảng giống bảng tính** trên Supabase — app **chỉ đọc**, không bao giờ ghi. Khi bạn bấm "máy bận", app chạy **một công thức nhỏ ngay trong trình duyệt**: giữ lại các bài **cùng nhóm cơ + cùng vùng cơ**, chấm điểm bài nào chuyển động giống bài gốc nhất (80%) và cùng kiểu compound/isolation (20%), xếp hạng, lấy top 3. Không có AI/LLM, không có server riêng, không có tài khoản. Buổi tập (bài đang tập, bài đã đổi, set đã xong) chỉ nằm trong bộ nhớ trình duyệt — tải lại trang là buổi mới, đúng phạm vi PoC. Hình ảnh gồm **2 lớp**: ảnh minh họa động tác (RepDB, có attribution) và **cơ thể SVG tô đỏ vùng cơ** (MuscleMap). Nếu mất mạng, app tự chuyển sang **bản dữ liệu mẫu đóng gói sẵn** để demo vẫn chạy.

Vì sao hình dạng này: nhỏ nhất mà vẫn chứng minh đúng hạt nhân (engine gợi ý), và mọi phần khó (engine) viết thành module thuần để sau gắn vào app thật/WebView.

## The Core Journey Through the System

PRD ref: `prd.md > The Core Journey`.

1. **Load app** → `data/exercises.ts` gọi Supabase `GET exercises` → lưu vào bộ nhớ; lỗi thì dùng `data/seed.ts` (đánh dấu banner "dữ liệu mẫu").
2. **HomeScreen** hiển thị thống kê mẫu (hằng số) + thẻ **Test Set** (5 bài, khai báo trong code) → bấm ▶ khởi tạo session.
3. **CheckSheet** cho bài hiện tại → "Máy trống – tập luôn" → sang màn tập; "Đang bận – chọn bài khác" → **BusyChoiceSheet**.
4. **BusyChoiceSheet**: (1) "Chọn bài đề xuất" → gọi `rankAlternatives(exercise, exercises)` → **ReplacementListScreen**; (2) "Bài khác trong giáo án" → chuyển con trỏ bài (bài bị bận giữ nguyên trong danh sách chờ).
5. **ReplacementListScreen** hiển thị top 3 (+ nút "xem thêm" mở phần còn lại); mỗi card chạy `MuscleFigure` (MuscleMap) + ảnh RepDB + lý do + khác biệt.
6. **Chọn một bài** → cập nhật session (thay tại vị trí cũ) → **TrainingScreen**.
7. **TrainingScreen**: set chips, "Hoàn thành set" → **RestScreen** đếm ngược `default_rest_seconds` → "Bỏ qua – tập tiếp" → set kế / bài kế.
8. Lặp đến hết Test Set. Không lưu gì ra ngoài.

## Stack

| Thành phần | Lựa chọn | Lý do / đánh đổi |
|---|---|---|
| Build tool | **Vite** (bản ổn định mới nhất lúc cài) | Khởi động nhanh, `npm run dev` đơn giản |
| UI | **React 18.3 + TypeScript** | React vì MuscleMap là React; TS giúp agent ít lỗi kiểu dữ liệu hơn |
| Styling | **Tailwind CSS v3** (ổn định) | Dựng nhanh layout theo mockup, không cần file CSS lớn |
| DB | **Supabase (project mới) + @supabase/supabase-js v2** | Chỉ đọc; đúng yêu cầu dùng bản sao dữ liệu |
| Muscle map | **@musclemap/react 1.x (+ core, assets)** | MIT; SVG tô màu theo MuscleGroup; React-native-compatible sau này qua WebView |
| Test | **Vitest** | Test module engine không cần UI |

Docs: [Vite](https://vite.dev/guide/) · [React](https://react.dev/reference/react) · [Tailwind](https://tailwindcss.com/docs) · [Supabase JS](https://supabase.com/docs/reference/javascript) · [MuscleMap](https://github.com/Jsplice/MuscleMap) · [Vitest](https://vitest.dev/guide/)

⚠️ **Chưa xác minh phiên bản chính xác**: React 18.3 có được peer-dependency của MuscleMap 1.x chấp nhận hay không — kiểm tra ngay bước cài (`npm info @musclemap/react peerDependencies`). Nếu không khớp, nâng React hoặc dùng bản MuscleMap tương thích.

## Where It Runs and How Someone Tries It

- Runtime: trình duyệt trên máy local (Windows). Yêu cầu: **Node 20+**, npm; một file **`.env.local`** (đã gitignore) chứa `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY`.
- Chạy: `npm install` → `npm run dev` → mở `http://localhost:5173`.
- Quay demo: DevTools → chế độ thiết bị dọc (390×844) để giống mockup.
- Nộp bài: **video demo ngắn + repo GitHub công khai** (bắt buộc). **Không deploy** (quyết định learner); deploy không thay thế video/repo.
- Thiếu `.env.local`: app vẫn chạy bằng seed offline (banner rõ), phục vụ quay demo an toàn.

## Look and Feel

Nguồn: `prd.md > Look and Feel` + `scope.md > Inspiration & Identity`.

- Nền trắng, nhấn **xanh dương đậm** (~`#0A66FF`) cho nút/chips chọn; chữ **rất đậm** (font character kiểu Inter/Manrope weight 700–800), heading lớn; thẻ bo tròn lớn (~20–24px); chip xám nhạt (`#F2F3F5`); khoảng thở rộng, cảm giác "app gym hiện đại".
- Copy UI: **tiếng Anh** (đổi tại build theo yêu cầu learner để nộp Devpost; trước đó spec chốt tiếng Việt); **tên bài tập tiếng Anh**.
- Ảnh minh họa: RepDB flat 512px WebP, hiển thị vuông bo tròn. **Cơ thể MuscleMap**: tô đỏ (`monochromeColor` đỏ) đúng vùng cơ; nếu vùng không được thư viện tách → tô nhóm ở mức thô hơn + **nhãn chữ region** ngay cạnh, không giả vờ chính xác.
- Attribution "Exercise data by RepDB (repdb.co)" ở màn About/Credits + README.

## Components

### App (session state machine)
`App.tsx` chỉ điều phối phase → screen; logic session nằm trong `lib/session.ts` (reducer thuần, test được). Giữ `phase` (`home | check | busy | alternatives | training | rest | finished`), `plan`, `queue` (slot còn phải tập; `queue[0]` là bài hiện tại), `deferred`, set hiện tại, set đã xong, `restEndsAt` + `restTarget`. Một `useReducer`; không lưu đĩa. PRD ref: `prd.md > States and Boundaries`.

### HomeScreen
Thống kê mẫu (hardcode), streak, lịch chấm công (ma trận điểm trang trí), thẻ "Test Set" + nút ▶. Chỉ hiển thị. PRD ref: `prd.md > Screens and Layout`.

### CheckSheet
Tên bài (EN), chips `default_sets`, `default_min_rep–max_rep`, `default_rest_seconds`, kg = 99 placeholder; hai nút trống/bận. **Không truyền bất kỳ trạng thái thiết bị nào đi tiếp.** PRD ref: `prd.md > Buổi tập và thay bài`.

### BusyChoiceSheet
Hai lựa chọn: mở danh sách thay thế / mở **danh sách bài còn lại trong plan** để chọn bài tập trước (bài đang bận hoãn xuống cuối, quay lại vẫn hỏi lại). Picker luôn có nút Back; plan chỉ còn bài hiện tại → empty state + Back. PRD ref: như trên.

### ReplacementListScreen + ExerciseOptionCard
Top 3 + "xem thêm". Card: ảnh, tên, tag (`Recommend` / `Kiểu chuyển động khác`), nhóm cơ + region, thiết bị, lý do (sinh từ dữ liệu đã chấm), dòng "khác biệt so với bài gốc" (sinh từ so sánh metadata: family/pattern/type/equipment). PRD ref: `prd.md > Recommendation Engine`.

### MuscleFigure
Bọc `<MuscleMap values={...} monochromeColor="#E5484D" showLegend={false} />`, map taxonomy → `MuscleGroup` qua bảng tra tĩnh (`lib/muscleMapMapping.ts`). Không hỗ trợ region → dùng nhóm thô + nhãn chữ. PRD ref: `prd.md > Look and Feel`.

### TrainingScreen
3 chips (khóa tạ 99 / khoảng rep / nghỉ), set hiện tại lớn, chip S1–S4, "Tiếp theo" (các bài còn lại: tên + set · tạ), nút hoàn thành set. PRD ref: `prd.md > The Core Journey`.

### RestScreen + timer
Vòng đếm ngược; tính theo `Date.now()` để đúng khi tab bị treo; nút "Bỏ qua – tập tiếp"; hết giờ tự chuyển set kế. PRD ref: `prd.md > The Core Journey`.

### lib/recommendation.ts (engine thuần)
`rankAlternatives(original, all): RankedExercise[]`
1. Lọc `muscle_group` + `target_region` trùng tuyệt đối; loại `classify_status = needs-review` khỏi top; loại chính bài gốc.
2. `movementScore`: cùng family+pattern = 1.0; cùng family khác pattern = 0.6; khác family = 0.3.
3. `typeScore`: cùng `exercise_type` = 1, khác = 0.
4. `score = 0.8*movementScore + 0.2*typeScore`; sắp xếp giảm dần; `recommended = score cao nhất && movementScore == 1.0`.
5. Trả về kèm `isDifferentStyle = movementScore < 0.6` / `family khác`; UI gắn tag và **không bao giờ** cho "kiểu chuyển động khác" tag Recommend.
Rỗng → `[]` để UI hiện empty state. Không phụ thuộc React/Supabase → unit-test được và port được.

### data/exercises.ts + data/seed.ts
`fetchExercises()`: Supabase select (id, name, defaults, equipment, metadata, image_asset); timeout/error → seed. Seed = đúng 15–25 bài cần cho Test Set (đóng gói tĩnh, kèm metadata y hệt DB). PRD ref: `prd.md > Dữ liệu`.

## Data Model

### Bảng `exercises` trên project Supabase MỚI

| Cột | Kiểu | Ghi chú |
|---|---|---|
| `id` | uuid PK | **giữ nguyên UUID từ Gym Tracker**, copy tường minh |
| `name` | text not null | tên EN |
| `default_sets` | int4 not null default 3 | copy |
| `default_min_rep` | int4 not null | copy |
| `default_max_rep` | int4 not null | copy |
| `default_rest_seconds` | int4 not null | copy |
| `equipment` | text | copy (chuỗi hiện có, hiển thị thô) |
| `muscle_group` | text | **phân loại MỚI** (Chest/Shoulders/Back/Legs/Arms/Core) |
| `target_region` | text | **MỚI** (Upper/Middle/Lower; Front/Side/Rear; Lats/Upper Back; Quads/Hamstrings/Glutes/Calves; Biceps/Triceps; Abs/Obliques) |
| `movement_family` | text | **MỚI** (Press/Pull/Squat/Hinge/Raise) |
| `movement_pattern` | text | **MỚI** (vd. Incline Press, Vertical Pull) |
| `exercise_type` | text | **MỚI** (compound/isolation) |
| `classify_status` | text not null default 'needs-review' | `classified` / `needs-review` |
| `image_asset` | text null | đường dẫn ảnh RepDB đóng gói sẵn (vd. `/exercises/incline-barbell-press.webp`) |

**Không copy:** `image_url`, `exercise_image_url`, `muscle_diagram_url`, `video_url` (nguồn Lyfta — không có quyền), `secondary_muscles`, `category` (không dùng cho engine). Ghi rõ trong manifest tái sử dụng.

### Migration (khi build, chưa chạy gì)

1. Learner export **đúng các dòng cần** (5 bài gốc + ~10–20 ứng viên) từ project cũ dưới dạng CSV/JSON — **ghi rõ export tay, đọc-only**.
2. Script/SQL import vào project mới, **insert với `id` tường minh** (giữ UUID).
3. Điền metadata mới bằng bảng phân loại đã duyệt; chỗ chưa chắc để `needs-review`.
4. Kiểm tra: số dòng, ID khớp, không có bảng auth/user nào bị copy.

### Bảng phân loại Test Set (đã duyệt trong PRD)

Đúng 5 dòng trong `prd.md > Phân loại dữ liệu bài tập` — build dùng trực tiếp, không suy diễn thêm.

### State trong app (bộ nhớ)

```ts
type Phase = 'home' | 'check' | 'busy' | 'pick' | 'alternatives' | 'training' | 'rest' | 'finished';
type Session = {
  phase: Phase;
  plan: Exercise[];        // 5 bài; bài đã đổi thì thay tại chỗ
  queue: number[];         // slot còn phải tập; queue[0] = bài hiện tại
  deferred: number[];      // slot bị hoãn (chọn "tập bài khác trước"), quay lại cuối queue
  currentSet: number;
  finishedSets: number;
  restEndsAt: number | null;                       // deadline tuyệt đối theo Date.now()
  restTarget: 'next-set' | 'next-exercise' | null;
};
```
Reload = mất session (chủ đích).

## File Structure

```
gym-plan-b/
├── .env.local               # KHÔNG commit: VITE_SUPABASE_URL, VITE_SUPABASE_ANON_KEY
├── .env.example             # tên biến + chỗ trống
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── tsconfig.json
├── README.md                # cách chạy, attribution RepDB, minh bạch tài nguyên
├── devpost/                 # workspace Devpost Learn (đã có)
├── public/
│   └── exercises/           # ảnh RepDB cho đúng bộ test set (đóng gói)
├── src/
│   ├── main.tsx
│   ├── App.tsx              # state machine + điều phối phase
│   ├── screens/
│   │   ├── HomeScreen.tsx
│   │   ├── CheckScreen.tsx        # sheet kiểm máy
│   │   ├── BusyChoiceScreen.tsx   # hai lựa chọn
│   │   ├── PickExerciseScreen.tsx # danh sách bài còn lại + Back/empty state
│   │   ├── ReplacementListScreen.tsx
│   │   ├── TrainingScreen.tsx
│   │   ├── RestScreen.tsx
│   │   └── CreditsScreen.tsx      # attribution RepDB
│   ├── components/
│   │   ├── ExerciseOptionCard.tsx
│   │   ├── MuscleFigure.tsx
│   │   ├── TimerRing.tsx
│   │   ├── Chip.tsx
│   │   └── Sheet.tsx
│   ├── hooks/
│   │   └── useRestTimer.ts        # đếm ngược theo deadline tuyệt đối
│   ├── lib/
│   │   ├── recommendation.ts      # engine thuần
│   │   ├── recommendation.test.ts
│   │   ├── session.ts             # session reducer thuần (queue/defer/rest)
│   │   ├── session.test.ts
│   │   ├── explain.ts             # lý do + khác biệt sinh từ metadata
│   │   ├── muscleMapMapping.ts    # taxonomy -> MuscleGroup enum
│   │   └── supabase.ts
│   ├── data/
│   │   ├── seed.ts                # fallback offline + thứ tự Test Set
│   │   └── exercises.ts           # load + buildTestPlan
│   └── types.ts
└── supabase/
    └── schema.sql             # DDL bảng + RLS select-only + seed import mẫu
```

## External Services and Dependencies

### Supabase (project mới, chỉ đọc)

- Tạo project riêng cho Gym Plan B; bảng `exercises` theo schema trên; bật **RLS** với policy `select` cho `anon` (không insert/update/delete).
- Client gọi: `supabase.from('exercises').select('id,name,default_sets,default_min_rep,default_max_rep,default_rest_seconds,equipment,muscle_group,target_region,movement_family,movement_pattern,exercise_type,classify_status,image_asset')`.
- REST tương ứng: `GET {SUPABASE_URL}/rest/v1/exercises?select=...` với header `apikey` + `Authorization: Bearer <anon>`.
- Key: **anon** trong `.env.local` (được thiết kế công khai, bảo vệ bằng RLS). **service_role / DB password không bao giờ** vào frontend, `.env.example`, hay repo. Docs: [Supabase API keys](https://supabase.com/docs/guides/api/api-keys) · [RLS](https://supabase.com/docs/guides/database/postgres/row-level-security)
- Chi phí: free tier; PoC dùng vài chục dòng dữ liệu.

### RepDB Free Exercise Dataset

- Giấy phép: free cho in-app (kể cả thương mại) **kèm attribution**; **cấm** tái phân phối như dataset/API; **cấm** dùng ảnh làm đầu vào mô hình AI tạo sinh; `premium-samples/` chỉ để xem.
- Cách dùng: tải **chỉ các file WebP của bài cần** vào `public/exercises/` (in-app use), ghi nguồn trong app + README. Không đóng gói toàn bộ kho thành "dataset" trong repo.
- Docs: [repo](https://github.com/RepDB/exercise-dataset) · [LICENSE-DATA](https://github.com/RepDB/exercise-dataset/blob/main/LICENSE-DATA.md)

### MuscleMap

- MIT toàn bộ (code + SVG + ảnh nền). Packages `@musclemap/react`, `@musclemap/core`, `@musclemap/assets`.
- Rủi ro chưa xác minh: **mức tách vùng cơ** (Upper/Middle/Lower chest, Front/Side/Rear delts). Kiểm tra sớm bằng `MUSCLE_GROUP_PARTS` trong `@musclemap/assets`; nếu thiếu → tô nhóm thô + nhãn chữ, hoặc đặt hai hình cạnh nhau.

## Important Failure Modes

- **Supabase không phản hồi / sai key** → chạy seed offline + banner "Đang dùng dữ liệu mẫu"; không chặn demo.
- **Không có ứng viên cùng vùng** → empty state "Chưa có bài thay thế phù hợp (vùng X)"; không bịa thêm.
- **Ảnh thiếu/hỏng** → khung placeholder + chữ tên bài; không vỡ layout.
- **MuscleMap không hỗ trợ region chi tiết** → tô nhóm thô + nhãn chữ region.
- **Tab bị ẩn khi nghỉ** → đồng hồ vẫn đúng nhờ mốc `restEndsAt`.

## What Was Simplified and Why

- **Test Set khai báo trong code** thay vì bảng plan/workout trên DB — chỉ 5 bài cố định, không cần CRUD lịch tập.
- **Engine chạy client-side** thay vì API/LLM — đúng PoC boundary, dễ test, không thêm dịch vụ.
- **Chỉ copy ~15–25 dòng exercises cần thiết** thay vì toàn bộ 100+ — giữ migration nhỏ, minh bạch; mở rộng sau.
- **Session chỉ trong RAM**, không persistence — PoC không cần lịch sử; tránh thêm phức tạp lưu trữ.
- **Thống kê màn chính là hằng số** — chỉ để demo bối cảnh.
- **Ảnh chỉ cho bộ test set** — mở rộng sau khi learner duyệt chất lượng (giả định hướng C: RepDB MVP).

## Verification Plan

- `npm test` (Vitest): 5 bài gốc cho kết quả đúng vùng; Incline không trả về Flat; khác family bị tag "khác kiểu chuyển động" và không được Recommend; empty state với vùng không có ứng viên; `needs-review` không lọt top.
- Manual theo kịch bản demo PRD: mở app → Test Set ▶ → máy bận → hai lựa chọn → top 3 → xem thêm → chọn Recommend → màn tập → hoàn thành set → nghỉ → tiếp.
- Kiểm attribution hiển thị; kiểm app chạy khi rút mạng (seed).

## Decisions and Open Issues

**Learner quyết:** React + Vite + TS mobile-first (web trước, WebView/Expo sau); chạy local, **không deploy**; Supabase project mới, giữ UUID gốc, không copy user data/credentials; không khai báo/lọc theo thiết bị; **tên bài tiếng Anh, toàn bộ UI tiếng Anh** (đổi tại build để nộp Devpost); kg = 99 placeholder; ảnh không dùng Lyfta; **hướng hình ảnh C - RepDB Free cho MVP, nâng style minh họa riêng của Gym Plan B sau cuộc thi** (learner xác nhận tại review spec).

**Một điều chưa chắc (đã thống nhất cách kiểm):** MuscleMap có tách được region chi tiết (ngực trên/giữa/dưới, vai trước/giữa/sau) hay không. Cách kiểm: đọc `MUSCLE_GROUP_PARTS` trong `@musclemap/assets` ngay đầu build; bằng chứng = bảng map `lib/muscleMapMapping.ts` được điền hết hoặc ghi rõ phần fallback.

**Open issues:** (1) peer-dependency React 18.3 vs MuscleMap 1.x — kiểm tra lúc `npm install`; (2) tên file ảnh RepDB khớp `id` nào — chốt khi tải ảnh; (3) learner cung cấp URL + anon key qua `.env.local` (không qua chat).
