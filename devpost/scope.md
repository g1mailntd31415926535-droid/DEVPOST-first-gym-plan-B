---
doc: scope
status: approved
---

# Gym Plan B — Exercise Substitution

Một mini-app độc lập (dự án mới, tách khỏi app Gym Tracker cũ của learner): khi bài trong kế hoạch tập bị người khác chiếm máy, app hỏi *"máy trống không?"* → bấm "Đang bận – chọn bài khác" → engine tự động đề xuất các bài thay thế, ưu tiên giữ nguyên mục tiêu tập luyện. MVP chỉ tập trung vào **Exercise Substitution**; Workout Rescue (điều chỉnh kế hoạch theo thời gian còn lại) là ý tưởng mở rộng sau, **chưa làm**.

Learner **đã có sẵn một app track gym** (Gym Tracker) xây từ lâu, hay gặp lỗi — lần này **không sửa app cũ**, mà xây app mini riêng để giải quyết một bài toán phụ của người đi gym. Sau cuộc thi, dự án này sẽ được thêm vào app cũ.

## The Unique Kernel
Khoảnh khắc "bài bị chiếm máy" được giải quyết tại chỗ bằng một **Recommendation Engine tính điểm động theo metadata** (không phải bảng quan hệ cứng định nghĩa sẵn cho từng cặp bài): lọc cứng theo cùng nhóm cơ + **vùng cơ mục tiêu** (ngực trên chỉ khớp ngực trên…), rồi tính điểm tương đồng = chuyển động giống (80%) + kiểu bài compound/isolation (20%). Điểm là quy tắc nội bộ "độ giống chuyển động", **không phải** tuyên bố khoa học về tương đương hiệu quả. **Không tự quy đổi tạ/reps** giữa các bài — tính năng này learner sẽ thêm sau. Không đủ ứng viên → **báo rõ**, không cố đề xuất cho đủ.

## Who It's For
Chính learner — người đi gym, kế hoạch tập đã có sẵn. Ngày nay khi máy bị chiếm phải tự nghĩ bài tương đương; nay bấm "máy bận" là có phương án, tự đối chiếu thiết bị phòng gym để chọn.

## The Core Loop
Mở app → màn chính giữ nguyên thiết kế mẫu (streak, lịch chấm công, thống kê) bằng **dữ liệu mẫu**, chỉ hiển thị → thẻ giáo án **"Test Set"** → bấm ▶ → sheet từng bài *"Máy / vị trí tập này hiện có đang trống không?"* → máy trống: tập luôn; **máy bận** → danh sách gợi ý: **top 3 + nút xem thêm**, mỗi phương án hiển thị: tên, ảnh minh hoạ, nhóm cơ mục tiêu, thiết bị cần dùng, lý do được đề xuất (bài đầu có tag Recommend), khác biệt quan trọng so với bài gốc → user tự quan sát thiết bị đang trống ở phòng gym để chọn → bài mới thay vào vị trí cũ → màn tập tối giản (tick set) → đồng hồ nghỉ → tiếp tục.

## Inspiration & Identity
Trắng/xanh dương đậm, bo tròn, chữ đậm to — theo đúng ảnh mẫu learner cung cấp. Ảnh minh hoạ bài tập: **RepDB Free** (tôn trọng điều người dùng yêu cầu). Vùng cơ mục tiêu tô đỏ kiểu Lyfta bằng **SVG MuscleMap**; hai hình có thể đặt cạnh nhau nếu cần. Nếu thư viện không hỗ trợ tách vùng (ngực trên/giữa/dưới) → **không tô cả nhóm rồi tuyên bố là region**; dùng nhãn chữ + trình bày trung thực.

## Why This Matters to the Learner
Làm cho chính mình, gắn kết quả trở lại app thật sau cuộc thi. Cũng là dịp luyện xây dựng cùng AI theo quy trình plan-first.

## What "Working" Looks Like
Demo ~1 phút: mở app (màn chính đã hiển thị) → chọn Test Set → sheet bài 1 "máy trống không?" → "Đang bận – chọn bài khác" → danh sách top 3 có lý do và thiết bị → chọn bài trống phù hợp → màn tập bài mới → hoàn thành set → nghỉ đếm ngược → tập tiếp. 

## The POC Boundary
- Màn chính bằng dữ liệu mẫu (chỉ hiển thị), kế hoạch mẫu tên **Test Set** (các bài vai như thiết kế + Incline Barbell Press).
- **Bộ kiểm thử 5 bài gốc:** Incline Barbell Press, Flat Bench Press, Lateral Raise, Lat Pulldown, Squat.
- Data là **bản sao dữ liệu riêng cho Plan B: một Supabase mới, clone từ Supabase cũ** (đặc biệt rest time lấy từ bản sao này), để không đụng dữ liệu app Gym Tracker cũ. Tận dụng một phần dữ liệu bài tập từ Gym Tracker (tên, ID, sets/reps/rest…) + metadata mới (muscle_group, target_region, movement_family, movement_pattern, exercise_type, classify_status). AI có thể hỗ trợ phân loại; trường hợp không chắc được **đánh dấu needs_review** chờ learner xem. Supabase cũ **chỉ đọc, tuyệt đối không sửa/xoá**.
- Engine hai giai đoạn (lọc vùng → tính điểm), không LLM trong MVP; trọng số 80/20.
- Màn tập tối giản + đồng hồ nghỉ như thiết kế mẫu; số set/rep gợi ý theo **giá trị mặc định**, **kg = 99 (placeholder, mọi bài)** — quy đổi tạ thêm sau.
- Ảnh minh hoạ RepDB Free + MuscleMap; attribution RepDB visible; verify vùng cơ MuscleMap, có phương án fallback trung thực.
- Sử dụng AI hỗ trợ phân loại những bài của bộ kiểm thử; không phân loại cả 650 bài ngay.

## Later
Quy đổi tạ/reps giữa các bài, Workout Rescue, LLM trong engine, mở rộng phân loại toàn bộ 100+ bài, màn main động từ dữ liệu thật, nạp kế hoạch thật, sáng tạo các trường hợp khác.

## Explicitly Cut
- **Yêu cầu user chụp ảnh / khai báo thiết bị phòng gym** — user tự quan sát, chỉ bấm nút "máy bận".
- **Quy đổi tạ/reps tự động** — chưa đủ căn cứ, thêm sau.
- **Re-host ảnh Lyfta** lên Supabase — không có quyền phù hợp; chỉ danh dụng dữ liệu cũ như khai báo minh bạch.
- **Chỉnh sửa Supabase Gym Tracker cũ** — chỉ đọc.
- **Đăng nhập, phát hiện máy tự động (camera/cảm biến)**.

## Minh bạch tài nguyên (yêu cầu xuyên suốt, đặc biệt ở `6-ship`)
Gym Plan B sử dụng một phần dữ liệu từ dự án Gym Tracker trước đây (đã tồn tại trước hackathon). Phải: phân biệt rõ tài nguyên cũ vs. phát triển mới (engine + thuật toán là giá trị mới của hackathon); theo dõi chính xác những gì tái sử dụng; **không tuyên bố xây từ số 0**; không tự nhận quyền sở hữu ảnh Lyfta — chỉ dùng ảnh có quyền + ghi nguồn; đến bước `6-ship` **chủ động nhắc learner khai báo**, hỏi xác nhận chính xác danh mục tài nguyên được tái sử dụng trước khi viết, không tự viết hộ nội dung khai báo. Submission thể hiện: dùng một phần dữ liệu có sẵn để tiết kiệm thời gian xây Exercise Database; giá trị mới nằm ở Exercise Substitution + Recommendation Engine.
