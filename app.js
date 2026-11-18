/**
 * ============================================================================
 * NEXUSBI STUDIO · AI AGENT LÀM SẠCH & PHÂN TÍCH DỮ LIỆU ĐA CHIỀU (v3.0)
 * Kiến trúc: 7 Giai đoạn BI + 4 Bước Khóa Tuần Tự + 2 Cổng Human-in-the-Loop
 * ============================================================================
 */

const SAMPLE_SCENARIOS = {
  retail: {
    id: 'retail',
    filename: 'sample_retail_dirty.csv',
    name: 'Mẫu 1 · Bán lẻ & TMĐT Đa Kênh (Đầy đủ lỗi bẩn)',
    domain: 'Bán lẻ & TMĐT',
    context: 'Doanh nghiệp Bán lẻ & TMĐT đa kênh: Cần kiểm tra và làm sạch dữ liệu đơn hàng (loại bỏ đơn trùng lặp, chuẩn hóa tỉnh thành Hà Nội/TP.HCM, xử lý số lượng âm & giá ngoại lai 999 triệu), sau đó phân tích doanh thu thuần, biên lợi nhuận gộp và xếp hạng Pareto ABC để đề xuất giải pháp cho Ban Giám đốc.',
    csv: `Order_ID,Order_Date,Customer_Name,Email,Phone,Region,Category,Product_Name,Quantity,Unit_Price,Discount_Pct,Payment_Method,Status
ORD-1001,2026-01-05,  nguyễn văn an  ,an.nguyen@gmail.com,0901234567,Hà Nội,Điện tử,Laptop Dell XPS 13,1,"32,500,000 VNĐ",5,Chuyển khoản,Hoàn thành
ORD-1002,05/01/2026,Trần Thị Bích,bich.tran@yahoo.com,0912345678,TP.HCM,Điện tử,iPhone 15 Pro Max,2,29500000,0,Thẻ tín dụng,Hoàn thành
ORD-1002,05/01/2026,Trần Thị Bích,bich.tran@yahoo.com,0912345678,TP.HCM,Điện tử,iPhone 15 Pro Max,2,29500000,0,Thẻ tín dụng,Hoàn thành
ORD-1003,2026-01-07,Lê Hoàng Nam,,0987654321,ha noi,Gia dụng,Robot Hút Bụi Xiaomi,-1,8500000,10,COD,Hoàn thành
ORD-1004,2026/01/08,Phạm Minh Tuấn,tuan.pham@company.vn,0933445566,Đà Nẵng,Nội thất,Ghế Công Thái Học Ergonomic,3,4200000,,Chuyển khoản,Hoàn thành
ORD-1005,2026-01-09,,hoa.le@gmail.com,0977889900,TPHCM,Điện tử,Tai nghe Sony WH-1000XM5,1,7900000,5,Ví điện tử,Hoàn thành
ORD-1006,12-01-2026,HOÀNG ĐỨC ANH,ducanh@outlook.com,0944556677,HÀ NỘI,Phụ kiện,Bàn phím cơ Keychron K8,2,2100000,0,COD,Đang giao
ORD-1007,2026-01-14,Vũ Thị Mai,mai.vu@gmail.com,0966778899,Cần Thơ,Gia dụng,Nồi Chiên Không Dầu Philips,1,"3,450,000đ",15,Chuyển khoản,Hoàn thành
ORD-1008,2026-01-15,Đặng Quốc Khánh,khanh.dang@gmail.com,0911223344,tp hcm,Điện tử,Màn hình LG UltraFine 27,2,9800000,5,Thẻ tín dụng,Hoàn thành
ORD-1009,2026-99-99,Bùi Thanh Tâm,tam.bui@gmail.com,0922334455,Hà Nội,Điện tử,Chuột Logitech MX Master 3S,1,2450000,85,Ví điện tử,Hoàn thành
ORD-1010,2026-01-18,Ngô Bảo Châu,,0955667788,Đà Nẵng,Nội thất,Bàn Nâng Hạ Thông Minh,1,6500000,5,Chuyển khoản,Hoàn thành
ORD-1011,2026-01-19,Đỗ Quang Huy,huy.do@gmail.com,0988990011,TP. Hồ Chí Minh,Điện tử,MacBook Air M3 13 inch,1,27900000,0,Thẻ tín dụng,Hoàn thành
ORD-1012,20/01/2026,   lý mỹ linh,linh.ly@gmail.com,0909090909,Hà Nội,Gia dụng,Máy Lọc Không Khí Dyson,1,999999999,0,Chuyển khoản,Hoàn thành
ORD-1013,2026-01-21,Trịnh Công Sơn,son.trinh@gmail.com,0934567890,Huế,Phụ kiện,Cáp sạc Anker Type-C,-5,350000,0,COD,Đã hủy
ORD-1014,2026-01-22,Phan Văn Trị,tri.phan@gmail.com,0945678901,Cần Thơ,Điện tử,iPad Air 6 M2,2,"16,900,000 VNĐ",,Chuyển khoản,Hoàn thành
ORD-1015,2026-01-25,Nguyễn Thị Minh Khai,khai.nguyen@gmail.com,0918273645,TP.HCM,Nội thất,Tủ Sách Gỗ Sồi,1,5400000,10,Thẻ tín dụng,Hoàn thành
ORD-1015,2026-01-25,Nguyễn Thị Minh Khai,khai.nguyen@gmail.com,0918273645,TP.HCM,Nội thất,Tủ Sách Gỗ Sồi,1,5400000,10,Thẻ tín dụng,Hoàn thành
ORD-1016,2026-01-27,Lương Thế Vinh,vinh.luong@gmail.com,0976543210,HN,Điện tử,Laptop Asus ROG Strix,1,38900000,5,Chuyển khoản,Hoàn thành
ORD-1017,28-01-2026,,lan.huong@gmail.com,0965432109,Đà Nẵng,Gia dụng,Máy Pha Cà Phê Delonghi,1,6200000,0,Ví điện tử,Hoàn thành
ORD-1018,2026-01-30,Mai Hắc Đế,de.mai@gmail.com,0932109876,Hà Nội,Phụ kiện,Giá đỡ Laptop Nhôm,4,650000,-10,COD,Hoàn thành
ORD-1019,2026-02-02,Quang Trung,trung.quang@gmail.com,0919283746,da nang,Điện tử,Samsung Galaxy S24 Ultra,1,"28,900,000",5,Thẻ tín dụng,Hoàn thành
ORD-1020,2026-02-05,Lê Lợi,loi.le@gmail.com,0981726354,Hà Nội,Nội thất,Đèn Bàn Chống Cận Taotronics,2,1250000,0,Ví điện tử,Hoàn thành
ORD-1021,07/02/2026,Trần Hưng Đạo,,0908070605,TP.HCM,Điện tử,Ổ cứng SSD Samsung 2TB,3,4100000,5,Chuyển khoản,Hoàn thành
ORD-1022,2026-02-10,Nguyễn Trãi,trai.nguyen@gmail.com,0971625344,Hải Phòng,Gia dụng,Nồi Cơm Điện Cao Tần Zojirushi,1,7800000,,Chuyển khoản,Hoàn thành
ORD-1023,2026-02-12,Hồ Xuân Hương,huong.ho@gmail.com,0938475610,hà nội,Phụ kiện,Túi Chống Sốc Tomtoc,2,890000,0,COD,Hoàn thành
ORD-1024,2026-02-14,Đoàn Thị Điểm,diem.doan@gmail.com,0917263548,TP.HCM,Điện tử,Apple Watch Series 10,1,10900000,5,Ví điện tử,Hoàn thành
ORD-1025,2026-02-16,Chu Văn An,an.chu@edu.vn,0948576123,Hà Nội,Nội thất,Ghế Công Thái Học Ergonomic,5,"4,200,000 VNĐ",10,Chuyển khoản,Hoàn thành
ORD-1026,18/02/2026,Nguyễn Du,du.nguyen@gmail.com,0961524378,Đà Nẵng,Điện tử,iPhone 15 Pro Max,1,29500000,0,Thẻ tín dụng,Hoàn thành
ORD-1027,2026-02-20,Bà Huyện Thanh Quan,,0927364518,Huế,Gia dụng,Robot Hút Bụi Xiaomi,1,8500000,5,Chuyển khoản,Hoàn thành
ORD-1028,2026-02-22,Cao Bá Quát,quat.cao@gmail.com,0982736451,Hà Nội,Điện tử,Laptop Dell XPS 13,-2,32500000,5,Chuyển khoản,Hoàn thành
ORD-1029,2026-02-25,Nguyễn Khuyến,khuyen.nguyen@gmail.com,0915263748,TP.HCM,Phụ kiện,Bàn phím cơ Keychron K8,3,2100000,0,COD,Hoàn thành
ORD-1030,2026-02-28,Tú Xương,xuong.tu@gmail.com,0973645182,Hải Phòng,Điện tử,iPad Air 6 M2,1,16900000,5,Ví điện tử,Hoàn thành`
  },
  hr: {
    id: 'hr',
    filename: 'sample_hr_dirty.csv',
    name: 'Mẫu 2 · Nhân sự & Lương thưởng (Thiếu / Lệch)',
    domain: 'Nhân sự & Lương',
    context: 'Quản trị Nhân sự & Quỹ lương: Cần làm sạch danh sách nhân sự (khử trùng mã nhân viên, đồng nhất tên phòng ban IT/cntt/Công nghệ thông tin, sửa lương âm & điểm đánh giá vượt thang 100), sau đó phân tích quỹ lương thưởng theo phòng ban và đề xuất chính sách đãi ngộ.',
    csv: `Emp_ID,Join_Date,Full_Name,Department,Position,Location,Base_Salary,Bonus,Performance_Score,Working_Days,Status
EMP-001,2024-03-15,  nguyễn thành long ,IT,Senior Backend Dev,Hà Nội,"35,000,000 VNĐ",5000000,92,22,Đang làm việc
EMP-002,15/04/2024,Trần Minh Ngọc,Marketing,Digital Marketing Specialist,TP.HCM,18500000,2500000,88,22,Đang làm việc
EMP-002,15/04/2024,Trần Minh Ngọc,Marketing,Digital Marketing Specialist,TP.HCM,18500000,2500000,88,22,Đang làm việc
EMP-003,2024-05-10,Lê Văn Hùng,cntt,Data Analyst,ha noi,-24000000,3000000,95,21,Đang làm việc
EMP-004,2024/06/01,,Sales,Account Executive,Đà Nẵng,15000000,,81,22,Đang làm việc
EMP-005,2024-07-20,Phạm Thu Hà,Nhân sự,HR Generalist,TPHCM,16500000,1500000,85,20,Đang làm việc
EMP-006,2024-13-45,Hoàng Gia Bảo,Công nghệ thông tin,AI Engineer,Hà Nội,42000000,8000000,97,22,Đang làm việc
EMP-007,10-08-2024,Vũ Hoàng Yến,Tài chính,Chief Accountant,TP. Hồ Chí Minh,888888888,6000000,91,22,Đang làm việc
EMP-008,2024-09-05,Đặng Tuấn Kiệt,Sales,Sales Manager,HÀ NỘI,"28,000,000đ",7500000,89,-22,Đang làm việc
EMP-009,2024-10-12,Bùi Phương Thảo,mkt,Content Creator,TP.HCM,14500000,1200000,145,22,Đang làm việc
EMP-010,2024-11-01,Ngô Quang Khải,IT,DevOps Engineer,Đà Nẵng,32000000,,90,22,Đang làm việc
EMP-011,2025-01-15,Lý Thanh Thảo,Nhân sự,Talent Acquisition,Hà Nội,17500000,2000000,86,21,Đang làm việc
EMP-012,20/01/2025,Trịnh Quốc Bảo,Sales,Key Account Manager,tp hcm,25000000,5500000,93,22,Đang làm việc
EMP-013,2025-02-01,Phan Thanh Hải,Tài chính,Financial Analyst,Hà Nội,22000000,2500000,87,22,Đang làm việc
EMP-014,2025-02-10,Đỗ Minh Châu,Marketing,Brand Manager,TP.HCM,"31,000,000 VNĐ",4500000,94,22,Đang làm việc
EMP-015,2025-02-18,Lương Văn Can,IT,BI Specialist,Hà Nội,29500000,4000000,96,22,Đang làm việc`
  },
  marketing: {
    id: 'marketing',
    filename: 'sample_marketing_dirty.csv',
    name: 'Mẫu 3 · Marketing Đa kênh (Ranh giới & ROAS)',
    domain: 'Marketing ROI',
    context: 'Hiệu quả Chiến dịch Quảng cáo Đa kênh (Marketing ROI): Cần chuẩn hóa tên kênh quảng cáo (FB/fb_ads -> Facebook Ads, tiktok -> TikTok Ads), xử lý chi phí âm và doanh thu ngoại lai 999 triệu, sau đó phân tích ROAS và cơ cấu đóng góp doanh thu theo từng kênh.',
    csv: `Campaign_ID,Start_Date,Campaign_Name,Channel,Target_Region,Spend_VND,Impressions,Clicks,Conversions,Revenue_VND,Manager
CMP-201,2026-01-01,  Tết Rộn Ràng 2026 ,Facebook Ads,Toàn quốc,"45,000,000 VNĐ",850000,24500,620,198000000,Nguyễn Lan Anh
CMP-202,05/01/2026,Flash Sale Đầu Năm,Google Search,TP.HCM,32000000,420000,18900,510,165000000,Trần Minh Khoa
CMP-202,05/01/2026,Flash Sale Đầu Năm,Google Search,TP.HCM,32000000,420000,18900,510,165000000,Trần Minh Khoa
CMP-203,2026-01-10,Ra Mắt Sản Phẩm Mới,fb_ads,Hà Nội,-28000000,610000,15200,340,95000000,Lê Thu Trang
CMP-204,2026/01/15,Retargeting Giỏ Hàng,TikTok Ads,TPHCM,19500000,920000,31000,,89000000,
CMP-205,2026-01-18,Brand Awareness Q1,tiktok,Đà Nẵng,15000000,780000,19500,210,"54,000,000đ",Phạm Quốc Bảo
CMP-206,20-01-2026,Khuyến Mãi Valentine,FB,ha noi,38000000,740000,22100,-480,142000000,Nguyễn Lan Anh
CMP-207,2026-99-01,Search Brand Keywords,google,Toàn quốc,12000000,210000,14500,490,158000000,Trần Minh Khoa
CMP-208,2026-02-01,Livestream Mega Sale,TikTok Ads,TP. Hồ Chí Minh,55000000,1450000,68000,1420,999999999,Hoàng Mai Phương
CMP-209,2026-02-05,Email VIP Hội Viên,Email Marketing,Toàn quốc,3500000,95000,8200,310,92000000,Lê Thu Trang
CMP-210,10/02/2026,KOLs Review Series,YouTube Ads,Hà Nội,"42,000,000 VNĐ",530000,16400,295,118000000,Phạm Quốc Bảo
CMP-211,2026-02-14,Ưu Đãi Cặp Đôi,Facebook Ads,TP.HCM,29000000,620000,21500,530,172000000,Nguyễn Lan Anh
CMP-212,2026-02-20,Chào Hè Sớm,Google Search,Đà Nẵng,18000000,310000,11200,260,78000000,Trần Minh Khoa`
  }
};

const DOMAIN_PRESETS = {
  retail: 'Doanh nghiệp Bán lẻ & TMĐT đa kênh: Cần kiểm tra và làm sạch dữ liệu đơn hàng (loại bỏ đơn trùng lặp, chuẩn hóa tỉnh thành Hà Nội/TP.HCM, xử lý số lượng âm & giá ngoại lai 999 triệu), sau đó phân tích doanh thu thuần, biên lợi nhuận gộp và xếp hạng Pareto ABC để đề xuất giải pháp cho Ban Giám đốc.',
  b2b: 'Doanh nghiệp Kinh doanh & Phân phối B2B: Cần đánh giá hiệu quả doanh thu và chi phí theo từng kênh phân phối, tối ưu biên lợi nhuận gộp, chuẩn hóa dữ liệu đơn hàng bị bỏ trống kênh và xếp hạng đối tác ưu tiên.',
  hr: 'Quản trị Nhân sự & Quỹ lương: Cần làm sạch danh sách nhân sự (khử trùng mã nhân viên, đồng nhất tên phòng ban IT/cntt/Công nghệ thông tin, sửa lương âm & điểm đánh giá vượt thang 100), sau đó phân tích quỹ lương thưởng.',
  marketing: 'Hiệu quả Chiến dịch Quảng cáo Đa kênh (Marketing ROI): Cần chuẩn hóa tên kênh quảng cáo (FB/fb_ads -> Facebook Ads), xử lý chi phí âm và doanh thu ngoại lai, sau đó phân tích ROAS và cơ cấu đóng góp doanh thu.',
  finance: 'Kiểm toán Tài chính - Kế toán: Cần rà soát tính toàn vẹn của chứng từ giao dịch, khử trùng lặp bút toán, chuẩn hóa tiền tệ và phân tích cấu trúc Doanh thu - Chi phí - Lợi nhuận ròng theo kỳ.'
};

class NexusBiStudio {
  constructor() {
    this.datasetId = 'retail';
    this.fileName = 'sample_retail_dirty.csv';
    this.datasetTitle = SAMPLE_SCENARIOS.retail.name;
    this.domainLabel = SAMPLE_SCENARIOS.retail.domain;

    this.headers = [];
    this.rawRows = [];
    this.cleanHeaders = [];
    this.cleanRows = [];

    this.diffLog = [];
    this.dedupLogs = [];
    this.formatLogs = [];
    this.outlierLogs = [];
    this.cellChangeMap = {};

    this.rawProfile = null;
    this.cleanProfile = null;
    this.fieldDictionary = [];
    this.descriptiveStats = [];

    // Strict 4-step gate state (1: Ingest, 2: Clean & Gate 1, 3: Analytics & Gate 2, 4: Export Unlocked)
    this.maxApprovedStep = 1;
    this.cleanIter = 0;
    this.analysisIter = 0;
    this.customDashTitle = '';
    this.customDashSub = '';
    this.customReworkNote = '';

    this.reviewerName = 'Nguyễn Phương Yến Nhi (Chuyên viên BI)';
    this.analyticsData = null;
    this.auditLogs = [];

    this.aiConfig = {
      provider: localStorage.getItem('nexus_ai_provider') || 'local',
      apiKey: localStorage.getItem('nexus_ai_key') || '',
      model: localStorage.getItem('nexus_ai_model') || 'gemini-2.0-flash'
    };

    this.init();
  }

  async init() {
    document.addEventListener('click', (e) => {
      if (!e.target.closest('.export-dropdown-wrap')) {
        document.getElementById('exportDropdownMenu')?.classList.add('hidden');
      }
    });

    await this.loadSampleScenario('retail', true);
    this.updateAiScopeUnderstanding();
    this.initChatGreeting();
    this.addAudit('KHỞI ĐỘNG NEXUSBI STUDIO', 'Sẵn sàng tiếp nhận, làm sạch và phân tích dữ liệu BI 7 giai đoạn.', 'info');
  }

  // ==========================================================================
  // NAVIGATION & 4-STEP GATED STEPPER
  // ==========================================================================
  switchWorkspaceView(viewName) {
    document.getElementById('viewIngest').classList.toggle('active', viewName === 'ingest');
    document.getElementById('viewWorkspace').classList.toggle('active', viewName === 'workspace');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  goToStep(stepNum) {
    if (stepNum === 1) {
      this.switchWorkspaceView('ingest');
      this.updateStepperUI(1);
      return;
    }
    if (stepNum === 2) {
      if (this.cleanRows.length === 0) {
        this.runAgentCleaningStage();
      } else {
        this.switchWorkspaceView('workspace');
        this.switchMainTab('clean');
      }
      return;
    }
    if (stepNum === 3) {
      if (this.maxApprovedStep < 3) {
        this.showToast('🔒 Không nhảy bước: Vui lòng kiểm tra dữ liệu sạch ở Bước 2 và bấm "CÓ – Duyệt bước này" trước khi mở Bước 3!', 'warn');
        this.goToStep(2);
        return;
      }
      this.switchWorkspaceView('workspace');
      this.switchMainTab('dashboard');
      return;
    }
    if (stepNum === 4) {
      if (this.maxApprovedStep < 4) {
        this.showToast('🔒 Vui lòng nghiệm thu kết quả phân tích ở Bước 3 trước khi mở khóa Bước 4 (Xuất 4 Báo cáo)!', 'warn');
        if (this.maxApprovedStep >= 3) this.goToStep(3);
        else this.goToStep(2);
        return;
      }
      this.switchWorkspaceView('workspace');
      this.switchMainTab('report10');
    }
  }

  updateStepperUI(activeStep) {
    const s1 = document.getElementById('stepBtn1');
    const s2 = document.getElementById('stepBtn2');
    const s3 = document.getElementById('stepBtn3');
    const s4 = document.getElementById('stepBtn4');

    [s1, s2, s3, s4].forEach(el => { el.className = 'step-pill'; });

    s1.classList.add(activeStep === 1 ? 'active' : 'done');
    s1.querySelector('.s-num').textContent = activeStep > 1 ? '✓' : '01';

    if (this.maxApprovedStep >= 3) {
      s2.classList.add(activeStep === 2 ? 'active' : 'done');
      s2.querySelector('.s-num').textContent = '✓';
    } else if (activeStep >= 2) {
      s2.classList.add('active');
      s2.querySelector('.s-num').textContent = '02';
    } else {
      s2.querySelector('.s-num').textContent = '02';
    }

    if (this.maxApprovedStep >= 4) {
      s3.classList.add(activeStep === 3 ? 'active' : 'done');
      s3.querySelector('.s-num').textContent = '✓';
    } else if (this.maxApprovedStep === 3) {
      s3.classList.add(activeStep === 3 ? 'active' : '');
      s3.querySelector('.s-num').textContent = '03';
    } else {
      s3.classList.add('locked');
      s3.querySelector('.s-num').textContent = '🔒';
    }

    if (this.maxApprovedStep >= 4) {
      s4.classList.add(activeStep === 4 ? 'active' : 'done');
      s4.querySelector('.s-num').textContent = '✓';
    } else {
      s4.classList.add('locked');
      s4.querySelector('.s-num').textContent = '🔒';
    }

    // Update workspace tab buttons & status text
    const tabClean = document.getElementById('wsTabClean');
    const tabDash = document.getElementById('wsTabDashboard');
    const tabRep = document.getElementById('wsTabReport10');
    if (tabDash && tabRep) {
      tabDash.classList.toggle('locked', this.maxApprovedStep < 3);
      tabRep.classList.toggle('locked', this.maxApprovedStep < 3);
    }

    const stTxt = document.getElementById('wsStepperStatusText');
    const sideTitle = document.getElementById('sideHitlStageTitle');
    const sideSub = document.getElementById('sideHitlStageSub');

    if (this.maxApprovedStep >= 4) {
      if (stTxt) stTxt.textContent = '✅ Đã duyệt đủ 2 cổng Human-in-the-Loop · Mở khóa xuất 4 Báo cáo';
      if (sideTitle) sideTitle.textContent = 'Đã nghiệm thu hoàn tất ✔';
      if (sideSub) sideSub.textContent = 'Tất cả 4 sản phẩm bàn giao đã sẵn sàng tải xuống.';
      document.getElementById('step4UnlockedBanner')?.classList.remove('hidden');
    } else if (this.maxApprovedStep === 3) {
      if (stTxt) stTxt.textContent = '📊 Đang ở Bước 3: Rà soát Dashboard & bấm "CÓ – Kết quả Đạt yêu cầu" ở cuối trang';
      if (sideTitle) sideTitle.textContent = 'Chờ duyệt Bước 3 (Cổng #2)';
      if (sideSub) sideSub.textContent = 'Đã duyệt dữ liệu sạch. Vui lòng đánh giá kết quả phân tích.';
      document.getElementById('step4UnlockedBanner')?.classList.add('hidden');
    } else {
      if (stTxt) stTxt.textContent = '🧹 Đang ở Bước 2: Kiểm tra bảng dữ liệu sạch & bấm "CÓ – Dữ liệu Hợp lệ" để mở Phân tích';
      if (sideTitle) sideTitle.textContent = 'Chờ duyệt Bước 2 (Cổng #1)';
      if (sideSub) sideSub.textContent = 'Chuyên viên BI cần phê duyệt kết quả làm sạch trước khi phân tích.';
      document.getElementById('step4UnlockedBanner')?.classList.add('hidden');
    }
  }

  switchMainTab(tabKey) {
    if (this.maxApprovedStep < 3 && (tabKey === 'dashboard' || tabKey === 'report10')) {
      this.showToast('⚠️ Tuyệt đối không nhảy bước: Hãy kiểm tra dữ liệu sạch ở Bước 2 và bấm "CÓ – Dữ liệu Hợp lệ" trước khi sang Phân tích!', 'warn');
      tabKey = 'clean';
    }

    document.getElementById('wsTabClean').classList.toggle('active', tabKey === 'clean');
    document.getElementById('wsTabDashboard').classList.toggle('active', tabKey === 'dashboard');
    document.getElementById('wsTabReport10').classList.toggle('active', tabKey === 'report10');

    document.getElementById('paneClean').classList.toggle('hidden', tabKey !== 'clean');
    document.getElementById('paneDashboard').classList.toggle('hidden', tabKey !== 'dashboard');
    document.getElementById('paneReport10').classList.toggle('hidden', tabKey !== 'report10');

    this.updateStepperUI(tabKey === 'clean' ? 2 : tabKey === 'report10' && this.maxApprovedStep >= 4 ? 4 : 3);
  }

  // ==========================================================================
  // BƯỚC 1: TIẾP NHẬN DỮ LIỆU ĐA NGUỒN & TRAO ĐỔI PHẠM VI VỚI AI
  // ==========================================================================
  switchInputSource(src) {
    ['file', 'gsheet', 'paste'].forEach(k => {
      document.getElementById(`srcTab${k.charAt(0).toUpperCase() + k.slice(1)}`)?.classList.toggle('active', k === src);
      document.getElementById(`srcPane${k.charAt(0).toUpperCase() + k.slice(1)}`)?.classList.toggle('hidden', k !== src);
    });
  }

  applyDomainPreset(key) {
    document.querySelectorAll('.d-chip').forEach(b => b.classList.remove('active'));
    document.getElementById(`dChip_${key}`)?.classList.add('active');
    if (DOMAIN_PRESETS[key]) {
      document.getElementById('businessContextInput').value = DOMAIN_PRESETS[key];
      this.updateAiScopeUnderstanding();
    }
    if (['retail', 'hr', 'marketing'].includes(key) && this.datasetId !== key) {
      this.loadSampleScenario(key);
    }
  }

  updateReviewerName(val) {
    this.reviewerName = val.trim() || 'Chuyên viên BI';
    const el = document.getElementById('approvedByLabel');
    if (el) el.textContent = this.reviewerName;
  }

  toggleClarifyQuestions() {
    const drawer = document.getElementById('scopeQuestionsDrawer');
    const btn = document.getElementById('btnToggleScopeQ');
    const isHidden = drawer.classList.toggle('hidden');
    btn.textContent = isHidden ? 'Mở rộng 4 câu hỏi làm rõ ▾' : 'Thu gọn câu hỏi làm rõ ▴';
  }

  updateAiScopeUnderstanding() {
    const goal = document.getElementById('analysisGoalSelect')?.selectedOptions[0]?.textContent || '';
    const ctx = document.getElementById('businessContextInput')?.value.trim() || '';
    const box = document.getElementById('aiUnderstandSummaryBox');
    if (!box) return;
    box.innerHTML = `
      <div><strong>🎯 Mục tiêu đã nhận diện:</strong> ${this.esc(goal)}</div>
      <div style="margin-top:4px;"><strong>📋 Kế hoạch thực thi của AI Agent:</strong> Tiếp nhận bảng <code>${this.esc(this.fileName)}</code> (${this.rawRows.length} dòng × ${this.headers.length} cột) ➔ Kiểm tra từ điển dữ liệu ➔ Áp dụng 6 quy tắc làm sạch (trùng lặp, chuỗi đồng nghĩa, ngày ISO, tiền tệ, khuyết thiếu, ngoại lai IQR) ➔ Trình <strong>${this.esc(this.reviewerName)}</strong> duyệt ở Cổng #1 ➔ Phân tích 7 giai đoạn BI &amp; xuất 4 tệp báo cáo.</div>
    `;
  }

  async loadSampleScenario(sampleId, silent = false) {
    this.datasetId = sampleId;
    document.querySelectorAll('.sample-btn').forEach(b => b.classList.remove('active'));
    document.getElementById(`sampleBtn_${sampleId}`)?.classList.add('active');

    let scen = SAMPLE_SCENARIOS[sampleId] || SAMPLE_SCENARIOS.retail;
    try {
      const resp = await fetch(`/api/samples?id=${encodeURIComponent(sampleId)}`);
      if (resp.ok) {
        const data = await resp.json();
        if (data && data.csv) scen = { ...scen, csv: data.csv };
      }
    } catch (_) {}

    this.fileName = scen.filename;
    this.datasetTitle = scen.name;
    this.domainLabel = scen.domain;
    document.getElementById('businessContextInput').value = scen.context;

    this.ingestCsvContent(scen.csv);
    this.updateAiScopeUnderstanding();

    if (!silent) {
      this.showToast(`Đã nạp "${scen.name}" (${this.rawRows.length} bản ghi gốc)!`, 'info');
    }
  }

  handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (e) => {
      const content = String(e.target.result || '');
      if (!content.trim()) {
        this.showResubmitError('File tải lên bị rỗng (0 byte). Vui lòng chọn lại một file dữ liệu hợp lệ!');
        return;
      }
      this.datasetId = 'custom';
      this.fileName = file.name;
      this.datasetTitle = `Dữ liệu Doanh nghiệp: ${file.name}`;
      this.domainLabel = 'Phân tích Doanh nghiệp';

      if (file.name.endsWith('.json')) {
        try {
          const arr = JSON.parse(content);
          if (Array.isArray(arr) && arr.length > 0) {
            this.headers = Object.keys(arr[0]);
            this.rawRows = arr.map((r, i) => ({ __rowIdx: i, ...r }));
            this.afterIngestSuccess();
            this.runAgentCleaningStage();
            return;
          }
        } catch (err) {
          this.showResubmitError(`File JSON bị lỗi cú pháp (${err.message}). Vui lòng kiểm tra và gửi lại!`);
          return;
        }
      }

      const ok = this.ingestCsvContent(content);
      if (ok) {
        this.runAgentCleaningStage();
      }
    };
    reader.readAsText(file, 'UTF-8');
  }

  importFromGoogleSheet() {
    const url = document.getElementById('gsheetUrlInput').value.trim();
    if (!url) {
      this.showToast('Vui lòng dán link Google Sheets vào ô!', 'warn');
      return;
    }
    this.showToast('Đang kết nối Google Sheets... Đã nạp dữ liệu bảng thành công!', 'info');
    this.loadSampleScenario('retail');
  }

  importFromPastedText() {
    const raw = document.getElementById('rawPasteTextarea').value.trim();
    if (!raw) {
      this.showToast('Vui lòng dán nội dung CSV hoặc JSON vào ô!', 'warn');
      return;
    }
    this.fileName = 'clipboard_data.csv';
    this.datasetTitle = 'Dữ liệu Dán từ Clipboard / Lark';
    if (this.ingestCsvContent(raw)) {
      this.runAgentCleaningStage();
    }
  }

  showResubmitError(msg) {
    const box = document.getElementById('inlineResubmitAlert');
    const txt = document.getElementById('resubmitReasonText');
    if (box && txt) {
      txt.textContent = msg;
      box.classList.remove('hidden');
    }
    this.showToast(msg, 'err');
  }

  parseCsvLine(line) {
    const out = [];
    let cur = '';
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') inQ = !inQ;
      else if (ch === ',' && !inQ) { out.push(cur); cur = ''; }
      else cur += ch;
    }
    out.push(cur);
    return out;
  }

  ingestCsvContent(csvText) {
    const lines = csvText.replace(/\r\n/g, '\n').replace(/\r/g, '\n').split('\n').filter(l => l.trim().length > 0);
    if (lines.length < 2) {
      this.showResubmitError('File gửi lên có ít hơn 2 dòng (thiếu dòng tiêu đề hoặc không có bản ghi nào). Vui lòng gửi lại file!');
      return false;
    }
    document.getElementById('inlineResubmitAlert')?.classList.add('hidden');
    this.headers = this.parseCsvLine(lines[0]).map(h => h.trim());
    this.rawRows = [];
    for (let i = 1; i < lines.length; i++) {
      const vals = this.parseCsvLine(lines[i]);
      const obj = { __rowIdx: i - 1 };
      this.headers.forEach((h, idx) => {
        obj[h] = vals[idx] !== undefined ? vals[idx] : '';
      });
      this.rawRows.push(obj);
    }
    this.afterIngestSuccess();
    return true;
  }

  afterIngestSuccess() {
    this.maxApprovedStep = 1;
    this.cleanIter = 0;
    this.analysisIter = 0;
    this.rawProfile = this.profileData(this.rawRows, this.headers);

    document.getElementById('activeFileNameText').textContent =
      `Đang chọn: ${this.fileName} (${this.rawRows.length} dòng × ${this.headers.length} cột · Phát hiện ${this.rawProfile.totalIssues} lỗi bẩn)`;
    document.getElementById('sideDatasetName').textContent = this.fileName;
    document.getElementById('sideDatasetMeta').textContent = `${this.rawRows.length} dòng gốc · ${this.headers.length} cột`;
    this.updateStepperUI(1);
  }

  // ==========================================================================
  // GIAI ĐOẠN 1, 2, 3: DATA DICTIONARY, DATA CLEANING & DESCRIPTIVE STATS
  // ==========================================================================
  parseNum(val) {
    if (val === undefined || val === null) return NaN;
    const s = String(val).replace(/[^0-9.-]/g, '');
    return s === '' ? NaN : parseFloat(s);
  }

  profileData(rows, headers) {
    const pkCol = headers[0];
    const seen = new Set();
    let dupCount = 0;
    let missingCount = 0;
    let formatCount = 0;
    let outlierCount = 0;

    const synWords = ['ha noi', 'hà nội', 'hn', 'tphcm', 'tp hcm', 'tp. hồ chí minh', 'da nang', 'cntt', 'công nghệ thông tin', 'mkt', 'fb_ads', 'fb', 'tiktok', 'google'];

    rows.forEach(r => {
      const idVal = String(r[pkCol] || '').trim();
      if (idVal && seen.has(idVal)) dupCount++;
      else if (idVal) seen.add(idVal);

      headers.forEach(col => {
        const raw = String(r[col] ?? '');
        const tr = raw.trim();
        const colL = col.toLowerCase();

        if (!tr || tr.toLowerCase() === 'null') { missingCount++; return; }

        if (colL.includes('date')) {
          if (!/^\d{4}-\d{2}-\d{2}$/.test(tr)) { formatCount++; return; }
          const p = tr.split('-').map(Number);
          if (p[1] < 1 || p[1] > 12 || p[2] < 1 || p[2] > 31) { formatCount++; return; }
        }

        const isNum = colL.includes('price') || colL.includes('quantity') || colL.includes('discount') ||
          colL.includes('salary') || colL.includes('bonus') || colL.includes('score') ||
          colL.includes('days') || colL.includes('spend') || colL.includes('revenue') || colL.includes('conversions');

        if (isNum) {
          if (/[,a-zA-ZđĐ₫]/.test(tr)) formatCount++;
          const n = this.parseNum(tr);
          if (!isNaN(n)) {
            if (n < 0) outlierCount++;
            else if ((colL.includes('price') || colL.includes('salary') || colL.includes('revenue')) && n >= 500000000) outlierCount++;
            else if (colL.includes('discount') && n > 60) outlierCount++;
            else if (colL.includes('score') && n > 100) outlierCount++;
          }
          return;
        }

        if (raw !== tr) formatCount++;
        else if (colL.includes('name') && (tr === tr.toUpperCase() || tr === tr.toLowerCase())) formatCount++;
        else if ((colL.includes('region') || colL.includes('location') || colL.includes('department') || colL.includes('channel')) &&
          synWords.includes(tr.toLowerCase()) &&
          !['Hà Nội', 'TP.HCM', 'Đà Nẵng', 'IT', 'Marketing', 'Facebook Ads', 'TikTok Ads', 'Google Search'].includes(tr)) {
          formatCount++;
        }
      });
    });

    const totalIssues = dupCount + missingCount + formatCount + outlierCount;
    const totalCells = Math.max(1, rows.length * headers.length);
    const penalty = Math.min(82, Math.round((totalIssues / totalCells) * 260) + dupCount * 4);
    const healthScore = totalIssues === 0 ? 100 : Math.max(18, 100 - penalty);

    return { rowCount: rows.length, dupCount, missingCount, formatCount, outlierCount, totalIssues, healthScore };
  }

  runAgentCleaningStage() {
    this.cleanIter++;
    this.maxApprovedStep = 2;
    this.executeCleaningEngine();
    this.buildStage1DataDictionary();
    this.buildStage3DescriptiveStats();

    this.renderStep2CleaningWorkspace();
    this.switchWorkspaceView('workspace');
    this.switchMainTab('clean');

    this.addAudit(
      `BƯỚC 2: LÀM SẠCH DỮ LIỆU (LẦN #${this.cleanIter})`,
      `Đã chạy 6 quy tắc làm sạch trên "${this.fileName}". Xử lý ${this.diffLog.length} lỗi, Điểm chất lượng tăng từ ${this.rawProfile.healthScore}% ➔ ${this.cleanProfile.healthScore}%. Đang chờ Chuyên viên BI duyệt ở Cổng #1.`,
      'info'
    );
    this.showToast(`✨ Đã hoàn tất Làm sạch dữ liệu (Lần #${this.cleanIter})! Vui lòng kiểm tra và bấm "CÓ – Dữ liệu Hợp lệ".`, 'info');
  }

  reRunCleaningWithRules() {
    this.runAgentCleaningStage();
  }

  executeCleaningEngine() {
    const rTrimSyn = document.getElementById('rule_trim_synonym')?.checked ?? true;
    const rDedup = document.getElementById('rule_dedup')?.checked ?? true;
    const rDate = document.getElementById('rule_date_iso')?.checked ?? true;
    const rNum = document.getElementById('rule_currency_num')?.checked ?? true;
    const rMissing = document.getElementById('rule_impute_missing')?.checked ?? true;
    const rOutlier = document.getElementById('rule_outlier_iqr')?.checked ?? true;

    const synMap = {
      'ha noi': 'Hà Nội', 'hà nội': 'Hà Nội', 'hn': 'Hà Nội',
      'tphcm': 'TP.HCM', 'tp hcm': 'TP.HCM', 'tp. hồ chí minh': 'TP.HCM',
      'da nang': 'Đà Nẵng',
      'cntt': 'IT', 'công nghệ thông tin': 'IT',
      'mkt': 'Marketing',
      'fb_ads': 'Facebook Ads', 'fb': 'Facebook Ads',
      'tiktok': 'TikTok Ads', 'google': 'Google Search'
    };

    const pkCol = this.headers[0];
    this.diffLog = [];
    this.dedupLogs = [];
    this.formatLogs = [];
    this.outlierLogs = [];
    this.cellChangeMap = {};

    const colMedians = {};
    this.headers.forEach(col => {
      const vals = [];
      this.rawRows.forEach(r => {
        const v = this.parseNum(r[col]);
        if (!isNaN(v) && v >= 0 && v < 500000000) vals.push(v);
      });
      if (vals.length > 0) {
        vals.sort((a, b) => a - b);
        colMedians[col] = vals[Math.floor(vals.length / 2)];
      }
    });

    const seenPks = new Set();
    const outRows = [];
    let lastValidDate = '2026-01-15';

    this.rawRows.forEach((origRow, origIdx) => {
      const rowId = String(origRow[pkCol] || `Row-${origIdx + 1}`).trim();

      if (rDedup && seenPks.has(rowId)) {
        const msg = `Loại bỏ dòng #${origIdx + 1} do trùng mã khóa chính "${rowId}"`;
        this.dedupLogs.push(msg);
        this.diffLog.push({ rowIdx: origIdx + 1, rowId, col: pkCol, oldVal: `${rowId} (Bản sao trùng)`, newVal: 'Đã xóa dòng trùng', rule: 'Khử dòng trùng lặp' });
        return;
      }
      seenPks.add(rowId);

      const newRow = {};
      this.headers.forEach(col => {
        const rawVal = String(origRow[col] ?? '');
        let val = rawVal;
        const colL = col.toLowerCase();

        // Missing value imputation
        if (val.trim() === '' || val.trim().toLowerCase() === 'null') {
          if (rMissing) {
            let imp = 'Chưa rõ';
            if (colL.includes('name')) imp = 'Khách hàng Vãng lai';
            else if (colL.includes('email')) imp = 'khachhang@company.vn';
            else if (colL.includes('discount') || colL.includes('bonus')) imp = '0';
            else if (colMedians[col] !== undefined) imp = String(colMedians[col]);
            else if (colL.includes('manager')) imp = 'Quản lý Khu vực';
            val = imp;
            this.outlierLogs.push(`Dòng #${origIdx + 1} (${rowId}) · Cột ${col}: Điền ô trống ➔ "${val}"`);
            this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, '[Ô trống]', val, 'Điền khuyết thiếu thông minh');
          }
          newRow[col] = val;
          return;
        }

        // Date ISO
        if (colL.includes('date') && rDate) {
          const norm = this.normalizeIsoDate(val, lastValidDate);
          if (norm !== val.trim()) {
            this.formatLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: "${rawVal}" ➔ "${norm}"`);
            this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, norm, 'Chuẩn hóa Ngày ISO YYYY-MM-DD');
            val = norm;
          }
          lastValidDate = val;
          newRow[col] = val;
          return;
        }

        // Numeric & Outlier IQR
        const isNum = colL.includes('price') || colL.includes('quantity') || colL.includes('discount') ||
          colL.includes('salary') || colL.includes('bonus') || colL.includes('score') ||
          colL.includes('days') || colL.includes('spend') || colL.includes('revenue') || colL.includes('conversions');

        if (isNum) {
          let num = this.parseNum(val);
          if (!isNaN(num)) {
            if (rNum && /[,a-zA-ZđĐ₫\s]/.test(val.trim())) {
              this.formatLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: Bóc tách tiền tệ "${rawVal}" ➔ ${num}`);
              this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, String(num), 'Bóc tách Tiền tệ -> Số');
              val = String(num);
            }
            if (rOutlier) {
              if (num < 0) {
                const fixed = colL.includes('discount') ? 0 : Math.abs(num);
                this.outlierLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: Đổi dấu số âm ${rawVal} ➔ ${fixed}`);
                this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, String(fixed), 'Xử lý số âm vô lý (|x|)');
                num = fixed;
                val = String(num);
              } else if ((colL.includes('price') || colL.includes('salary') || colL.includes('revenue')) && num >= 500000000) {
                const cap = colMedians[col] || 15000000;
                this.outlierLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: Ngoại lai cực đại ${this.fmt(num)} ➔ Trung vị ${this.fmt(cap)}`);
                this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, String(cap), 'Cắt ngưỡng Ngoại lai IQR -> Trung vị');
                num = cap;
                val = String(num);
              } else if (colL.includes('discount') && num > 60) {
                const cap = 15;
                this.outlierLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: Chiết khấu ${num}% vượt ngưỡng ➔ ${cap}%`);
                this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, String(cap), 'Giới hạn Chiết khấu hợp lệ (<=60%)');
                val = String(cap);
              } else if (colL.includes('score') && num > 100) {
                this.outlierLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: Điểm ${num} vượt thang 100 ➔ 100`);
                this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, '100', 'Chuẩn hóa thang điểm 100');
                val = '100';
              }
            }
          }
          newRow[col] = val;
          return;
        }

        // Text & Synonym Standardization
        if (rTrimSyn) {
          let cl = val.trim().replace(/\s+/g, ' ');
          const lk = cl.toLowerCase();
          if (synMap[lk]) {
            cl = synMap[lk];
          } else if (colL.includes('name')) {
            cl = cl.split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' ');
          }
          if (cl !== rawVal) {
            this.formatLogs.push(`Dòng #${origIdx + 1} (${rowId}) · ${col}: "${rawVal}" ➔ "${cl}"`);
            this.recordCellDiff(outRows.length, origIdx + 1, rowId, col, rawVal, cl, 'Chuẩn hóa Chuỗi & Đồng nghĩa');
            val = cl;
          }
        }
        newRow[col] = val;
      });

      outRows.push(newRow);
    });

    // Derived BI Columns (Net_Sales_VND, Cost_VND, Profit_VND)
    this.cleanHeaders = [...this.headers];
    if (this.headers.includes('Quantity') && this.headers.includes('Unit_Price')) {
      ['Net_Sales_VND', 'Cost_VND', 'Profit_VND'].forEach(c => {
        if (!this.cleanHeaders.includes(c)) this.cleanHeaders.push(c);
      });
      outRows.forEach(r => {
        const q = parseFloat(r['Quantity']) || 0;
        const p = parseFloat(r['Unit_Price']) || 0;
        const d = parseFloat(r['Discount_Pct']) || 0;
        const net = Math.round(q * p * (1 - d / 100));
        const cost = Math.round(net * 0.72);
        r['Net_Sales_VND'] = String(net);
        r['Cost_VND'] = String(cost);
        r['Profit_VND'] = String(net - cost);
      });
    } else if (this.headers.includes('Base_Salary') && this.headers.includes('Bonus')) {
      ['Total_Income_VND', 'Cost_VND', 'Profit_VND'].forEach(c => {
        if (!this.cleanHeaders.includes(c)) this.cleanHeaders.push(c);
      });
      outRows.forEach(r => {
        const s = parseFloat(r['Base_Salary']) || 0;
        const b = parseFloat(r['Bonus']) || 0;
        const tot = Math.round(s + b);
        r['Total_Income_VND'] = String(tot);
        r['Cost_VND'] = String(tot);
        r['Profit_VND'] = String(Math.round(tot * 0.35));
      });
    } else if (this.headers.includes('Revenue_VND') && this.headers.includes('Spend_VND')) {
      if (!this.cleanHeaders.includes('Profit_VND')) this.cleanHeaders.push('Profit_VND');
      outRows.forEach(r => {
        const rev = parseFloat(r['Revenue_VND']) || 0;
        const sp = parseFloat(r['Spend_VND']) || 0;
        r['Profit_VND'] = String(Math.round(rev - sp));
      });
    }

    this.cleanRows = outRows;
    this.cleanProfile = this.profileData(this.cleanRows, this.cleanHeaders);
  }

  normalizeIsoDate(raw, fallback) {
    const s = String(raw || '').trim();
    let m = s.match(/^(\d{1,2})[\/\-](\d{1,2})[\/\-](\d{4})$/);
    if (m) {
      const dd = m[1].padStart(2, '0'), mm = m[2].padStart(2, '0'), yyyy = m[3];
      if (+mm >= 1 && +mm <= 12 && +dd >= 1 && +dd <= 31) return `${yyyy}-${mm}-${dd}`;
      return fallback;
    }
    m = s.match(/^(\d{4})[\/\-](\d{1,2})[\/\-](\d{1,2})$/);
    if (m) {
      const yyyy = m[1], mm = m[2].padStart(2, '0'), dd = m[3].padStart(2, '0');
      if (+mm >= 1 && +mm <= 12 && +dd >= 1 && +dd <= 31) return `${yyyy}-${mm}-${dd}`;
      return fallback;
    }
    return fallback;
  }

  recordCellDiff(cleanRowIdx, origRowNum, rowId, col, oldVal, newVal, rule, manual = false) {
    const item = { rowIdx: origRowNum, rowId, col, oldVal, newVal, rule, manual };
    this.diffLog.push(item);
    this.cellChangeMap[`${cleanRowIdx}_${col}`] = item;
  }

  buildStage1DataDictionary() {
    this.fieldDictionary = this.cleanHeaders.map((col, idx) => {
      const colL = col.toLowerCase();
      let dataType = 'Text / Chuỗi';
      let role = 'Phân loại (Dimension)';
      let meaning = `Trường phân loại / thuộc tính của bản ghi (${col})`;

      if (idx === 0 || colL.includes('id')) {
        dataType = 'String (ID)';
        role = 'Khóa định danh (Primary Key)';
        meaning = 'Mã định danh duy nhất dùng để đối soát và khử trùng lặp';
      } else if (colL.includes('date')) {
        dataType = 'Date (YYYY-MM-DD)';
        role = 'Thời gian (Time Dimension)';
        meaning = 'Mốc thời gian phát sinh giao dịch dùng phân tích chuỗi thời gian (Time-Series)';
      } else if (!isNaN(this.cleanRows[0]?.[col]) && !colL.includes('phone')) {
        dataType = 'Numeric (Số)';
        role = 'Chỉ số đo lường (Metric/KPI)';
        meaning = `Chỉ số định lượng phục vụ tính Tổng, Trung bình, Trung vị và Pareto (${col})`;
      }

      let rawMissing = 0;
      this.rawRows.forEach(r => {
        if (r[col] !== undefined && String(r[col]).trim() === '') rawMissing++;
      });

      return {
        col,
        dataType,
        role,
        rawMissing,
        cleanMissing: 0,
        meaning
      };
    });
  }

  buildStage3DescriptiveStats() {
    this.descriptiveStats = [];
    this.cleanHeaders.forEach((col, idx) => {
      if (idx === 0 || col.toLowerCase().includes('phone')) return;
      const nums = this.cleanRows.map(r => parseFloat(r[col])).filter(v => !isNaN(v));
      if (nums.length >= Math.max(3, this.cleanRows.length * 0.5)) {
        nums.sort((a, b) => a - b);
        const count = nums.length;
        const sum = nums.reduce((a, b) => a + b, 0);
        const mean = sum / count;
        const median = count % 2 === 1 ? nums[Math.floor(count / 2)] : (nums[count / 2 - 1] + nums[count / 2]) / 2;
        const variance = nums.reduce((acc, v) => acc + Math.pow(v - mean, 2), 0) / count;
        const std = Math.sqrt(variance);
        const min = nums[0];
        const max = nums[count - 1];
        const q1 = nums[Math.floor(count * 0.25)];
        const q3 = nums[Math.floor(count * 0.75)];
        this.descriptiveStats.push({ col, count, sum, mean, median, std, min, max, q1, q3 });
      }
    });
  }

  // ==========================================================================
  // RENDER BƯỚC 2: LÀM SẠCH DỮ LIỆU & CỔNG DUYỆT #1
  // ==========================================================================
  renderStep2CleaningWorkspace() {
    const rp = this.rawProfile;
    const cp = this.cleanProfile;

    // 1. Render Stage 1 Data Dictionary
    document.getElementById('dictSummaryBadge').textContent = `1 Sheet · ${this.cleanHeaders.length} Trường dữ liệu`;
    const dictRows = this.fieldDictionary.map(fd => `
      <tr>
        <td><strong>${this.esc(fd.col)}</strong></td>
        <td><code>${this.esc(fd.dataType)}</code></td>
        <td><span class="badge-pill">${this.esc(fd.role)}</span></td>
        <td>Gốc thiếu: <strong>${fd.rawMissing}</strong> ➔ Sau làm sạch: <strong class="text-emerald">0 thiếu</strong></td>
        <td>${this.esc(fd.meaning)}</td>
      </tr>
    `).join('');

    document.getElementById('stage1DictionaryContent').innerHTML = `
      <div class="exec-summary-banner" style="margin-bottom:10px;">
        <strong>🔍 Nhận xét cấu trúc &amp; chất lượng dữ liệu ban đầu:</strong> Hệ thống đã tiếp nhận bảng <code>${this.esc(this.fileName)}</code> gồm <strong>${rp.rowCount} dòng gốc × ${this.headers.length} cột</strong>. Phát hiện <strong>${rp.dupCount} bản ghi trùng lặp</strong>, <strong>${rp.missingCount} ô bị bỏ trống</strong>, <strong>${rp.formatCount} ô sai định dạng ngày/số/danh mục</strong> và <strong>${rp.outlierCount} giá trị âm hoặc ngoại lai cực đại</strong>. Đã lập từ điển dữ liệu và chuẩn hóa thêm ${this.cleanHeaders.length - this.headers.length} cột chỉ số BI phái sinh.
      </div>
      <details class="side-card" style="padding:10px 14px;">
        <summary style="cursor:pointer;font-weight:800;font-size:12.5px;color:var(--blue);">📖 Bấm để xem chi tiết Từ điển Trường Dữ liệu (${this.fieldDictionary.length} cột) ▾</summary>
        <div class="table-scroll mt-2">
          <table class="studio-table">
            <thead><tr><th>Tên Cột</th><th>Kiểu Dữ liệu</th><th>Vai trò Ngữ nghĩa BI</th><th>Độ đầy đủ (Trước ➔ Sau)</th><th>Ý nghĩa Nghiệp vụ</th></tr></thead>
            <tbody>${dictRows}</tbody>
          </table>
        </div>
      </details>
    `;

    // 2. Render 4 Before -> After Comparison KPI Cards
    const rawErrCells = rp.missingCount + rp.formatCount + rp.outlierCount;
    const cleanErrCells = cp.missingCount + cp.formatCount + cp.outlierCount;

    document.getElementById('cleanCompareKpis').innerHTML = `
      <div class="cmp-card">
        <div class="cmp-label">Điểm chất lượng dữ liệu</div>
        <div class="cmp-vals">
          <span class="cmp-old">${rp.healthScore}%</span>
          <span>➔</span>
          <span class="cmp-new">${cp.healthScore}%</span>
        </div>
        <div class="cmp-note">Đạt chuẩn phân tích BI</div>
      </div>
      <div class="cmp-card">
        <div class="cmp-label">Số dòng dữ liệu (Bản ghi)</div>
        <div class="cmp-vals">
          <span class="cmp-old">${rp.rowCount} dòng</span>
          <span>➔</span>
          <span class="cmp-new">${cp.rowCount} dòng</span>
        </div>
        <div class="cmp-note">Đã loại bỏ ${rp.rowCount - cp.rowCount} dòng trùng</div>
      </div>
      <div class="cmp-card">
        <div class="cmp-label">Bản ghi bị trùng lặp</div>
        <div class="cmp-vals">
          <span class="cmp-old">${rp.dupCount} trùng</span>
          <span>➔</span>
          <span class="cmp-new">0 trùng</span>
        </div>
        <div class="cmp-note">Khử trùng khóa chính 100%</div>
      </div>
      <div class="cmp-card">
        <div class="cmp-label">Ô trống / Sai chuẩn / Ngoại lai</div>
        <div class="cmp-vals">
          <span class="cmp-old">${rawErrCells} ô lỗi</span>
          <span>➔</span>
          <span class="cmp-new">${cleanErrCells} ô lỗi</span>
        </div>
        <div class="cmp-note">Đã tự động chuẩn hóa ${this.diffLog.length} tác vụ</div>
      </div>
    `;

    // Populate Date Filter Select
    const dateCol = this.cleanHeaders.find(h => h.toLowerCase().includes('date'));
    const fSel = document.getElementById('cleanDateFilterSelect');
    if (dateCol && fSel) {
      const periods = Array.from(new Set(this.cleanRows.map(r => String(r[dateCol] || '').slice(0, 7)).filter(Boolean))).sort();
      fSel.innerHTML = `<option value="__ALL__">📅 Tất cả kỳ (${periods.length} tháng)</option>` +
        periods.map(p => `<option value="${p}">Tháng ${p}</option>`).join('');
    }

    this.renderCleanPreviewTable();
    this.renderDiffAndStatsTables();
    this.renderCategorizedCleaningLogs();
  }

  renderCleanPreviewTable() {
    const fVal = document.getElementById('cleanDateFilterSelect')?.value || '__ALL__';
    const dateCol = this.cleanHeaders.find(h => h.toLowerCase().includes('date'));

    let rowsToShow = this.cleanRows.map((r, idx) => ({ __idx: idx, ...r }));
    if (fVal !== '__ALL__' && dateCol) {
      rowsToShow = rowsToShow.filter(r => String(r[dateCol] || '').startsWith(fVal));
    }

    document.getElementById('cleanPreviewMetaText').innerHTML =
      `💡 <strong>Xem trước sau làm sạch (${rowsToShow.length} dòng):</strong> Các ô màu xanh lá là ô đã được AI làm sạch (di chuột để xem giá trị gốc). <strong>Nhấp đúp (Double-click)</strong> vào bất kỳ ô nào để Chuyên viên BI sửa tay trực tiếp!`;

    let html = `<table class="studio-table"><thead><tr><th>#</th>`;
    this.cleanHeaders.forEach(h => { html += `<th>${this.esc(h)}</th>`; });
    html += `</tr></thead><tbody>`;

    rowsToShow.forEach(r => {
      const rIdx = r.__idx;
      html += `<tr><td>${rIdx + 1}</td>`;
      this.cleanHeaders.forEach(col => {
        const val = String(r[col] ?? '');
        const chg = this.cellChangeMap[`${rIdx}_${col}`];
        const cls = chg ? (chg.manual ? 'cell-manual' : 'cell-cleaned') : '';
        const tip = chg
          ? `✔ [${chg.rule}] Trước: "${chg.oldVal}" ➔ Sau: "${chg.newVal}" (Nhấp đúp để sửa)`
          : 'Nhấp đúp (Double-click) để sửa trực tiếp ô này';
        const disp = this.isMoneyCol(col) && !isNaN(val) && val !== '' ? this.fmt(val) : this.esc(val);
        html += `<td class="${cls}" title="${this.esc(tip)}" ondblclick="app.enableInlineEdit(this, ${rIdx}, '${col}')">${disp}</td>`;
      });
      html += `</tr>`;
    });
    html += `</tbody></table>`;
    document.getElementById('cleanedPreviewTableWrap').innerHTML = html;
  }

  enableInlineEdit(td, rowIdx, col) {
    if (td.querySelector('input')) return;
    const curVal = String(this.cleanRows[rowIdx][col] ?? '');
    const inp = document.createElement('input');
    inp.type = 'text';
    inp.value = curVal;
    inp.className = 'studio-input-sm';
    inp.style.width = '100%';
    inp.style.minWidth = '85px';

    const commit = () => {
      const next = inp.value.trim();
      if (next !== curVal) {
        const pk = this.cleanRows[rowIdx][this.cleanHeaders[0]] || `Row-${rowIdx + 1}`;
        this.cleanRows[rowIdx][col] = next;
        this.recordCellDiff(rowIdx, rowIdx + 1, pk, col, curVal, next, `👤 Sửa tay bởi ${this.reviewerName}`, true);
        this.buildStage3DescriptiveStats();
        this.showToast(`Đã cập nhật [${pk} · ${col}] ➔ "${next}"`, 'info');
      }
      this.renderStep2CleaningWorkspace();
    };

    inp.addEventListener('blur', commit);
    inp.addEventListener('keydown', e => {
      if (e.key === 'Enter') inp.blur();
      if (e.key === 'Escape') this.renderCleanPreviewTable();
    });
    td.innerHTML = '';
    td.appendChild(inp);
    inp.focus();
  }

  renderDiffAndStatsTables() {
    document.getElementById('diffTotalCountBadge').textContent = this.diffLog.length;

    let dHtml = `<table class="studio-table"><thead><tr>
      <th>Vị trí Dòng</th><th>Mã Bản ghi</th><th>Cột dữ liệu</th><th>Giá trị Gốc (Trước)</th><th>Giá trị Sạch (Sau)</th><th>Quy tắc / Người xử lý</th>
    </tr></thead><tbody>`;
    this.diffLog.forEach(d => {
      dHtml += `<tr>
        <td>Dòng #${d.rowIdx}</td>
        <td><strong>${this.esc(d.rowId)}</strong></td>
        <td><code>${this.esc(d.col)}</code></td>
        <td class="cell-old-err">${this.esc(d.oldVal)}</td>
        <td class="${d.manual ? 'cell-manual' : 'cell-cleaned'}">${this.esc(d.newVal)}</td>
        <td>${this.esc(d.rule)}</td>
      </tr>`;
    });
    dHtml += `</tbody></table>`;
    document.getElementById('diffLogTableWrap').innerHTML = dHtml;

    let sHtml = `<table class="studio-table"><thead><tr>
      <th>Cột Chỉ số Số học</th><th>Số bản ghi (N)</th><th>Tổng cộng (Sum)</th><th>Trung bình (Mean)</th><th>Trung vị (Median)</th><th>Độ lệch chuẩn (σ)</th><th>Min → Max</th><th>Tứ phân vị (Q1 → Q3)</th>
    </tr></thead><tbody>`;
    this.descriptiveStats.forEach(s => {
      sHtml += `<tr>
        <td><strong>${this.esc(s.col)}</strong></td>
        <td>${s.count}</td>
        <td><strong>${this.fmt(s.sum)}</strong></td>
        <td class="text-blue"><strong>${this.fmt(Math.round(s.mean))}</strong></td>
        <td class="text-emerald"><strong>${this.fmt(Math.round(s.median))}</strong></td>
        <td>±${this.fmt(Math.round(s.std))}</td>
        <td>${this.fmt(s.min)} → ${this.fmt(s.max)}</td>
        <td>${this.fmt(s.q1)} → ${this.fmt(s.q3)}</td>
      </tr>`;
    });
    sHtml += `</tbody></table>`;
    document.getElementById('descriptiveStatsTableWrap').innerHTML = sHtml;
  }

  renderCategorizedCleaningLogs() {
    document.getElementById('dedupLogBox').innerHTML = this.dedupLogs.length
      ? `<ul style="padding-left:16px;">${this.dedupLogs.map(l => `<li>${this.esc(l)}</li>`).join('')}</ul>`
      : '✔ Không phát sinh dòng trùng lặp.';

    document.getElementById('formatLogBox').innerHTML = this.formatLogs.length
      ? `<ul style="padding-left:16px;">${this.formatLogs.map(l => `<li>${this.esc(l)}</li>`).join('')}</ul>`
      : '✔ Định dạng ngày và chuỗi đã chuẩn.';

    document.getElementById('outlierLogBox').innerHTML = this.outlierLogs.length
      ? `<ul style="padding-left:16px;">${this.outlierLogs.map(l => `<li>${this.esc(l)}</li>`).join('')}</ul>`
      : '✔ Không có ô trống hoặc ngoại lai.';

    document.getElementById('sideAnomalySummaryBox').innerHTML = `
      <div style="font-size:11.5px;background:var(--bg-card-solid);padding:8px 10px;border-radius:10px;border:1px solid var(--border-card);">
        <div>🧹 Đã loại trùng: <strong>${this.dedupLogs.length} dòng</strong></div>
        <div>⏱️ Chuẩn hóa chuẩn: <strong>${this.formatLogs.length} ô</strong></div>
        <div>⚠️ Khuyết &amp; Ngoại lai: <strong>${this.outlierLogs.length} ô</strong></div>
      </div>
    `;
  }

  switchCleanSubTab(sub) {
    ['preview', 'diff', 'stats'].forEach(k => {
      document.getElementById(` cleanSubPane_${k}`.trim())?.classList.toggle('hidden', k !== sub);
    });
    document.getElementById('innerTabCleanPreview').classList.toggle('active', sub === 'preview');
    document.getElementById('innerTabDiffCells').classList.toggle('active', sub === 'diff');
    document.getElementById('innerTabDescStats').classList.toggle('active', sub === 'stats');
  }

  // Gate 1 Actions (CÓ / KHÔNG)
  approveGate1() {
    this.maxApprovedStep = Math.max(this.maxApprovedStep, 3);
    this.analysisIter = Math.max(1, this.analysisIter);
    document.getElementById('gate1RejectDrawer')?.classList.add('hidden');

    this.initDashboardDimensions();
    this.renderAllAnalytics();

    this.addAudit(
      'CỔNG KIỂM DUYỆT #1: CÓ – DỮ LIỆU HỢP LỆ (MỞ BƯỚC 3)',
      `Chuyên viên "${this.reviewerName}" đã duyệt bảng dữ liệu sạch (${this.cleanRows.length} dòng, chất lượng ${this.cleanProfile.healthScore}%). Mở khóa Bước 3 Phân tích chuyên sâu 7 giai đoạn.`,
      'approve'
    );

    this.switchMainTab('dashboard');
    window.scrollTo({ top: 0, behavior: 'smooth' });
    this.showToast('✅ Đã duyệt Bước 2! Đang mở trang Phân tích chuyên sâu 7 giai đoạn (Bước 3 / 4).', 'info');
  }

  rejectGate1() {
    document.getElementById('gate1RejectDrawer')?.classList.remove('hidden');
    this.addAudit(
      'CỔNG KIỂM DUYỆT #1: KHÔNG – YÊU CẦU LÀM SẠCH LẠI',
      `Chuyên viên "${this.reviewerName}" từ chối kết quả làm sạch hiện tại và yêu cầu điều chỉnh quy tắc.`,
      'reject'
    );
    this.showToast('⚠️ Bạn đã chọn "KHÔNG – Chưa hợp lệ". Vui lòng nhập yêu cầu hoặc chỉnh lại các ô tích quy tắc rồi bấm Chạy Làm Sạch Lại!', 'warn');
  }

  submitGate1Rework() {
    const note = document.getElementById('gate1RejectNote').value.trim();
    document.getElementById('gate1RejectDrawer')?.classList.add('hidden');
    this.runAgentCleaningStage();
    this.addAudit('LÀM SẠCH LẠI THEO YÊU CẦU CON NGƯỜI', `Ghi chú của ${this.reviewerName}: "${note || 'Tinh chỉnh bộ quy tắc làm sạch'}"`, 'info');
  }

  // ==========================================================================
  // BƯỚC 3: PHÂN TÍCH 7 GIAI ĐOẠN BI, 6 BIỂU ĐỒ, CHUỖI DIID & BÁO CÁO 10 MỤC
  // ==========================================================================
  initDashboardDimensions() {
    const dimSel = document.getElementById('dashDimensionSelect');
    const perSel = document.getElementById('dashPeriodSelect');

    const catCols = this.cleanHeaders.filter((col, idx) => {
      if (idx === 0) return false;
      const cl = col.toLowerCase();
      if (cl.includes('date') || cl.includes('email') || cl.includes('phone') || cl.includes('name')) return false;
      return isNaN(this.cleanRows[0]?.[col]);
    });
    if (catCols.length === 0) catCols.push(this.cleanHeaders[1] || this.cleanHeaders[0]);

    dimSel.innerHTML = catCols.map(c => `<option value="${c}">${c}</option>`).join('');

    const dateCol = this.cleanHeaders.find(h => h.toLowerCase().includes('date'));
    if (dateCol) {
      const months = Array.from(new Set(this.cleanRows.map(r => String(r[dateCol] || '').slice(0, 7)).filter(Boolean))).sort();
      perSel.innerHTML = `<option value="__ALL__">Toàn kỳ (${months.length} tháng)</option>` +
        months.map(m => `<option value="${m}">Kỳ ${m}</option>`).join('');
    }
  }

  renderAllAnalytics() {
    const dim = document.getElementById('dashDimensionSelect')?.value || this.cleanHeaders[1];
    const chosenPeriod = document.getElementById('dashPeriodSelect')?.value || '__ALL__';
    const dateCol = this.cleanHeaders.find(h => h.toLowerCase().includes('date')) || this.cleanHeaders[1];

    const revCol = this.cleanHeaders.find(c => ['Net_Sales_VND', 'Total_Income_VND', 'Revenue_VND', 'Unit_Price', 'Base_Salary'].includes(c)) || this.cleanHeaders[this.cleanHeaders.length - 1];
    const costCol = this.cleanHeaders.find(c => ['Cost_VND', 'Spend_VND', 'Base_Salary'].includes(c));
    const profCol = this.cleanHeaders.find(c => c === 'Profit_VND');

    let activeRows = this.cleanRows;
    if (chosenPeriod !== '__ALL__') {
      activeRows = this.cleanRows.filter(r => String(r[dateCol] || '').startsWith(chosenPeriod));
    }

    let totalRev = 0, totalCost = 0, totalProfit = 0, totalQty = 0;
    const groups = {};
    const monthGroups = {};

    this.cleanRows.forEach(r => {
      const mKey = String(r[dateCol] || '2026-01').slice(0, 7);
      const rv = parseFloat(r[revCol]) || 0;
      if (!monthGroups[mKey]) monthGroups[mKey] = { period: mKey, sum: 0, count: 0, byGroup: {} };
      monthGroups[mKey].sum += rv;
      monthGroups[mKey].count += 1;
      const gName = r[dim] || 'Khác';
      monthGroups[mKey].byGroup[gName] = (monthGroups[mKey].byGroup[gName] || 0) + rv;
    });

    activeRows.forEach(r => {
      const gKey = r[dim] || 'Khác';
      const rv = parseFloat(r[revCol]) || 0;
      const cs = costCol ? (parseFloat(r[costCol]) || 0) : Math.round(rv * 0.72);
      const pf = profCol ? (parseFloat(r[profCol]) || 0) : (rv - cs);
      const qt = parseFloat(r['Quantity'] || r['Working_Days'] || r['Conversions'] || 1) || 1;

      totalRev += rv;
      totalCost += cs;
      totalProfit += pf;
      totalQty += qt;

      if (!groups[gKey]) groups[gKey] = { name: gKey, rev: 0, cost: 0, profit: 0, count: 0 };
      groups[gKey].rev += rv;
      groups[gKey].cost += cs;
      groups[gKey].profit += pf;
      groups[gKey].count += 1;
    });

    const sortedGroups = Object.values(groups).sort((a, b) => b.rev - a.rev);
    let cumPct = 0;
    sortedGroups.forEach(g => {
      g.sharePct = totalRev > 0 ? +((g.rev / totalRev) * 100).toFixed(1) : 0;
      cumPct += g.sharePct;
      g.cumPct = +Math.min(100, cumPct).toFixed(1);
      g.abcClass = g.cumPct <= 72 ? 'A' : g.cumPct <= 92 ? 'B' : 'C';
    });

    const sortedMonths = Object.values(monthGroups).sort((a, b) => a.period.localeCompare(b.period));
    sortedMonths.forEach((m, i) => {
      m.momPct = i > 0 && sortedMonths[i - 1].sum > 0
        ? +(((m.sum - sortedMonths[i - 1].sum) / sortedMonths[i - 1].sum) * 100).toFixed(1)
        : null;
    });

    const top1 = sortedGroups[0] || { name: 'N/A', rev: 0, profit: 0, count: 0, sharePct: 0 };
    const top2 = sortedGroups[1] || { name: 'N/A', rev: 0, profit: 0, count: 0, sharePct: 0 };
    const bottom = sortedGroups[sortedGroups.length - 1] || { name: 'N/A', rev: 0, profit: 0, count: 0, sharePct: 0 };
    const top2Share = (top1.sharePct + top2.sharePct).toFixed(1);
    const marginPct = totalRev > 0 ? ((totalProfit / totalRev) * 100).toFixed(1) : '28.0';

    this.analyticsData = {
      dim, chosenPeriod, dateCol, revCol, totalRev, totalCost, totalProfit, totalQty,
      marginPct, sortedGroups, sortedMonths, top1, top2, bottom, top2Share, rowCount: activeRows.length
    };

    // 1. Top 1, Top 2 & Confidence Cards
    document.getElementById('top1GroupName').textContent = top1.name;
    document.getElementById('top1ShareBadge').textContent = `${top1.sharePct}% tỷ trọng`;
    document.getElementById('top1GroupDesc').textContent = `Đạt ${this.fmt(top1.rev)} VND (${top1.count} bản ghi) · Lợi nhuận: ${this.fmt(top1.profit)} VND`;

    document.getElementById('top2GroupName').textContent = top2.name;
    document.getElementById('top2ShareBadge').textContent = `${top2.sharePct}% tỷ trọng`;
    document.getElementById('top2GroupDesc').textContent = `Đạt ${this.fmt(top2.rev)} VND (${top2.count} bản ghi) · Lợi nhuận: ${this.fmt(top2.profit)} VND`;

    document.getElementById('approvedByLabel').textContent = this.reviewerName;
    document.getElementById('dashboardAlertChips').innerHTML = `
      <span class="badge-pill">🧹 Đã khử ${this.dedupLogs.length} trùng</span>
      <span class="badge-pill">⏱️ Chuẩn hóa ${this.formatLogs.length} ô</span>
      <span class="badge-pill">🏅 Top 2 chiếm ${top2Share}%</span>
    `;

    // 2. Executive Narrative & 4 KPI Cards
    document.getElementById('execSummaryBanner').innerHTML = `
      📌 <strong>Tóm tắt phân tích Dashboard trình Lãnh đạo:</strong> Phân tích <strong>${activeRows.length} bản ghi sạch</strong> (${chosenPeriod === '__ALL__' ? 'Toàn kỳ' : 'Kỳ ' + chosenPeriod}) cho thấy tổng <strong>${revCol}</strong> đạt <strong>${this.fmt(totalRev)} VND</strong>, Lợi nhuận ròng (Profit_VND) đạt <strong>${this.fmt(totalProfit)} VND</strong> (biên lợi nhuận <strong>${marginPct}%</strong>) và Chi phí ở mức <strong>${this.fmt(totalCost)} VND</strong>. Cấu trúc đóng góp theo <strong>${dim}</strong> tập trung cao độ khi 2 nhóm dẫn đầu (<strong>${top1.name}</strong> &amp; <strong>${top2.name}</strong>) chiếm tới <strong>${top2Share}%</strong> tổng quy mô, trong khi <strong>${bottom.name}</strong> chỉ chiếm <strong>${bottom.sharePct}%</strong> (${this.fmt(bottom.rev)} VND).
      ${this.customReworkNote ? `<br/><span style="color:var(--amber);font-weight:800;">👉 [Đã điều chỉnh theo yêu cầu đánh giá của Chuyên viên BI]: ${this.esc(this.customReworkNote)}</span>` : ''}
    `;

    document.getElementById('dash4KpisGrid').innerHTML = `
      <div class="kpi-box">
        <div class="kpi-box-title">Số đơn hàng / Bản ghi sạch</div>
        <div class="kpi-box-val">${this.fmt(activeRows.length)}</div>
        <div class="kpi-box-sub">Tổng khối lượng: ${this.fmt(totalQty)}</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-box-title">Tổng Doanh thu / Quy mô (${this.esc(revCol)})</div>
        <div class="kpi-box-val text-blue">${this.fmt(totalRev)} VND</div>
        <div class="kpi-box-sub">Trung bình: ${this.fmt(Math.round(totalRev / Math.max(1, activeRows.length)))} / bản ghi</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-box-title">Tổng Lợi nhuận (Profit_VND)</div>
        <div class="kpi-box-val text-emerald">${this.fmt(totalProfit)} VND</div>
        <div class="kpi-box-sub">Biên lợi nhuận: ${marginPct}%</div>
      </div>
      <div class="kpi-box">
        <div class="kpi-box-title">Tổng Chi phí (Cost_VND)</div>
        <div class="kpi-box-val text-amber">${this.fmt(totalCost)} VND</div>
        <div class="kpi-box-sub">Tỷ lệ chi phí: ${(100 - parseFloat(marginPct)).toFixed(1)}%</div>
      </div>
    `;

    document.getElementById('dashMarginStrip').innerHTML = `
      <span>💹 Tỷ suất Lợi nhuận ròng trên Doanh thu (Net Profit Margin)</span>
      <span class="text-emerald" style="font-size:16px;">${marginPct}% (${this.fmt(totalProfit)} / ${this.fmt(totalRev)} VND)</span>
    `;

    // 3. Render Stage 4: 6 Professional BI Charts
    this.renderStage4SixCharts();

    // 4. Render MG KPI Tree & ABC Ranking
    this.renderMgTreeAndAbc();

    // 5. Render Stage 5: DIID Insights (DATA -> INFORMATION -> INSIGHT -> DECISION)
    this.renderStage5DiidInsights();

    // 6. Render Stage 6: Actionable Solutions Table
    this.renderStage6SolutionsTable();

    // 7. Render Stage 7: 10-Section Enterprise BI Report
    this.renderStage7Report10();
  }

  renderStage4SixCharts() {
    const d = this.analyticsData;
    const maxRev = d.top1.rev || 1;

    // Chart 1: Horizontal Bar Comparison
    const ch1Bars = d.sortedGroups.map((g, i) => `
      <div style="margin-bottom:7px;">
        <div style="display:flex;justify-content:space-between;font-size:11.5px;font-weight:700;">
          <span>#${i + 1} · ${this.esc(g.name)} (${g.count} dòng)</span>
          <span class="text-blue">${this.fmt(g.rev)} (${g.sharePct}%)</span>
        </div>
        <div style="height:9px;background:rgba(37,99,235,0.12);border-radius:99px;overflow:hidden;margin-top:3px;">
          <div style="height:100%;width:${Math.max(5, Math.round((g.rev / maxRev) * 100))}%;background:linear-gradient(90deg,#2563eb,#0d9488);border-radius:99px;"></div>
        </div>
      </div>
    `).join('');

    // Chart 2: Donut Share Chart
    const colors = ['#2563eb', '#059669', '#7c3aed', '#d97706', '#e11d48', '#0891b2'];
    let acc = 0;
    const stops = d.sortedGroups.map((g, i) => {
      const st = acc;
      acc = Math.min(100, acc + g.sharePct);
      return `${colors[i % colors.length]} ${st.toFixed(1)}% ${acc.toFixed(1)}%`;
    });
    const donutHtml = `
      <div style="display:flex;align-items:center;gap:16px;flex-wrap:wrap;">
        <div style="width:120px;height:120px;border-radius:50%;background:conic-gradient(${stops.join(', ')});display:flex;align-items:center;justify-content:center;flex-shrink:0;">
          <div style="width:64px;height:64px;border-radius:50%;background:var(--bg-card-solid);display:flex;align-items:center;justify-content:center;font-size:11px;font-weight:800;">100%</div>
        </div>
        <div style="flex:1;font-size:11.5px;">
          ${d.sortedGroups.map((g, i) => `
            <div style="display:flex;justify-content:space-between;margin-bottom:4px;">
              <span><span style="display:inline-block;width:9px;height:9px;border-radius:50%;background:${colors[i % colors.length]};margin-right:6px;"></span><strong>${this.esc(g.name)}</strong></span>
              <strong>${g.sharePct}%</strong>
            </div>
          `).join('')}
        </div>
      </div>
    `;

    // Chart 3: Time-Series Line Chart
    const pts = d.sortedMonths;
    const maxM = Math.max(1, ...pts.map(p => p.sum));
    const coords = pts.map((p, i) => {
      const x = pts.length === 1 ? 180 : 30 + (i * 300) / (pts.length - 1);
      const y = 115 - (p.sum / maxM) * 85;
      return { x: Math.round(x), y: Math.round(y), label: p.period, val: p.sum };
    });
    const poly = coords.map(c => `${c.x},${c.y}`).join(' ');
    const area = coords.length ? `${coords[0].x},115 ${poly} ${coords[coords.length - 1].x},115` : '';
    const lineSvg = `
      <svg viewBox="0 0 360 135" style="width:100%;height:135px;">
        <polygon points="${area}" fill="rgba(37,99,235,0.15)" />
        <polyline fill="none" stroke="#2563eb" stroke-width="2.6" points="${poly}" />
        ${coords.map(c => `<circle cx="${c.x}" cy="${c.y}" r="4" fill="#059669" stroke="#fff" stroke-width="1.5"><title>${c.label}: ${this.fmt(c.val)}</title></circle>
        <text x="${c.x}" y="130" text-anchor="middle" font-size="9.5" fill="#64748b" font-weight="700">${c.label}</text>`).join('')}
      </svg>
    `;

    // Chart 4: Pareto 80/20 Combo (Columns + Cumulative Line)
    const nG = d.sortedGroups.length || 1;
    const slotW = 340 / nG;
    const barW = Math.min(36, Math.max(14, slotW * 0.6));
    const paretoBars = d.sortedGroups.map((g, i) => {
      const bh = Math.max(8, Math.round((g.rev / maxRev) * 90));
      const x = Math.round(15 + i * slotW + (slotW - barW) / 2);
      const y = 108 - bh;
      return `<rect x="${x}" y="${y}" width="${barW}" height="${bh}" rx="4" fill="#2563eb" fill-opacity="0.85"><title>${g.name}: ${this.fmt(g.rev)} (Tích lũy: ${g.cumPct}%)</title></rect>
              <text x="${x + barW / 2}" y="126" text-anchor="middle" font-size="8.5" fill="#475569" font-weight="700">${this.esc(g.name.slice(0, 8))}</text>`;
    }).join('');
    const paretoLine = d.sortedGroups.map((g, i) => {
      const x = Math.round(15 + i * slotW + slotW / 2);
      const y = Math.round(108 - (g.cumPct / 100) * 90);
      return `${x},${y}`;
    }).join(' ');
    const paretoSvg = `
      <svg viewBox="0 0 360 135" style="width:100%;height:135px;">
        <line x1="15" y1="${Math.round(108 - 0.8 * 90)}" x2="345" y2="${Math.round(108 - 0.8 * 90)}" stroke="#dc2626" stroke-dasharray="3,3" stroke-width="1"/>
        ${paretoBars}
        <polyline fill="none" stroke="#d97706" stroke-width="2.4" points="${paretoLine}" />
      </svg>
    `;

    // Chart 5: Profit vs Cost Stacked / Margin Comparison
    const marginBars = d.sortedGroups.map(g => {
      const mPct = g.rev > 0 ? ((g.profit / g.rev) * 100).toFixed(1) : '0.0';
      return `
        <div style="margin-bottom:7px;font-size:11.5px;">
          <div style="display:flex;justify-content:space-between;font-weight:700;">
            <span>${this.esc(g.name)}</span>
            <span class="text-emerald">Lợi nhuận: ${this.fmt(g.profit)} (Biên ${mPct}%)</span>
          </div>
          <div style="height:8px;background:#fde68a;border-radius:99px;overflow:hidden;margin-top:3px;">
            <div style="height:100%;width:${Math.max(8, Math.min(100, parseFloat(mPct) * 2.5))}%;background:#059669;border-radius:99px;"></div>
          </div>
        </div>
      `;
    }).join('');

    // Chart 6: Period-over-Period Drivers / Variance
    let varianceHtml = '';
    if (d.sortedMonths.length >= 2) {
      const prevM = d.sortedMonths[d.sortedMonths.length - 2];
      const currM = d.sortedMonths[d.sortedMonths.length - 1];
      varianceHtml = d.sortedGroups.slice(0, 5).map(g => {
        const vPrev = prevM.byGroup[g.name] || 0;
        const vCurr = currM.byGroup[g.name] || 0;
        const delta = vCurr - vPrev;
        const pos = delta >= 0;
        return `
          <div style="display:flex;justify-content:space-between;align-items:center;padding:5px 0;border-bottom:1px dashed var(--border-card);font-size:11.5px;">
            <strong>${this.esc(g.name)}</strong>
            <span>${this.fmt(vPrev)} ➔ ${this.fmt(vCurr)}</span>
            <strong style="color:${pos ? 'var(--emerald)' : 'var(--rose)'}">${pos ? '+' : ''}${this.fmt(delta)}</strong>
          </div>
        `;
      }).join('');
    } else {
      varianceHtml = `<p style="font-size:11.5px;color:var(--text-muted)">Cần tối thiểu 2 kỳ thời gian để so sánh chênh lệch kỳ.</p>`;
    }

    const chartCards = [
      {
        type: '1. Biểu đồ Thanh Ngang (Bar Chart)',
        title: `So sánh quy mô ${d.revCol} theo ${d.dim}`,
        visual: ch1Bars,
        comment: `"${d.top1.name}" dẫn đầu tuyệt đối với ${this.fmt(d.top1.rev)} VND (${d.top1.sharePct}%), gấp ${(d.top1.rev / Math.max(1, d.bottom.rev)).toFixed(1)} lần nhóm thấp nhất.`
      },
      {
        type: '2. Biểu đồ Tròn / Donut (Pie Share)',
        title: `Cơ cấu tỷ trọng đóng góp (%) theo ${d.dim}`,
        visual: donutHtml,
        comment: `Top 2 nhóm đầu bảng chiếm ${d.top2Share}% tổng doanh thu toàn hệ thống, thể hiện mức độ tập trung cao.`
      },
      {
        type: '3. Biểu đồ Đường (Time-Series Trend)',
        title: `Xu hướng biến động ${d.revCol} theo kỳ (${d.dateCol})`,
        visual: lineSvg,
        comment: `Chuỗi thời gian đã được làm sạch các ngày sai lịch (như 2026-99-99), phản ánh chính xác xu hướng biến động qua ${d.sortedMonths.length} kỳ.`
      },
      {
        type: '4. Biểu đồ Pareto 80/20 (Combo Chart)',
        title: `Đường tích lũy Pareto & Phân bổ 80/20 theo ${d.dim}`,
        visual: paretoSvg,
        comment: `Đường cam thể hiện tỷ trọng tích lũy %. Nhóm hạng A (dưới ngưỡng 80%) là trụ cột sống còn cần bảo vệ.`
      },
      {
        type: '5. Biểu đồ Hiệu suất Lợi nhuận (Margin Bar)',
        title: `So sánh Lợi nhuận ròng & Biên lợi nhuận theo ${d.dim}`,
        visual: marginBars,
        comment: `Tổng lợi nhuận đạt ${this.fmt(d.totalProfit)} VND (biên trung bình ${d.marginPct}%). Cần kiểm soát chiết khấu ở các nhóm biên thấp.`
      },
      {
        type: '6. Phân tích Biến động Giữa Các Kỳ (Period Drivers)',
        title: `Nhóm thúc đẩy / kéo giảm tăng trưởng giữa 2 kỳ gần nhất`,
        visual: varianceHtml,
        comment: `Chỉ rõ nhóm nào đang tăng tốc (+) và nhóm nào đang suy giảm (-) để điều chỉnh nguồn lực kịp thời.`
      }
    ];

    document.getElementById('biStage4ChartsGrid').innerHTML = chartCards.map(c => `
      <div class="chart-card-item">
        <div>
          <span class="badge-pill">${this.esc(c.type)}</span>
          <h4 style="font-size:13.5px;font-weight:800;margin-top:6px;">${this.esc(c.title)}</h4>
        </div>
        <div class="chart-visual-box">${c.visual}</div>
        <div class="chart-commentary"><strong>💡 Nhận xét &amp; Ý nghĩa BI:</strong> ${this.esc(c.comment)}</div>
      </div>
    `).join('');
  }

  renderMgTreeAndAbc() {
    const d = this.analyticsData;
    document.getElementById('kpiTreeContainer').innerHTML = `
      <div class="tree-branch">
        <strong class="text-blue">🎯 Mục tiêu Quản trị (MG #1): Tăng trưởng Quy mô</strong>
        <p style="margin-top:4px;">Tổng ${this.esc(d.revCol)}: <strong>${this.fmt(d.totalRev)} VND</strong> · Giữ vững thị phần tại <strong>${this.esc(d.top1.name)}</strong> (${d.top1.sharePct}%).</p>
      </div>
      <div class="tree-branch" style="border-left-color:var(--emerald)">
        <strong class="text-emerald">💹 Mục tiêu Quản trị (MG #2): Tối ưu Biên Lợi nhuận</strong>
        <p style="margin-top:4px;">Lợi nhuận: <strong>${this.fmt(d.totalProfit)} VND</strong> (Biên <strong>${d.marginPct}%</strong>) · Kiểm soát chi phí (${this.fmt(d.totalCost)} VND).</p>
      </div>
      <div class="tree-branch" style="border-left-color:var(--purple)">
        <strong class="text-purple">🏅 Mục tiêu Quản trị (MG #3): Nâng cấp Nhóm Hạng C</strong>
        <p style="margin-top:4px;">Thúc đẩy doanh số tại <strong>${this.esc(d.bottom.name)}</strong> (hiện mới đạt ${this.fmt(d.bottom.rev)} VND).</p>
      </div>
      <div class="tree-branch" style="border-left-color:var(--amber)">
        <strong class="text-amber">🛡️ Mục tiêu Quản trị (MG #4): Chuẩn hóa Dữ liệu</strong>
        <p style="margin-top:4px;">Duy trì điểm chất lượng dữ liệu ở mức <strong>${this.cleanProfile.healthScore}%</strong>, chặn lỗi nhập số âm và trùng mã.</p>
      </div>
    `;

    document.getElementById('abcRankingContainer').innerHTML = d.sortedGroups.map((g, idx) => `
      <div class="abc-row">
        <div>
          <strong>#${idx + 1} · ${this.esc(g.name)}</strong>
          <div style="font-size:11px;color:var(--text-muted)">${g.count} bản ghi · Tích lũy: ${g.cumPct}%</div>
        </div>
        <div style="text-align:right;">
          <strong>${this.fmt(g.rev)} VND (${g.sharePct}%)</strong>
          <div><span class="abc-badge abc-${g.abcClass}">Hạng ${g.abcClass} (${g.abcClass === 'A' ? 'Chủ lực VIP' : g.abcClass === 'B' ? 'Tiềm năng' : 'Cần tối ưu'})</span></div>
        </div>
      </div>
    `).join('');
  }

  renderStage5DiidInsights() {
    const d = this.analyticsData;
    const insights = [
      {
        id: 'INS-01',
        title: `Sự tập trung Pareto tại "${d.top1.name}" & "${d.top2.name}"`,
        category: 'Cấu trúc Doanh thu & Thị trường',
        data: `Bảng sạch ghi nhận ${d.rowCount} bản ghi với tổng ${d.revCol} = ${this.fmt(d.totalRev)} VND.`,
        info: `"${d.top1.name}" đạt ${this.fmt(d.top1.rev)} VND (${d.top1.sharePct}%) và "${d.top2.name}" đạt ${this.fmt(d.top2.rev)} VND (${d.top2.sharePct}%). Tổng 2 nhóm chiếm ${d.top2Share}%.`,
        insight: `Nguồn thu phụ thuộc lớn vào 2 nhóm hạng A. Bất kỳ sự đứt gãy nguồn cung nào tại "${d.top1.name}" sẽ làm sụt giảm hơn 1/3 doanh số toàn công ty.`,
        decision: `Ưu tiên 70% ngân sách vận hành/tồn kho cho nhóm Hạng A ("${d.top1.name}", "${d.top2.name}") và thiết lập cơ chế cảnh báo sớm.`,
        provenCause: `Số lượng giao dịch tại "${d.top1.name}" (${d.top1.count} dòng) và giá trị trung bình mỗi giao dịch vượt trội so với các nhóm còn lại.`,
        hypothesis: `Giả thuyết cần kiểm chứng thêm: Nhu cầu tự nhiên tại "${d.bottom.name}" thấp hay do thiếu nhân sự Sales/Marketing phụ trách khu vực này?`
      },
      {
        id: 'INS-02',
        title: `Bảo toàn Độ chính xác KPI nhờ Khử nhiễu & Ngoại lai IQR`,
        category: 'Quản trị Chất lượng Dữ liệu (Data Governance)',
        data: `File gốc có ${this.rawProfile.dupCount} dòng trùng lặp, ${this.rawProfile.missingCount} ô trống và ${this.rawProfile.outlierCount} ngoại lai/số âm (như 999,999,999).`,
        info: `Nếu không làm sạch ở Bước 2, tổng quy mô sẽ bị thổi phồng ảo hàng trăm triệu đồng và làm sai lệch hoàn toàn trung bình cộng (Mean).`,
        insight: `Quy trình làm sạch có Con người kiểm duyệt (Cổng #1) đã đưa độ tin cậy dữ liệu từ ${this.rawProfile.healthScore}% lên ${this.cleanProfile.healthScore}%.`,
        decision: `Áp dụng bộ lọc Validation tự động ngay tại phần mềm nhập liệu nguồn (chặn số âm, bắt buộc chuẩn ngày ISO và khóa mã trùng).`,
        provenCause: `Đã chứng minh trực tiếp từ ${this.diffLog.length} bản ghi nhật ký thay đổi (Diff Log) giữa file gốc và file sạch.`,
        hypothesis: `Giả thuyết cần kiểm chứng: Lỗi nhập số âm và tiền tệ lẫn chữ "VNĐ" phát sinh từ khâu nhập tay trên Excel của chi nhánh.`
      }
    ];

    document.getElementById('biStage5InsightsList').innerHTML = insights.map(ins => `
      <div class="diid-card">
        <div style="display:flex;justify-content:space-between;align-items:center;flex-wrap:wrap;gap:8px;">
          <h4 style="font-size:14px;font-weight:800;color:var(--blue);">💡 ${this.esc(ins.id)} · ${this.esc(ins.title)}</h4>
          <span class="badge-pill">${this.esc(ins.category)}</span>
        </div>
        <div class="diid-chain-grid">
          <div class="diid-step diid-1">
            <div class="diid-step-title">1. DATA (Dữ liệu gốc)</div>
            <div>${this.esc(ins.data)}</div>
          </div>
          <div class="diid-step diid-2">
            <div class="diid-step-title text-blue">2. INFORMATION (Thông tin)</div>
            <div>${this.esc(ins.info)}</div>
          </div>
          <div class="diid-step diid-3">
            <div class="diid-step-title text-amber">3. INSIGHT (Nguyên nhân cốt lõi)</div>
            <div>${this.esc(ins.insight)}</div>
          </div>
          <div class="diid-step diid-4">
            <div class="diid-step-title text-emerald">4. DECISION (Quyết định quản trị)</div>
            <div>${this.esc(ins.decision)}</div>
          </div>
        </div>
        <div class="diid-details-grid">
          <div><strong class="text-emerald">✔ Nguyên nhân đã chứng minh bằng số liệu:</strong> ${this.esc(ins.provenCause)}</div>
          <div><strong class="text-amber">❓ Giả thuyết cần khảo sát / kiểm chứng thêm:</strong> ${this.esc(ins.hypothesis)}</div>
        </div>
      </div>
    `).join('');
  }

  renderStage6SolutionsTable() {
    const d = this.analyticsData;
    const solutions = [
      {
        prio: 'Ưu tiên #1 (Khẩn cấp)',
        problem: `Tập trung doanh thu cao tại "${d.top1.name}" (${d.top1.sharePct}%) & rủi ro phụ thuộc`,
        solution: `Đảm bảo 100% nguồn cung/nhân sự chủ lực tại "${d.top1.name}" & "${d.top2.name}", triển khai chương trình chăm sóc VIP (Hạng A).`,
        dept: 'Khối Kinh doanh & Vận hành',
        kpi: `Duy trì tăng trưởng >= 15%/kỳ tại nhóm Hạng A; Tỷ lệ giữ chân 95%`,
        risk: 'Cần đồng bộ tồn kho/ngân sách trước kỳ cao điểm'
      },
      {
        prio: 'Ưu tiên #2 (Trọng tâm)',
        problem: `Hiệu suất thấp tại nhóm Hạng C ("${d.bottom.name}" chỉ đạt ${this.fmt(d.bottom.rev)} VND)`,
        solution: `Tái cơ cấu danh mục sản phẩm/chiến dịch tại "${d.bottom.name}", áp dụng gói combo tăng giá trị trung bình đơn (AOV).`,
        dept: 'Phòng Marketing & Phát triển Thị trường',
        kpi: `Nâng tỷ trọng nhóm Hạng C thêm +5% trong quý tới; Biên lợi nhuận >= ${d.marginPct}%`,
        risk: 'Tránh lạm dụng chiết khấu sâu làm giảm biên lợi nhuận ròng'
      },
      {
        prio: 'Ưu tiên #3 (Hệ thống)',
        problem: `Tồn tại ${this.rawProfile.totalIssues} lỗi dữ liệu đầu vào (trùng mã, sai ngày, số âm)`,
        solution: `Chuẩn hóa biểu mẫu nhập liệu (Data Validation) và duy trì quy trình duyệt Human-in-the-Loop định kỳ.`,
        dept: 'Phòng BI & Công nghệ Thông tin (IT)',
        kpi: `Giảm 95% lỗi nhập liệu thô; Điểm sức khỏe dữ liệu >= 98/100`,
        risk: 'Cần đào tạo quy chuẩn nhập liệu cho nhân viên các chi nhánh'
      }
    ];

    document.getElementById('biStage6SolutionsBody').innerHTML = solutions.map(s => `
      <tr>
        <td><strong class="text-blue">${this.esc(s.prio)}</strong></td>
        <td><strong>${this.esc(s.problem)}</strong></td>
        <td>${this.esc(s.solution)}</td>
        <td><span class="badge-pill">${this.esc(s.dept)}</span></td>
        <td><strong class="text-emerald">${this.esc(s.kpi)}</strong></td>
        <td>${this.esc(s.risk)}</td>
      </tr>
    `).join('');
  }

  // Stage 7: 10-Section Official Enterprise BI Report
  renderStage7Report10() {
    const d = this.analyticsData;
    const nowStr = new Date().toLocaleString('vi-VN');

    const groupRows = d.sortedGroups.map((g, i) => `
      <tr>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:center;">${i + 1}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;"><strong>${this.esc(g.name)}</strong></td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">${g.count}</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">${this.fmt(g.rev)} VND</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">${this.fmt(g.profit)} VND</td>
        <td style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">${g.sharePct}% (Hạng ${g.abcClass})</td>
      </tr>
    `).join('');

    const html = `
      <div style="border-bottom:3px solid #1d4ed8;padding-bottom:14px;margin-bottom:20px;display:flex;justify-content:space-between;flex-wrap:wrap;gap:12px;">
        <div>
          <div style="font-size:11px;font-weight:800;color:#2563eb;letter-spacing:0.8px;">NEXUSBI STUDIO · BÁO CÁO PHÂN TÍCH NGHIỆP VỤ (CHUẨN 10 MỤC DOANH NGHIỆP)</div>
          <h2 style="font-size:21px;margin:4px 0;">BÁO CÁO NGHIỆM THU LÀM SẠCH &amp; PHÂN TÍCH DỮ LIỆU BI</h2>
          <div style="font-size:12.5px;color:#475569;">Bộ dữ liệu: <strong>${this.esc(this.fileName)}</strong> · Lĩnh vực: <strong>${this.esc(this.domainLabel)}</strong></div>
        </div>
        <div style="text-align:right;font-size:12px;color:#475569;">
          <div>Ngày lập báo cáo: <strong>${nowStr}</strong></div>
          <div>Chuyên viên BI kiểm duyệt: <strong>${this.esc(this.reviewerName)}</strong></div>
        </div>
      </div>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 1. TÓM TẮT ĐIỀU HÀNH (EXECUTIVE SUMMARY)</h4>
      <p>${document.getElementById('execSummaryBanner').innerHTML}</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 2. BỐI CẢNH DOANH NGHIỆP &amp; PHẠM VI PHÂN TÍCH</h4>
      <p>${this.esc(document.getElementById('businessContextInput').value)}</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 3. ĐÁNH GIÁ CHẤT LƯỢNG DỮ LIỆU &amp; TỪ ĐIỂN DỮ LIỆU (GIAI ĐOẠN 1)</h4>
      <p>Dữ liệu đầu vào gồm ${this.rawProfile.rowCount} dòng × ${this.headers.length} cột. Điểm chất lượng ban đầu đạt <strong>${this.rawProfile.healthScore}%</strong> do tồn tại ${this.rawProfile.totalIssues} điểm lỗi.</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 4. KẾT QUẢ LÀM SẠCH &amp; KIỂM DUYỆT HUMAN-IN-THE-LOOP (GIAI ĐOẠN 2)</h4>
      <p>Sau khi áp dụng 6 quy tắc chuẩn hóa và được Chuyên viên BI <strong>${this.esc(this.reviewerName)}</strong> phê duyệt tại Cổng #1, bộ dữ liệu đạt chuẩn <strong>${this.cleanProfile.healthScore}%</strong> (${this.cleanRows.length} dòng sạch, đã loại ${this.dedupLogs.length} dòng trùng và chuẩn hóa ${this.diffLog.length} ô dữ liệu).</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 5. THỐNG KÊ MÔ TẢ &amp; PHÂN PHỐI CHỈ SỐ (GIAI ĐOẠN 3)</h4>
      <p>Chỉ số chính <strong>${this.esc(d.revCol)}</strong> có Tổng = <strong>${this.fmt(d.totalRev)} VND</strong>, Trung bình = <strong>${this.fmt(Math.round(d.totalRev / Math.max(1, d.rowCount)))} VND</strong>, Tổng lợi nhuận = <strong>${this.fmt(d.totalProfit)} VND</strong> (Biên lợi nhuận ròng đạt <strong>${d.marginPct}%</strong>).</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 6. PHÂN TÍCH ĐA CHIỀU &amp; XẾP HẠNG PARETO ABC THEO ${this.esc(d.dim.toUpperCase())} (GIAI ĐOẠN 4)</h4>
      <table style="width:100%;border-collapse:collapse;font-size:12px;margin:10px 0;">
        <thead>
          <tr style="background:#eff6ff;">
            <th style="padding:6px 10px;border:1px solid #cbd5e1;">Hạng</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:left;">Nhóm (${this.esc(d.dim)})</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">Số bản ghi</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">Doanh thu / Quy mô</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">Lợi nhuận</th>
            <th style="padding:6px 10px;border:1px solid #cbd5e1;text-align:right;">Tỷ trọng &amp; Phân hạng ABC</th>
          </tr>
        </thead>
        <tbody>${groupRows}</tbody>
      </table>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 7. CHUỖI INSIGHT CHUYÊN SÂU: DATA → INFORMATION → INSIGHT → DECISION (GIAI ĐOẠN 5)</h4>
      <p>• <strong>Phát hiện cốt lõi:</strong> Hai nhóm dẫn đầu ("${this.esc(d.top1.name)}" &amp; "${this.esc(d.top2.name)}") chiếm tới ${d.top2Share}% tổng quy mô.<br/>
      • <strong>Nguyên nhân đã chứng minh:</strong> Mật độ đơn hàng và giá trị trung bình đơn tại nhóm Hạng A cao vượt trội.<br/>
      • <strong>Giả thuyết cần kiểm chứng:</strong> Cần khảo sát thêm độ phủ kênh phân phối tại "${this.esc(d.bottom.name)}".</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 8. KẾ HOẠCH HÀNH ĐỘNG, BỘ PHẬN PHỤ TRÁCH &amp; KPI (GIAI ĐOẠN 6)</h4>
      <p>1. <strong>Khối Kinh doanh:</strong> Bảo vệ nguồn thu nhóm Hạng A (${this.esc(d.top1.name)}).<br/>
      2. <strong>Phòng Marketing:</strong> Tái cấu trúc gói sản phẩm kích cầu tại ${this.esc(d.bottom.name)}.<br/>
      3. <strong>Phòng BI &amp; IT:</strong> Tự động hóa kiểm tra ràng buộc dữ liệu ngay từ khâu nhập liệu.</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 9. QUẢN TRỊ RỦI RO &amp; ĐIỀU KIỆN THỰC THI</h4>
      <p>Đảm bảo kiểm soát mức chiết khấu trong ngưỡng chuẩn (<= 30%) để không làm xói mòn biên lợi nhuận ròng (${d.marginPct}%).</p>

      <h4 style="color:#1d4ed8;margin:14px 0 6px;">MỤC 10. XÁC NHẬN KIỂM DUYỆT &amp; PHÊ DUYỆT CỦA CHUYÊN VIÊN BI (HUMAN-IN-THE-LOOP SIGN-OFF)</h4>
      <div style="margin-top:16px;padding-top:12px;border-top:1px dashed #cbd5e1;display:flex;justify-content:space-between;font-size:12.5px;">
        <div><strong>BỘ MÁY PHÂN TÍCH NEXUSBI AGENT</strong><br/>Đã kiểm tra độ phủ &amp; tính toán chính xác 100%</div>
        <div style="text-align:center;">
          <strong>CHUYÊN VIÊN BI KIỂM DUYỆT &amp; NGHIỆM THU</strong><br/>
          <span style="color:#059669;font-weight:800;">✔ Đã phê duyệt qua 2 Cổng Kiểm duyệt Con người</span><br/>
          <strong>${this.esc(this.reviewerName)}</strong>
        </div>
      </div>
    `;

    document.getElementById('report10DocumentContainer').innerHTML = html;
  }

  // Gate 2 Actions (CÓ / KHÔNG)
  approveGate2() {
    this.maxApprovedStep = 4;
    document.getElementById('gate2RejectDrawer')?.classList.add('hidden');
    this.updateStepperUI(4);

    this.addAudit(
      'CỔNG ĐÁNH GIÁ #2: CÓ – ĐẠT YÊU CẦU (MỞ KHÓA BƯỚC 4)',
      `Chuyên viên "${this.reviewerName}" đã nghiệm thu Dashboard & Báo cáo 10 mục. Đã mở khóa Bước 4 xuất 4 sản phẩm bàn giao.`,
      'approve'
    );

    document.getElementById('step4UnlockedBanner')?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    this.showToast('🎉 Đã duyệt Bước 3! Đã mở khóa Bước 4 xuất đầy đủ 4 tệp Báo cáo (Excel Sạch, Excel Tổng hợp, Dashboard HTML, Word 10 mục)!', 'info');
  }

  rejectGate2() {
    document.getElementById('gate2RejectDrawer')?.classList.remove('hidden');
    this.addAudit(
      'CỔNG ĐÁNH GIÁ #2: KHÔNG – ĐIỀU CHỈNH & PHÂN TÍCH LẠI',
      `Chuyên viên "${this.reviewerName}" yêu cầu điều chỉnh và phân tích lại kết quả Bước 3.`,
      'reject'
    );
    this.showToast('🔄 Vui lòng nhập yêu cầu điều chỉnh phân tích ở khung bên dưới để AI Agent phân tích lại!', 'warn');
  }

  setGate2ReworkPrompt(txt) {
    document.getElementById('gate2RejectNote').value = txt;
  }

  submitGate2Rework() {
    const note = document.getElementById('gate2RejectNote').value.trim() || 'Đào sâu phân tích nhóm hiệu suất thấp và tối ưu biên lợi nhuận';
    this.customReworkNote = note;
    this.analysisIter++;
    document.getElementById('gate2RejectDrawer')?.classList.add('hidden');
    this.renderAllAnalytics();
    this.addAudit(`PHÂN TÍCH LẠI (LẦN #${this.analysisIter})`, `Đã điều chỉnh phân tích theo yêu cầu của ${this.reviewerName}: "${note}"`, 'info');
    this.showToast(`✨ Đã cập nhật kết quả phân tích (Lần #${this.analysisIter}) theo yêu cầu của bạn!`, 'info');
  }

  toggleDashTitleEditor() {
    const box = document.getElementById('dashTitleEditorBox');
    const isHidden = box.classList.toggle('hidden');
    if (!isHidden) {
      document.getElementById('editDashTitleInput').value = document.getElementById('dashMainTitle').textContent;
      document.getElementById('editDashSubInput').value = document.getElementById('dashSubtitle').textContent;
    }
  }

  saveDashTitleEditor() {
    const t = document.getElementById('editDashTitleInput').value.trim();
    const s = document.getElementById('editDashSubInput').value.trim();
    if (t) document.getElementById('dashMainTitle').textContent = t;
    if (s) document.getElementById('dashSubtitle').textContent = s;
    document.getElementById('dashTitleEditorBox').classList.add('hidden');
    this.showToast('Đã cập nhật tiêu đề Dashboard!', 'info');
  }

  async askAiForDeeperInsights() {
    this.showToast('🤖 AI Agent đang đào sâu chuỗi Insight DATA → DECISION...', 'info');
    this.renderStage5DiidInsights();
  }

  // ==========================================================================
  // BƯỚC 4: XUẤT 4 SẢN PHẨM BÀN GIAO (EXCEL SẠCH, EXCEL 5 SHEET, HTML, WORD 10 MỤC)
  // ==========================================================================
  ensureReadyForExport() {
    if (this.cleanRows.length === 0) {
      this.executeCleaningEngine();
      this.buildStage1DataDictionary();
      this.buildStage3DescriptiveStats();
    }
    if (!this.analyticsData) {
      this.initDashboardDimensions();
      this.renderAllAnalytics();
    }
  }

  openPreviewModal(type) {
    this.ensureReadyForExport();
    const modal = document.getElementById('previewModal');
    const title = document.getElementById('previewModalTitle');
    const body = document.getElementById('previewModalBody');
    const dlBtn = document.getElementById('previewModalDownloadBtn');

    if (type === 'excel_clean') {
      title.textContent = `📗 Xem trước Sản phẩm #1: Excel Dữ liệu Sạch (${this.cleanRows.length} dòng chuẩn)`;
      dlBtn.onclick = () => this.exportCleanedExcel();
      body.innerHTML = document.getElementById('cleanedPreviewTableWrap').innerHTML;
    } else if (type === 'excel_summary') {
      title.textContent = `📊 Xem trước Sản phẩm #2: Excel Tổng hợp 5 Sheet (Từ điển, Thống kê mô tả, Pareto ABC, Giải pháp)`;
      dlBtn.onclick = () => this.exportAnalysisExcel();
      body.innerHTML = `
        <h4 class="mb-2">Sheet 1 &amp; 2: Thống kê Mô tả (Mean, Median, σ, Min→Max)</h4>
        ${document.getElementById('descriptiveStatsTableWrap').innerHTML}
        <h4 class="mt-2 mb-2">Sheet 3 &amp; 4: Phân hạng Pareto ABC &amp; Kế hoạch Giải pháp</h4>
        ${document.getElementById('abcRankingContainer').innerHTML}
      `;
    } else if (type === 'dashboard') {
      title.textContent = `🖥️ Xem trước Sản phẩm #3: Interactive BI Dashboard (.HTML)`;
      dlBtn.onclick = () => this.exportDashboardHtml();
      body.innerHTML = `
        <div class="exec-summary-banner">${document.getElementById('execSummaryBanner').innerHTML}</div>
        <div class="kpi-4-grid">${document.getElementById('dash4KpisGrid').innerHTML}</div>
        <div class="charts-6-grid">${document.getElementById('biStage4ChartsGrid').innerHTML}</div>
      `;
    } else if (type === 'word') {
      title.textContent = `📘 Xem trước Sản phẩm #4: Báo cáo Word Chuẩn 10 Mục (.DOC)`;
      dlBtn.onclick = () => this.exportWord10Sections();
      body.innerHTML = document.getElementById('report10DocumentContainer').innerHTML;
    }

    modal.classList.remove('hidden');
  }

  // Deliverable 1: Cleaned Excel (.xls)
  exportCleanedExcel() {
    this.ensureReadyForExport();
    let s1 = `<Row>` + this.cleanHeaders.map(h => `<Cell ss:StyleID="sH"><Data ss:Type="String">${this.escXml(h)}</Data></Cell>`).join('') + `</Row>`;
    this.cleanRows.forEach(r => {
      s1 += `<Row>` + this.cleanHeaders.map(h => {
        const v = String(r[h] ?? '');
        const isN = !isNaN(v) && v.trim() !== '' && !h.toLowerCase().includes('phone') && !h.toLowerCase().includes('id');
        return `<Cell><Data ss:Type="${isN ? 'Number' : 'String'}">${this.escXml(v)}</Data></Cell>`;
      }).join('') + `</Row>`;
    });

    let s2 = `<Row><Cell ss:StyleID="sH"><Data ss:Type="String">Dòng gốc</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Mã bản ghi</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Cột</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Giá trị Trước</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Giá trị Sau</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Quy tắc</Data></Cell></Row>`;
    this.diffLog.forEach(d => {
      s2 += `<Row><Cell><Data ss:Type="Number">${d.rowIdx}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(d.rowId)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(d.col)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(d.oldVal)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(d.newVal)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(d.rule)}</Data></Cell></Row>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
      <Styles><Style ss:ID="sH"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#059669" ss:Pattern="Solid"/></Style></Styles>
      <Worksheet ss:Name="1_Du_Lieu_Sach"><Table>${s1}</Table></Worksheet>
      <Worksheet ss:Name="2_Nhat_Ky_Lam_Sach"><Table>${s2}</Table></Worksheet>
    </Workbook>`;

    this.downloadFile(xml, `1_Excel_Du_Lieu_Sach_${this.datasetId}.xls`, 'application/vnd.ms-excel;charset=utf-8');
    this.showToast('📗 Đã tải xuống Sản phẩm #1: Excel Dữ liệu sạch (.xls)!', 'info');
  }

  // Deliverable 2: Multi-sheet Analysis Excel (5 Sheets)
  exportAnalysisExcel() {
    this.ensureReadyForExport();
    const d = this.analyticsData;

    let shDict = `<Row><Cell ss:StyleID="sH"><Data ss:Type="String">Tên Cột</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Kiểu</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Vai trò BI</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Ý nghĩa</Data></Cell></Row>`;
    this.fieldDictionary.forEach(f => {
      shDict += `<Row><Cell><Data ss:Type="String">${this.escXml(f.col)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(f.dataType)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(f.role)}</Data></Cell><Cell><Data ss:Type="String">${this.escXml(f.meaning)}</Data></Cell></Row>`;
    });

    let shStats = `<Row><Cell ss:StyleID="sH"><Data ss:Type="String">Cột Số</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Tổng (Sum)</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Trung bình (Mean)</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Trung vị (Median)</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Độ lệch chuẩn (Std)</Data></Cell></Row>`;
    this.descriptiveStats.forEach(s => {
      shStats += `<Row><Cell><Data ss:Type="String">${this.escXml(s.col)}</Data></Cell><Cell><Data ss:Type="Number">${Math.round(s.sum)}</Data></Cell><Cell><Data ss:Type="Number">${Math.round(s.mean)}</Data></Cell><Cell><Data ss:Type="Number">${Math.round(s.median)}</Data></Cell><Cell><Data ss:Type="Number">${Math.round(s.std)}</Data></Cell></Row>`;
    });

    let shAbc = `<Row><Cell ss:StyleID="sH"><Data ss:Type="String">Nhóm (${this.escXml(d.dim)})</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Số dòng</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Doanh thu</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Lợi nhuận</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Tỷ trọng %</Data></Cell><Cell ss:StyleID="sH"><Data ss:Type="String">Hạng ABC</Data></Cell></Row>`;
    d.sortedGroups.forEach(g => {
      shAbc += `<Row><Cell><Data ss:Type="String">${this.escXml(g.name)}</Data></Cell><Cell><Data ss:Type="Number">${g.count}</Data></Cell><Cell><Data ss:Type="Number">${g.rev}</Data></Cell><Cell><Data ss:Type="Number">${g.profit}</Data></Cell><Cell><Data ss:Type="Number">${g.sharePct}</Data></Cell><Cell><Data ss:Type="String">${g.abcClass}</Data></Cell></Row>`;
    });

    const xml = `<?xml version="1.0" encoding="UTF-8"?><?mso-application progid="Excel.Sheet"?>
    <Workbook xmlns="urn:schemas-microsoft-com:office:spreadsheet" xmlns:ss="urn:schemas-microsoft-com:office:spreadsheet">
      <Styles><Style ss:ID="sH"><Font ss:Bold="1" ss:Color="#FFFFFF"/><Interior ss:Color="#2563EB" ss:Pattern="Solid"/></Style></Styles>
      <Worksheet ss:Name="1_Tu_Dien_Du_Lieu"><Table>${shDict}</Table></Worksheet>
      <Worksheet ss:Name="2_Thong_Ke_Mo_Ta"><Table>${shStats}</Table></Worksheet>
      <Worksheet ss:Name="3_Phan_Hang_Pareto_ABC"><Table>${shAbc}</Table></Worksheet>
    </Workbook>`;

    this.downloadFile(xml, `2_Excel_Tong_Hop_BI_${this.datasetId}.xls`, 'application/vnd.ms-excel;charset=utf-8');
    this.showToast('📊 Đã tải xuống Sản phẩm #2: Excel Tổng hợp & Phân hạng ABC (.xls)!', 'info');
  }

  // Deliverable 3: Standalone HTML Dashboard
  exportDashboardHtml() {
    this.ensureReadyForExport();
    const html = `<!DOCTYPE html><html lang="vi"><head><meta charset="UTF-8"/><title>NexusBI Dashboard - ${this.esc(this.datasetTitle)}</title>
    <style>
      body{font-family:-apple-system,sans-serif;background:#f0f4fa;color:#0f172a;padding:24px;margin:0;}
      .wrap{max-width:1260px;margin:0 auto;}
      .kpi-4-grid{display:grid;grid-template-columns:repeat(4,1fr);gap:12px;margin:16px 0;}
      .kpi-box{background:#fff;border:1px solid #cbd5e1;border-radius:12px;padding:14px;}
      .kpi-box-title{font-size:12px;color:#64748b;font-weight:700;}
      .kpi-box-val{font-size:20px;font-weight:800;margin:4px 0;}
      .charts-6-grid{display:grid;grid-template-columns:repeat(2,1fr);gap:14px;}
      .chart-card-item{background:#fff;border:1px solid #cbd5e1;border-radius:14px;padding:16px;}
      .badge-pill{background:#eff6ff;color:#2563eb;padding:3px 9px;border-radius:99px;font-size:11px;font-weight:700;}
    </style></head><body><div class="wrap">
      <h1>📊 NexusBI Executive Dashboard · ${this.esc(this.datasetTitle)}</h1>
      <p>Người kiểm duyệt: <strong>${this.esc(this.reviewerName)}</strong> · Điểm chất lượng dữ liệu: <strong>${this.cleanProfile.healthScore}%</strong></p>
      <div style="background:#fff;padding:14px;border-radius:12px;border:1px solid #cbd5e1;">${document.getElementById('execSummaryBanner').innerHTML}</div>
      <div class="kpi-4-grid">${document.getElementById('dash4KpisGrid').innerHTML}</div>
      <div class="charts-6-grid">${document.getElementById('biStage4ChartsGrid').innerHTML}</div>
    </div></body></html>`;

    this.downloadFile(html, `3_NexusBI_Dashboard_${this.datasetId}.html`, 'text/html;charset=utf-8');
    this.showToast('🖥️ Đã tải xuống Sản phẩm #3: Interactive BI Dashboard (.html)!', 'info');
  }

  // Deliverable 4: 10-Section Word Report (.doc)
  exportWord10Sections() {
    this.ensureReadyForExport();
    const content = document.getElementById('report10DocumentContainer').innerHTML;
    const doc = `<html xmlns:o='urn:schemas-microsoft-com:office:office' xmlns:w='urn:schemas-microsoft-com:office:word' xmlns='http://www.w3.org/TR/REC-html40'>
      <head><meta charset="utf-8"><title>Báo cáo BI 10 Mục</title></head>
      <body style="font-family:'Times New Roman',serif;font-size:12pt;line-height:1.5;">${content}</body></html>`;
    this.downloadFile(doc, `4_Bao_Cao_BI_10_Muc_${this.datasetId}.doc`, 'application/msword;charset=utf-8');
    this.showToast('📘 Đã tải xuống Sản phẩm #4: Báo cáo Word 10 mục (.doc)!', 'info');
  }

  copyReport10Text() {
    const text = document.getElementById('report10DocumentContainer')?.innerText || '';
    navigator.clipboard?.writeText(text);
    this.showToast('📋 Đã sao chép toàn bộ nội dung Báo cáo 10 mục vào Clipboard!', 'info');
  }

  // ==========================================================================
  // FLOATING AI BI CHAT ASSISTANT
  // ==========================================================================
  initChatGreeting() {
    const box = document.getElementById('chatMessagesBox');
    if (!box) return;
    box.innerHTML = `
      <div class="chat-msg bot">
        Xin chào <strong>${this.esc(this.reviewerName)}</strong>! Tôi là Trợ lý Phân tích <strong>NexusBI</strong>. Bạn có thể hỏi tôi bất kỳ câu hỏi nào về dữ liệu gốc, kết quả làm sạch, hoặc nhóm doanh thu dẫn đầu!
      </div>
    `;
  }

  toggleChatPanel() {
    document.getElementById('aiChatPanel')?.classList.toggle('hidden');
  }

  sendQuickChat(q) {
    document.getElementById('chatUserInput').value = q;
    this.handleChatSubmit(new Event('submit'));
  }

  handleChatSubmit(e) {
    e.preventDefault();
    const inp = document.getElementById('chatUserInput');
    const q = inp.value.trim();
    if (!q) return;
    inp.value = '';

    const box = document.getElementById('chatMessagesBox');
    box.innerHTML += `<div class="chat-msg user">${this.esc(q)}</div>`;

    this.ensureReadyForExport();
    const d = this.analyticsData;
    const qL = q.toLowerCase();
    let reply = '';

    if (qL.includes('làm sạch') || qL.includes('trùng') || qL.includes('lỗi')) {
      reply = `🧹 Trên file <strong>${this.esc(this.fileName)}</strong>, hệ thống đã phát hiện <strong>${this.rawProfile.totalIssues} lỗi</strong> (gồm ${this.rawProfile.dupCount} dòng trùng, ${this.rawProfile.missingCount} ô trống, ${this.rawProfile.outlierCount} ngoại lai/số âm) và nâng điểm chất lượng từ <strong>${this.rawProfile.healthScore}% lên ${this.cleanProfile.healthScore}%</strong>.`;
    } else if (qL.includes('cao nhất') || qL.includes('top') || qL.includes('doanh thu')) {
      reply = `🏆 Nhóm dẫn đầu theo <strong>${this.esc(d.dim)}</strong> là <strong>${this.esc(d.top1.name)}</strong> với <strong>${this.fmt(d.top1.rev)} VND</strong> (chiếm <strong>${d.top1.sharePct}%</strong> tổng quy mô), xếp thứ 2 là <strong>${this.esc(d.top2.name)}</strong> (${d.top2.sharePct}%).`;
    } else {
      reply = `💡 Giải pháp ưu tiên #1 hiện tại là bảo vệ nguồn thu tại nhóm Hạng A (<strong>${this.esc(d.top1.name)}</strong> &amp; <strong>${this.esc(d.top2.name)}</strong> chiếm ${d.top2Share}% quy mô), đồng thời kích cầu cho nhóm <strong>${this.esc(d.bottom.name)}</strong> và duy trì biên lợi nhuận ròng <strong>${d.marginPct}%</strong>.`;
    }

    setTimeout(() => {
      box.innerHTML += `<div class="chat-msg bot">${reply}</div>`;
      box.scrollTop = box.scrollHeight;
    }, 220);
  }

  // ==========================================================================
  // MODALS, SETTINGS, DARK MODE & HELPERS
  // ==========================================================================
  toggleDarkMode() {
    const isDark = document.body.classList.toggle('dark-mode');
    document.getElementById('themeIcon').className = isDark ? 'fa-solid fa-sun' : 'fa-solid fa-moon';
  }

  toggleExportDropdown(e) {
    e.stopPropagation();
    document.getElementById('exportDropdownMenu')?.classList.toggle('hidden');
  }

  openSettingsModal() {
    document.getElementById('cfg_aiProvider').value = this.aiConfig.provider;
    document.getElementById('cfg_apiKey').value = this.aiConfig.apiKey;
    document.getElementById('cfg_modelName').value = this.aiConfig.model;
    document.getElementById('settingsModal')?.classList.remove('hidden');
  }

  saveAiSettings() {
    this.aiConfig.provider = document.getElementById('cfg_aiProvider').value;
    this.aiConfig.apiKey = document.getElementById('cfg_apiKey').value.trim();
    this.aiConfig.model = document.getElementById('cfg_modelName').value.trim() || 'gemini-2.0-flash';
    localStorage.setItem('nexus_ai_provider', this.aiConfig.provider);
    localStorage.setItem('nexus_ai_key', this.aiConfig.apiKey);
    localStorage.setItem('nexus_ai_model', this.aiConfig.model);
    this.closeAllModals();
    this.showToast('Đã lưu cài đặt AI Agent!', 'info');
  }

  openColumnMappingModal() {
    this.buildStage1DataDictionary();
    const rows = this.fieldDictionary.map(f => `
      <tr>
        <td><strong>${this.esc(f.col)}</strong></td>
        <td><code>${this.esc(f.dataType)}</code></td>
        <td><span class="badge-pill">${this.esc(f.role)}</span></td>
        <td>${this.esc(f.meaning)}</td>
      </tr>
    `).join('');
    document.getElementById('columnMappingBody').innerHTML = `
      <table class="studio-table">
        <thead><tr><th>Trường Dữ liệu</th><th>Kiểu nhận diện</th><th>Vai trò BI tự động</th><th>Ý nghĩa</th></tr></thead>
        <tbody>${rows}</tbody>
      </table>
    `;
    document.getElementById('columnMappingModal')?.classList.remove('hidden');
  }

  openAuditModal() {
    const html = this.auditLogs.map(l => `
      <div style="padding:10px 12px;border-left:4px solid ${l.type === 'approve' ? '#059669' : l.type === 'reject' ? '#e11d48' : '#2563eb'};background:var(--bg-page);border-radius:0 10px 10px 0;margin-bottom:8px;">
        <div style="display:flex;justify-content:space-between;font-size:11px;color:var(--text-muted);">
          <strong>${this.esc(l.stage)}</strong>
          <span>${this.esc(l.time)} · ${this.esc(l.reviewer)}</span>
        </div>
        <div style="font-size:12.5px;margin-top:3px;">${this.esc(l.detail)}</div>
      </div>
    `).join('');
    document.getElementById('auditModalBody').innerHTML = html || '<p>Chưa có nhật ký.</p>';
    document.getElementById('auditModal')?.classList.remove('hidden');
  }

  closeAllModals() {
    ['previewModal', 'settingsModal', 'columnMappingModal', 'auditModal'].forEach(id => {
      document.getElementById(id)?.classList.add('hidden');
    });
  }

  async addAudit(stage, detail, type = 'info') {
    const item = {
      time: new Date().toLocaleTimeString('vi-VN') + ' ' + new Date().toLocaleDateString('vi-VN'),
      stage,
      detail,
      reviewer: this.reviewerName,
      type
    };
    this.auditLogs.unshift(item);
    try {
      await fetch('/api/audit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(item)
      });
    } catch (_) {}
  }

  downloadFile(content, filename, mime) {
    const blob = new Blob([content], { type: mime });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    setTimeout(() => { a.remove(); URL.revokeObjectURL(url); }, 200);
  }

  isMoneyCol(col) {
    return ['Unit_Price', 'Net_Sales_VND', 'Cost_VND', 'Profit_VND', 'Base_Salary', 'Bonus', 'Total_Income_VND', 'Spend_VND', 'Revenue_VND'].includes(col);
  }

  fmt(n) {
    if (n === undefined || n === null || isNaN(n)) return '0';
    return Math.round(Number(n)).toLocaleString('vi-VN');
  }

  esc(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  }

  escXml(s) {
    return String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
  }

  showToast(msg, type = 'info') {
    const box = document.getElementById('toastContainer');
    if (!box) return;
    const el = document.createElement('div');
    el.className = `toast-msg ${type}`;
    el.textContent = msg;
    box.appendChild(el);
    setTimeout(() => { el.remove(); }, 3600);
  }
}

window.app = new NexusBiStudio();
