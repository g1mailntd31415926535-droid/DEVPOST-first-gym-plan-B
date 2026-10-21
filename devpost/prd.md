---
doc: prd
status: approved
---

# Gym Plan B — Product Requirements

Mini-app độc lập dành cho người tập gym (trước hết là chính learner): khi bài tập trong kế hoạch bị chiếm máy, app gợi ý bài thay thế phù hợp bằng Recommendation Engine tính điểm theo metadata — giữ nguyên mục tiêu tập luyện. Nguồn: `scope.md` (đã duyệt, tên dự án Gym Plan B).

## The Core Journey

1. **Mở app** → màn chính hiển thị nguyên mẫu thiết kế của learner (thống kê buổi tập, streak, lịch chấm công "Độ chăm chỉ", "Giáo án của bạn") với **dữ liệu mẫu cố định, chỉ hiển thị**. Source: `scope.md > The Core Loop`.
2. Bấm nút ▶ trên thẻ giáo án **"Test Set"** (5 bài: Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat) → bắt đầu buổi tập.
3. **Sheet kiểm tra từng bài** (bài 1/5): hiện tên bài **tiếng Anh** (quyết định của learner: nộp cho ban tổ chức ở Mỹ, bỏ tên tiếng Việt), chips: khóa tạ (kg = 99 placeholder), số set, chuỗi reps → hỏi *"Máy / vị trí tập này hiện có đang trống không?"* → hai nút: **"✓ Máy trống – tập luôn"** / **"⚠ Đang bận – chọn bài khác"**. **Đây chỉ là cổng thao tác để user báo "bài này tôi không tập được ngay" — không phải khai báo tình trạng/thiết bị phòng gym, và không có dữ liệu nào từ lựa chọn này đi vào engine.**
4. Chọn "Đang bận" → **sheet hai lựa chọn**: **(1) "Chọn bài đề xuất"** → mở **màn danh sách bài thay thế**: top 3 phương án + nút "xem thêm" (bấm ra thêm một số bài nữa); mỗi phương án hiển thị: tên bài, ảnh minh hoạ, nhóm cơ mục tiêu, thiết bị cần dùng, lý do được đề xuất; bài tiềm năng nhất có tag **Recommend**; các bài khác movement_family được tách tag "kiểu chuyển động khác". **(2) "Chọn bài khác trong giáo án"** → tạm bỏ qua bài bị bận, sang tập một bài khác của buổi tập trước. → Người dùng **tự quan sát phòng gym** để chọn phương án khả dụng.
5. Chọn một phương án → bài đó **thay vào vị trí cũ** trong Test Set.
6. **Màn tập**: tên bài, chips (khóa tạ / khoảng rep / thời gian nghỉ), "Hiệp đang tập", chip từng set (S1–S4), phần "Tiếp theo" (các bài kế), nút **"Hoàn thành set 1"**.
7. Bấm hoàn thành set → **màn nghỉ giữa hiệp**: đồng hồ đếm ngược (180s mặc định), hàng "Chuẩn bị – Set 2/4", nút **"Bỏ qua – tập tiếp"**.
8. Lặp lại cho đến cuối bài cuối → buổi tập khép lại. Đây là toàn bộ demo.

## Screens and Layout

1. **Màn chính** — như ảnh mẫu của learner: thẻ thống kê, thẻ "Độ chăm chỉ" (streak + lịch chấm công), mục "Giáo án của bạn" chứa thẻ "Test Set" + nút ▶ lớn. Chỉ hiển thị, không tương tác ngoài nút ▶.
2. **Sheet kiểm tra máy** — bottom sheet như ảnh mẫu: "BÀI 1/5", tên bài, chips (kg · set · reps), câu hỏi trống/bận, hai nút lớn.
3. **Sheet lựa chọn khi máy bận** — hai lựa chọn: "Chọn bài đề xuất" / "Chọn bài khác trong giáo án".
4. **Màn danh sách thay thế** — list: tối đa 3 phương án trực tiếp + "xem thêm"; mỗi dòng: ảnh minh họa, tên, tag (Recommend / kiểu chuyển động khác), nhóm cơ, thiết bị, lý do, khác biệt so với bài gốc.
4. **Màn tập** — như ảnh mẫu: tiêu đề bài, 3 chips (Khóa tạ / Khoảng rep / Nghỉ), khối "Hiệp đang tập" với set hiện tại lớn + chip S1–S4, mục "Tiếp theo" (bài kế: tên + set · tạ), nút "Hoàn thành set N".
5. **Màn nghỉ** — như ảnh mẫu: tiêu đề "Nghỉ giữa hiệp", vòng đếm ngược lớn, hàng "Chuẩn bị – Set N/M", nút "Bỏ qua – tập tiếp".

## Look and Feel

- Theo ảnh thiết kế của learner: nền trắng, **xanh dương đậm** làm màu chính cho nút/điểm nhấn, chữ đậm cỡ lớn, các thẻ bo tròn lớn, chip thông tin nền xám nhạt.
- Ảnh minh họa bài tập: **RepDB Free** (flat style 512px WebP) — không dùng `premium-samples/`, không dùng ảnh Lyfta trực tiếp.
- Vùng cơ mục tiêu **tô đỏ** bằng SVG **MuscleMap** (cách thế 2 ý cạnh nhau nếu thuận hơn). Nếu MuscleMap không tách được mức ngực trên/giữa/dưới hoặc vai trước/giữa/sau → **không tô cả nhóm rồi tuyên bố là region đã tách**: dùng nhãn chữ target_region + trình bày trung thực (high-level nhom cơ, chữ chỉ định region).
- Attribution **"Exercise data by RepDB (repdb.co)"** hiển thị trong app (màn credits/phụ) + README.

## Features and Behavior

### Recommendation Engine (trái tim của PoC)

- **Lọc cứng (Giai đoạn 1):** ứng viên phải trùng **cả** `muscle_group` và `target_region` của bài gốc (ngực trên ≠ ngực giữa ≠ ngực dưới; vai trước ≠ vai giữa ≠ vai sau…). Bài gốc hoặc ứng viên chưa phân loại vùng → không vào danh sách hàng đầu.
- **Tính điểm (Giai đoạn 2):** điểm = chuyển động giống 80% (movement_family + movement_pattern: cùng family + pattern là cao nhất; khác family, cùng pattern = trung bình → tag "kiểu chuyển động khác") + kiểu bài 20% (compound/isolation khớp).
- **Không dùng bảng quan hệ cứng cho từng cặp bài**; không dùng điểm kích hoạt cơ kiểu vô căn cứ (kiểu Ngực = 3, Triceps = 2, Vai trước = 1); không dùng LLM trong MVP.
- **Minh bạch ý nghĩa:** app nói rõ xếp hạng là "độ giống chuyển động", không tuyên bố tương đương hiệu quả khoa học.
- **Không đủ ứng viên ở một vùng (ví dụ: bộ kiểm thử chỉ có một bài cùng vùng Quads với Squat):** thông báo rõ *"Chưa có bài thay thế phù hợp (vùng X)"*, không cố đề xuất cho đủ.

### Phân loại dữ liệu bài tập

Bảng taxonomy đã được learner duyệt từng ý (family: Press · Pull · Squat · Hinge · Raise; pattern cụ thể bên dưới mỗi family):

| # | Bài tập (Test Set) | muscle_group | target_region | family | pattern | type |
|---|---|---|---|---|---|---|
| 1 | Incline Barbell Press | Chest | Upper | Press | Incline Press | Compound |
| 2 | Flat Bench Press | Chest | Middle | Press | Horizontal Press | Compound |
| 3 | Lateral Raise | Shoulders | Side | Raise | Lateral Raise | Isolation |
| 4 | Lat Pulldown | Back | Lats | Pull | Vertical Pull | Compound |
| 5 | Squat | Legs | Quads | Squat | Squat Pattern | Compound |

Ứng viên dự kiến (tên thật từ bản clone; thiếu bài nào → **báo thiếu dữ liệu, không bịa bài**) — ⚠ = `needs-review`:

| Bài gốc | Ứng viên cùng family | Ứng viên khác family (tag "kiểu chuyển động khác") |
|---|---|---|
| Incline Barbell Press | Incline Dumbbell Press · Smith Machine Incline Press · Incline Machine Press | Low-to-High Cable Fly ⚠ |
| Flat Bench Press | Dumbbell Bench Press · Machine Chest Press | Cable Fly ⚠ · Push-Up ⚠ |
| Lateral Raise | Cable Lateral Raise · Machine Lateral Raise · Dumbbell Lateral Raise (nếu tách riêng khỏi bài gốc) | Upright Row ⚠ |
| Lat Pulldown | Pull-Up · Seated Cable Row (cùng family, pattern khác → điểm thấp hơn) · Chin-Up ⚠ | Straight-Arm Pulldown ⚠ |
| Squat | Leg Press · Hack Squat · Front Squat ⚠ | Bulgarian Split Squat ⚠ (unilateral, family lunges chưa khai báo) |

Ma trận điểm movement (80%): cùng family + cùng pattern = 1.0 → tag Recommend; cùng family + khác pattern = 0.6; khác family = 0.3 + bắt buộc tag "kiểu chuyển động khác", không được dính Recommend. Exercise type (20%): khớp = 1, không = 0.

- Bộ metadata: `muscle_group`, `target_region`, `movement_family`, `movement_pattern`, `exercise_type`, `classify_status`.
- Có thể dùng AI hỗ trợ phân loại các bài Test Set + ứng viên; **trường hợp không chắc chắn được đánh dấu `needs-review` chờ learner xem lại**; không tự bịa thông tin chuyên môn.
- Không phân loại cả 650 bài RepDB / cập nhật hàng loạt trong MVP.

### Buổi tập và thay bài

- **Nguyên tắc UX (quan trọng):** CheckSheet và BusyChoiceSheet **không phải quy trình khai báo tình trạng thiết bị**. User chỉ xác định "bài này tôi không tập được ngay" rồi yêu cầu bài thay thế. App **không hỏi** user đang có những thiết bị nào; engine **không bao giờ** lọc kết quả theo tình trạng thiết bị; danh sách đề xuất giống hệt nhau bất kể "máy nào bận". User tự quan sát phòng gym và chọn phương án.
- Sheet từng bài: máy trống → tập luôn; máy bận → **sheet hai lựa chọn**: (1) mở danh sách thay thế đề xuất; (2) **"chọn bài khác trong giáo án để tập trước"** — tạm hoãn bài bị bận và sang bài khác (*assumption chờ learner xác nhận: bài bị bận vẫn còn trong danh sách để quay lại sau, khi quay lại hỏi lại máy trống không*).
- Chọn bài thay thể → đổi vị trí bài cũ trong Test Set → sang **màn tập** của bài mới.
- Màn tập: set hiện tại, chip 4 set (S1–S4), "Tiếp theo"; "Hoàn thành set" → màn nghỉ → đếm ngược → "Bỏ qua – tập tiếp" → set kế hoặc bài kế.
- Giá trị mặc định của bài gợi ý: **sets/reps lấy theo mặc định từ bản ghi bài tập**; **kg = 99 (placeholder cho mọi bài)** — quy đổi tạ sẽ thêm sau cuộc thi.

### Dữ liệu

- **Supabase mới clone từ Supabase cũ** (100+ bài exercises của Gym Tracker). Supabase cũ **chỉ đọc, không đụng**.
- Cần **báo cáo chính xác các bảng được copy** và những cột được copy trong (tên, ID, sets/reps/rest nếu có) trước khi migrate.

### Kịch bản demo (video ~1 phút, minh hoạ flow thật — không phải tính năng riêng)

Bấm ▶ vào Test Set bắt đầu tập → sheet bài bị bận → bấm "Đang bận" → **chọn "Chọn bài đề xuất"** → danh sách top 3 hiện ra → bấm **"xem thêm"** mở thêm một số bài → **chọn bài có tag Recommend đứng đầu** → thay vào vị trí cũ → tập bình thường (màn tập → hoàn thành set → nghỉ → tiếp tục). Không có chức năng nhập thiết bị — đó chỉ là bối cảnh demo, không phải tính năng mới.

## States and Boundaries

- **Trạng thái rỗng (không có ứng viên cùng vùng):** thông báo rõ thay vì hiện một danh sách thiếu ứng viên. Source: quyết định learner "*nếu không có ứng viên đủ phù hợp, thông báo rõ*".
- **Bài chưa phân loại (needs-review):** không vào engine; hiển thị nhãn "chờ phân loại" thay vì gợi ý; learner xem lại những bài được đánh dấu này.
- **Bài gốc không rõ vùng ưu tiên khi user chọn thay thế:** app hỏi ngay "mục tiêu tập là vùng nào?" cho buổi tập đó — quyết định của user, không sửa metadata gốc.
- **Dữ liệu các chỉ số (streak…):** cố định, chỉ hiển thị, không cập nhật theo tập luyện thật.
- **Dữ liệu Supabase cũ:** chỉ đọc tuyệt đối; mọi ghi chép sang bản clone mới.
- **Không đăng nhập:** một người dùng duy nhất (chính learner).

## Product Decisions

- **MVP chỉ Exercise Substitution; Workout Rescue (điều chỉnh kế hoạch theo thời gian còn lại) để sau** — tránh lan man, demo được ngay.
- **Engine hai giai đoạn tính điểm động (80/20), không dùng bảng cặp bài tự định nghĩa, không LLM trong MVP** — dễ mở rộng, minh bạch logic.
- **Không quy đổi tạ/reps tự động; dùng giá trị mặc định + kg = 99 placeholder** — trung thực với giới hạn dữ liệu; thêm sau.
- **Tách tag "kiểu chuyển động khác"** cho bài khác family — không trình bày như tương đương hoàn toàn.
- **Không yêu cầu chụp ảnh / khai báo thiết bị phòng gym** — user tự quan sát.
- **Bản sao Supabase mới (clone cũ)** — tránh đụng dữ liệu app thật; rest time lấy từ bản clone.
- **Ảnh minh họa RepDB Free + MuscleMap SVG; attribution RepDB bắt buộc** — tôn trọng giấy phép; MuscleMap MIT.
- **Màn chính giữ nguyên thiết kế với dữ liệu mẫu** — tạo bối cảnh demo, ít công vì chỉ hiển thị.
- **Test Set gồm 5 bài gốc kiểm thử: Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat** — mỗi bài nhờ 3–5 ứng viên đến từ bản clone; thiếu thì báo thiếu, không bịa; top 3 + "xem thêm".
- **Tên bài tập chỉ tiếng Anh** — nộp cho ban tổ chức ở Mỹ, bỏ tên tiếng Việt trong ngoặc.

## What We're Building

Trọn vẹn luồng: màn chính (mẫu) → Test Set ▶ → sheet kiểm máy từng bài → "đang bận" → **sheet hai lựa chọn (đề xuất / bài khác trước)** → danh sách thay thế (top 3 + xem thêm, tag, lý do, thiết bị, khác biệt) → chọn → thay vào vị trí cũ → màn tập → màn nghỉ → tiếp. Kèm theo: bộ metadata phân loại các bài Test Set + ứng viên, engine hai giai đoạn, trạng thái rỗng, câu hỏi fallback vùng cho bài không rõ region, ảnh RepDB + tô đỏ MuscleMap, attribution RepDB, khai báo minh bạch tài nguyên sẵn sàng cho submission.

## Deferred From the POC

- **Quy đổi tạ/reps/double progression tự động giữa các bài** — thiết kế kỹ thuật bên trong, thêm sau cuộc thi; MVP dùng giá trị mặc định + kg 99.
- **Workout Rescue** (điều chỉnh kế hoạch theo thời gian còn lại) — ý tưởng mở rộng sau feedback.
- **LLM trong Recommendation Engine** — tốt hơn nhưng không cần cho PoC.
- **Phân loại toàn bộ 100+ / 650 exercises** — chỉ 5 bài Test Set + ứng viên của chúng trước.
- **Màn chính hoạt động thật** (streak/sống, cập nhật lịch) — dữ liệu chỉ hiển thị.

## Possible Later Enhancements

- Quy đổi tạ/reps giữa các bài (cặp bài + hệ số hoặc mức tạ mục tiêu do người dùng nhập) — gắn sau cuộc thi, bổ sung vào app thật.
- Lọc gợi ý theo thiết bị user có ở phòng gym khi đó (nếu có một cách khai báo nhanh, trung thực).
- Mở rộng danh mục phân loại và kiểm thử thêm các vùng cơ khác ngoài bộ 5 bài kiểm thử.

## Non-Goals

- Không đăng nhập / đa người dùng.
- Không phát hiện máy tự động (camera/cảm biến).
- Không chỉnh sửa hoặc xoá dữ liệu Supabase Gym Tracker cũ.
- Không re-host ảnh Lyfta; **không tuyên bố tự nhận quyền sở hữu ảnh Lyfta**.
- Không tự bịa nội dung khai báo tài nguyên tái sử dụng — luôn hỏi learner xác nhận.
- Không dùng ảnh RepDB làm đầu vào cho mô hình AI tạo sinh; không tái phân phối RepDB như dataset/API.

## Open Questions

- **Trước 4-spec:** phương án dùng ảnh RepDB đúng điều khoản "không tái phân phối như dataset/API" — gộp những file ảnh được dùng vào trong app (in-app use, có attribution) là hợp lệ; chốt cách đóng gói/cấp phát ảnh ở bước spec.
- **Trước 4-spec:** xác nhận MuscleMap hỗ trợ tách region (ngực trên/giữa/dưới, vai trước/giữa/sau) hay cần fallback trung thực.
- **Có thể chờ đến build:** hành vi chi tiết của lựa chọn (2) "chọn bài khác trong giáo án để tập trước" — bài bị bận trình bày thế nào trong danh sách trong khi bị hoãn (đã ghi assumption trong `Features and Behavior > Buổi tập và thay bài`, cần learner xác nhận khi build).
