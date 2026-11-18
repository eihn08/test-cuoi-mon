# 📊 Hệ Thống Làm Sạch, Kiểm Duyệt (Human-in-the-Loop) & Phân Tích Dữ Liệu BI

**Đồ án Cuối môn AI Agent — Chuyên viên BI & Hệ thống Xử lý Dữ liệu Thông minh trên Localhost**

---

## 🎯 Tổng quan Kiến trúc & Quy trình Luồng (Đúng theo Sơ đồ Thiết kế)

Hệ thống đóng vai trò là một **BI Studio kết hợp AI Agent và Con người kiểm duyệt (Human-in-the-Loop)**, vận hành theo đúng 5 bước và 2 cổng kiểm duyệt hình thoi:

1. **Bước 1: Nhập dữ liệu (Từ nhiều nguồn)**
   - Hỗ trợ tải lên file thực tế (`.csv`, `.xlsx`, `.xls`, `.json`, `.tsv`) hoặc dán trực tiếp từ Clipboard.
   - Tích hợp sẵn **3 Bộ dữ liệu thực tế có lỗi bẩn (Dirty Datasets)** để demo ngay:
     - 🛒 **Bán lẻ & TMĐT (`sample_retail_dirty.csv`)**: 32 đơn hàng chứa lỗi trùng mã đơn, thiếu tên/email/chiết khấu, ngày sai chuẩn (`2026-99-99`, `05/01/2026`), tiền tệ lẫn chữ (`"32,500,000 VNĐ"`), số lượng âm (`-5`), giá ngoại lai (`999,999,999`), khu vực viết lộn xộn (`ha noi`, `HÀ NỘI`, `HN`, `TPHCM`, `tp hcm`).
     - 👥 **Nhân sự & Lương thưởng (`sample_hr_dirty.csv`)**: Lỗi trùng nhân sự, phòng ban đồng nghĩa (`IT`, `cntt`, `Công nghệ thông tin`), lương âm, điểm KPI vượt thang 100.
     - 📣 **Chiến dịch Marketing Đa kênh (`sample_marketing_dirty.csv`)**: Lỗi tên kênh (`FB`, `fb_ads`, `Facebook Ads`), chi phí âm, doanh thu ngoại lai.
   - Tự động chấm **Điểm Chất lượng Dữ liệu Ban đầu (Data Health Score)** và tô màu từng ô lỗi trên bảng.

2. **Bước 2: Làm sạch dữ liệu (Chuẩn hóa, xử lý)**
   - **AI Data Cleaning Agent** (hỗ trợ Google Gemini API, OpenAI API và Local BI Specialist Agent) tư vấn chiến lược làm sạch.
   - **6 Quy tắc làm sạch cấu hình linh hoạt**:
     1. Khử trùng lặp bản ghi (Deduplication)
     2. Chuẩn hóa chuỗi & Từ điển đồng nghĩa (Text & Synonym Standardization)
     3. Bóc tách tiền tệ & Chuẩn hóa kiểu số (Currency & Numeric Parsing)
     4. Chuẩn hóa Ngày tháng về ISO `YYYY-MM-DD` & Nội suy ngày sai lịch
     5. Điền giá trị khuyết thiếu thông minh theo ngữ cảnh BI (Missing Value Imputation)
     6. Xử lý số âm vô lý & Cắt ngưỡng giá trị ngoại lai (Median Capping / IQR)
   - **Feature Engineering**: Tự động tính cột chỉ số phái sinh (`Net_Revenue`, `Total_Income`, `ROAS`).

3. **🛡️ Cổng Kiểm duyệt #1 (Hình thoi 1): Kiểm duyệt dữ liệu (Có hợp lệ?) — CON NGƯỜI TỰ LÀM**
   - Chuyên viên BI đối chiếu điểm chất lượng Trước & Sau làm sạch (VD: `48/100` ➔ `100/100`), xem nhật ký thay đổi từng ô (Cell-by-Cell Diff Log).
   - **Sửa tay trực tiếp (Inline Override)**: Nhấp đúp (Double-click) vào bất kỳ ô nào trên bảng để con người tự chỉnh sửa lại nếu muốn.
   - **Quyết định của Con người**:
     - ❌ **KHÔNG (Chưa hợp lệ)**: Hệ thống kích hoạt nhánh trả về màu đỏ **"Quay lại bước làm sạch dữ liệu"**, lưu lý do từ chối vào Audit Trail, hiển thị cảnh báo ở Bước 2 và tự động tinh chỉnh lại quy tắc.
     - ✅ **CÓ (Hợp lệ)**: Khóa dữ liệu sạch, ghi nhận chữ ký kiểm duyệt của Chuyên viên BI và mở khóa **Bước 4**.

4. **Bước 4: Phân tích dữ liệu (Tạo Insight)**
   - Tự động tổng hợp 4 thẻ **Executive KPIs** và vẽ **4 Biểu đồ BI trực quan** (Bar Chart, Donut Chart, Time-Series Trend, Bảng Xếp hạng Pareto 80/20).
   - **AI Insight Agent** tự động viết báo cáo gồm 4 phần: *Tóm tắt Điều hành, Phát hiện Cốt lõi (Key Findings), Phân tích Nguyên nhân (Root Cause), và Khuyến nghị Hành động (Actionable Recommendations)*.

5. **⭐ Cổng Đánh giá #2 (Hình thoi 2): Đánh giá kết quả (Đạt yêu cầu?) — CON NGƯỜI TỰ LÀM**
   - Chuyên viên BI chấm điểm chất lượng bản phân tích (thang 1-5 sao) và **biên tập trực tiếp nội dung Insight** ngay trên giao diện.
   - **Quyết định của Con người**:
     - ❌ **KHÔNG (Chưa đạt)**: Kích hoạt nhánh trả về **"Điều chỉnh & phân tích lại"**, đưa yêu cầu của Chuyên viên BI quay lại Bước 4 để AI Agent phân tích sâu hơn.
     - ✅ **CÓ (Đạt yêu cầu)**: Nghiệm thu kết quả phân tích và chuyển sang **Bước 5**.

6. **Bước 5: Xuất báo cáo (Đa dạng định dạng)**
   - 📗 **File Excel (`.xls` 3 Sheet & `.csv`)**: Gồm Sheet `1_Du_Lieu_Sach`, Sheet `2_Tong_Hop_KPI_BI`, và Sheet `3_Nhat_Ky_Kiem_Duyet`.
   - 📊 **Dashboard BI (`.html` độc lập & Trình chiếu/PDF)**: Xuất file Dashboard tương tác độc lập có đầy đủ biểu đồ và KPI.
   - 📘 **Báo cáo Word (`.doc` chuẩn doanh nghiệp)**: Xuất file Microsoft Word trình bày trang trọng có bảng đối chiếu chất lượng dữ liệu, bảng KPI, Insight và chữ ký nghiệm thu của Chuyên viên BI.

---

## 🚀 Cách Chạy Hệ Thống Trên Localhost

### Cách 1: Chạy trực tiếp bằng Script khởi động nhanh (Khuyên dùng)
```bash
./start_localhost.sh
```
Sau đó mở trình duyệt tại địa chỉ: **`http://localhost:8080`**

### Cách 2: Chạy bằng Python FastAPI (Khi đã cài đặt môi trường Python)
```bash
pip install -r requirements.txt
python3 app.py
```

---

## 📁 Cấu trúc Thư mục Dự án

- [app.py](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/app.py): Backend FastAPI + Pandas + AI Agent Proxy (Python)
- [server.rb](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/server.rb): Localhost Server tích hợp sẵn cho macOS (chạy ngay không cần cài đặt phụ thuộc ngoài)
- [static/index.html](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/static/index.html): Giao diện Web App BI Studio & Sơ đồ Quy trình Tương tác
- [static/styles.css](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/static/styles.css): Hệ thống giao diện chuẩn BI Dashboard hiện đại
- [static/app.js](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/static/app.js): Engine Làm sạch Dữ liệu, Kiểm duyệt Human-in-the-Loop, Biểu đồ & Xuất Báo cáo (Excel/Word/Dashboard)
- [data/sample_retail_dirty.csv](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/data/sample_retail_dirty.csv): Bộ dữ liệu mẫu Bán lẻ & TMĐT
- [data/sample_hr_dirty.csv](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/data/sample_hr_dirty.csv): Bộ dữ liệu mẫu Nhân sự & Lương thưởng
- [data/sample_marketing_dirty.csv](file:///Users/nguyenphuongyennhi/CUOI%20MON%20AI%20AGENT/data/sample_marketing_dirty.csv): Bộ dữ liệu mẫu Chiến dịch Marketing Đa kênh
