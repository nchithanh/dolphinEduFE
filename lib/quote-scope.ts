import type { Stage } from "./types";

/** Hạng mục báo giá / discovery — mô tả canvas demo (FE hardcode). */
export type QuoteScopeItem = {
  id: string;
  code: string;
  title: string;
  stage: Stage;
  group: "A" | "setup" | "B1" | "B2";
  asIs: string;
  toBe: string;
  rules: string[];
  who: string;
  howTo: string[];
};

export type GuideFlowStep = {
  n: number;
  title: string;
  note: string;
  stage: Stage;
  tone: "mint" | "peach" | "sky" | "lemon" | "lilac";
};

export type GuideRole = {
  id: string;
  title: string;
  summary: string;
  can: string[];
  cannot: string[];
  tone: GuideFlowStep["tone"];
};

export const GUIDE_FLOW: GuideFlowStep[] = [
  { n: 1, title: "Tạo khóa", note: "Thể loại, level, khung, GV, chi nhánh", stage: "courses", tone: "sky" },
  { n: 2, title: "Ghi danh HV", note: "Cửa sổ tuyển · giữa khóa theo level", stage: "students", tone: "peach" },
  { n: 3, title: "Sinh lớp", note: "Buổi từ lịch tuần · ~8 buổi/tháng", stage: "classes", tone: "lemon" },
  { n: 4, title: "Điểm danh", note: "Có mặt trừ 1 buổi · không học bù", stage: "attendance", tone: "mint" },
  { n: 5, title: "Thu học phí", note: "TM / CK + bill · nợ vẫn vào lớp", stage: "payment", tone: "lilac" },
  { n: 6, title: "Bảo lưu / đổi lớp", note: "QL duyệt · đổi lớp cuối tháng", stage: "holds", tone: "peach" },
];

export const GUIDE_ROLES: GuideRole[] = [
  {
    id: "owner",
    title: "Chủ",
    summary: "Toàn quyền studio · 3 chi nhánh.",
    can: ["Sửa phân quyền", "Xem doanh thu", "Duyệt bảo lưu / nợ"],
    cannot: ["Vẫn theo rule sĩ số · không học bù"],
    tone: "lemon",
  },
  {
    id: "manager",
    title: "Quản lý",
    summary: "Vận hành khóa, lớp, phòng, duyệt nghiệp vụ.",
    can: ["Tạo / sửa khóa", "Đổi giờ–phòng–GV", "Duyệt bảo lưu", "Xem học phí"],
    cannot: ["Sửa ACL (demo: chỉ Chủ)"],
    tone: "sky",
  },
  {
    id: "front",
    title: "Lễ tân",
    summary: "Ghi danh, điểm danh, thu phí tại quầy.",
    can: ["Hồ sơ HV / PH", "Thu học phí + công nợ", "Điểm danh tay / QR", "Chăm sóc Zalo/email"],
    cannot: ["Tạo khóa", "Duyệt bảo lưu", "Báo cáo doanh thu"],
    tone: "peach",
  },
  {
    id: "teacher",
    title: "Giáo viên",
    summary: "Lịch dạy, roster, điểm danh ca của mình.",
    can: ["Xem lớp / khóa", "Điểm danh tay", "Xem liên hệ PH (trẻ em)"],
    cannot: ["Xem học phí & SĐT HV", "Ghi danh / thu phí"],
    tone: "mint",
  },
];

export const GUIDE_OUT: string[] = [
  "Học bù — MA không học bù; vắng không trừ buổi, nghỉ không bảo lưu thì mất buổi.",
  "Matching spa 1 khách : 1 slot (Dolphin Ops) — không dùng cho deal này.",
  "Sprint / epic kiểu Jira trên Tác vụ.",
  "Cổng thanh toán, Zalo OA, SMTP, OAuth Google Calendar thật — demo local, TODO.",
  "Portal / website / store production — canvas B1 chỉ preview.",
];

export const QUOTE_SCOPE: QuoteScopeItem[] = [
  {
    id: "a1",
    code: "A1",
    title: "Nền tảng & phân quyền",
    stage: "access",
    group: "A",
    asIs: "Chủ / QL / lễ tân / GV thao tác rải trên Zalo; không ACL trên file.",
    toBe: "3 chi nhánh · 7 phòng; khóa gắn CN, phòng linh hoạt; 4 vai trò trên CRM.",
    rules: ["GV không xem học phí & SĐT HV", "Khóa cố định chi nhánh", "Phòng đổi trong CN"],
    who: "Chủ sửa ACL · cả 4 vai dùng theo quyền",
    howTo: [
      "Chọn vai trò demo trên CanvasBar (Chủ / QL / Lễ tân / GV) để xem màn hình đổi ngay.",
      "Mở Phân quyền: tab Quyền (24 quyền, 7 nhóm) và Tài khoản (12 TK).",
      "Khóa luôn gắn một chi nhánh; phòng gán theo buổi, đổi trong cùng CN.",
    ],
  },
  {
    id: "a2",
    code: "A2",
    title: "Khóa học & buổi",
    stage: "courses",
    group: "A",
    asIs: "Lịch tuần trên Google Calendar + tin Zalo; buổi hủy báo tay.",
    toBe: "Khóa (thể loại, level, khung, GV, KG–KT, CN) → sinh buổi; hủy / đổi giờ–phòng–GV.",
    rules: ["~8 buổi/tháng", "1 GV / buổi", "Không trùng phòng–giờ", "Hủy buổi → HV không mất buổi"],
    who: "Chủ · QL tạo khóa · lễ tân ghi danh",
    howTo: [
      "Mở Khóa học → tạo khóa: thể loại, level, khung giờ, GV, ngày KG–KT, chi nhánh.",
      "Thêm học viên vào roster khóa (cửa sổ tuyển hoặc giữa khóa).",
      "Bấm Sinh lớp để tạo buổi theo lịch tuần (~8 buổi/tháng).",
      "Một buổi một GV; hệ thống chặn trùng phòng–giờ.",
    ],
  },
  {
    id: "a2-class",
    code: "A2",
    title: "Buổi học",
    stage: "classes",
    group: "A",
    asIs: "Đổi giờ / phòng / GV nhắn nhóm Zalo.",
    toBe: "Sửa buổi trên CRM; chặn trùng phòng–giờ; hủy không trừ buổi gói.",
    rules: ["Trạng thái upcoming / ongoing / completed / cancelled", "Không học bù"],
    who: "QL · lễ tân (đổi giờ/phòng) · GV xem ca",
    howTo: [
      "Mở Lớp học, lọc upcoming / ongoing / completed / cancelled.",
      "Chọn buổi → đổi giờ, phòng hoặc GV trên panel; trùng thì không lưu.",
      "Hủy buổi: học viên không mất buổi gói. MA không học bù.",
    ],
  },
  {
    id: "a3",
    code: "A3",
    title: "Tuyển sinh / ghi danh",
    stage: "leads",
    group: "A",
    asIs: "Nhận giữa khóa theo cảm tính level; lớp đầy thì QL gợi khung khác trên Zalo.",
    toBe: "Cửa sổ ghi danh + rule level + sĩ số 10–15; đầy → gợi ý khóa khác.",
    rules: ["Begin: dừng nhận từ buổi 4–5", "Inter: nhận buổi lẻ", "Advance: buổi 1 & 5", "Đổi lớp cuối tháng"],
    who: "Lễ tân · QL",
    howTo: [
      "Mở Ghi danh giữa khóa khi HV muốn vào khóa đang chạy.",
      "Begin: dừng nhận từ buổi 4–5. Inter: buổi lẻ. Advance: buổi 1 và 5.",
      "Sĩ số 10–15; đầy thì chọn khóa / khung khác — không vượt sĩ số trên demo.",
      "Đổi lớp cuối tháng, hoặc bảo lưu rồi chuyển lớp.",
    ],
  },
  {
    id: "a4",
    code: "A4",
    title: "Học viên & phụ huynh",
    stage: "students",
    group: "A",
    asIs: "Hồ sơ rải Excel; trẻ em liên hệ PH trên Zalo.",
    toBe: "Hồ sơ HV + ngày sinh, email; trẻ em: điểm danh theo tên HV, liên hệ & TT theo PH.",
    rules: ["Nhiều khóa song song", "Nghỉ / hủy ghi danh → giữ hồ sơ"],
    who: "Lễ tân · QL · GV (xem, không SĐT HV)",
    howTo: [
      "Mở Học viên: danh sách rồi hồ sơ 360 (ngày sinh, email, khóa, chuyên cần, học phí).",
      "Trẻ em: điểm danh theo tên HV; liên hệ và thanh toán theo phụ huynh.",
      "Một HV có thể học nhiều khóa. Nghỉ / hủy ghi danh vẫn giữ hồ sơ.",
    ],
  },
  {
    id: "a5",
    code: "A5",
    title: "Giáo viên",
    stage: "teachers",
    group: "A",
    asIs: "GV nghỉ tự tìm người dạy thay, báo QL.",
    toBe: "Hồ sơ GV (style, lớp, CN); buổi nghỉ → gán giáo viên dự phòng trên CRM.",
    rules: ["1 GV / buổi", "Backup không đổi lịch khóa"],
    who: "QL gán ca · GV xem lịch mình",
    howTo: [
      "Mở Giáo viên: hồ sơ, phong cách dạy, chi nhánh, lớp phụ trách.",
      "Buổi GV nghỉ: mở Lớp học / panel buổi → gán giáo viên dự phòng.",
      "Người dạy thay không đổi lịch khóa hay phòng trừ khi QL sửa buổi.",
    ],
  },
  {
    id: "a6",
    code: "A6",
    title: "Gói buổi & trừ buổi",
    stage: "packages",
    group: "A",
    asIs: "Trừ buổi tay sau điểm danh; không học bù.",
    toBe: "Gói 1 / 3 / 6 / 12 tháng; điểm danh có mặt → trừ 1 buổi.",
    rules: ["Không học bù", "Nghỉ không bảo lưu → mất buổi, không hoàn"],
    who: "Lễ tân · QL xem gói · GV không xem số buổi tiền",
    howTo: [
      "Mở Gói buổi để xem gói 1 / 3 / 6 / 12 tháng và buổi còn.",
      "Điểm danh có mặt tự trừ 1 buổi. Vắng không trừ, không học bù.",
      "Nghỉ dài phải mở phiếu bảo lưu; không BL thì mất buổi, không hoàn.",
    ],
  },
  {
    id: "a7",
    code: "A7",
    title: "Thu học phí & công nợ",
    stage: "payment",
    group: "A",
    asIs: "Thu quầy tiền mặt / CK, gửi ảnh bill Zalo; nợ vẫn cho học.",
    toBe: "Phiếu thu 1 lần hoặc từng đợt; TM / CK + ảnh bill; nợ vẫn vào lớp.",
    rules: ["Cọc chỉ gói 6 & 12 tháng", "Báo cáo đã thu / nợ theo CN"],
    who: "Lễ tân thu · QL / Chủ xem · GV không xem tiền",
    howTo: [
      "Mở Thu học phí: phiếu 1 lần hoặc từng đợt, tiền mặt / CK + ảnh bill.",
      "Cọc chỉ với gói 6 và 12 tháng. Nợ vẫn cho vào lớp — thu sau trên phiếu.",
      "Phiếu method Online CRM là hạng mục B2 (cổng demo), khác thu tay quầy.",
    ],
  },
  {
    id: "a8",
    code: "A8",
    title: "Bảo lưu",
    stage: "holds",
    group: "A",
    asIs: "HV xin Zalo → QL duyệt miệng.",
    toBe: "Phiếu BL trên CRM; QL duyệt; giữ chỗ sĩ số; hạn gói + buổi còn.",
    rules: ["≥ 3 tháng tặng BL", "Gói ngắn mua BL lẻ", "Lễ / hủy lớp không tính hạn BL"],
    who: "Lễ tân tạo phiếu · Chủ / QL duyệt",
    howTo: [
      "Mở Bảo lưu, tạo phiếu khi HV đã đóng HP và nghỉ dài.",
      "Gói ≥ 3 tháng: tặng BL. Gói ngắn: mua BL lẻ. Chủ / QL duyệt trên CRM.",
      "Duyệt xong giữ chỗ sĩ số; hạn gói + buổi còn. Lễ / hủy lớp không tính hạn BL.",
    ],
  },
  {
    id: "a9",
    code: "A9",
    title: "Điểm danh tay",
    stage: "attendance",
    group: "A",
    asIs: "Gọi tên / tick giấy.",
    toBe: "Lễ tân / QL đánh có mặt / vắng trên CRM → trừ buổi nếu có mặt.",
    rules: ["HV không tự điểm", "Vắng không trừ (không học bù)"],
    who: "Lễ tân · QL · GV trên ca",
    howTo: [
      "Mở Điểm danh tay, chọn buổi hôm nay (đồng hồ demo 24/08/2026 17:15).",
      "Đánh Có mặt hoặc Vắng từng HV. Có mặt → trừ 1 buổi gói nếu còn.",
      "HV không tự điểm trên CRM. Vắng không trừ, không học bù.",
    ],
  },
  {
    id: "a10",
    code: "A10",
    title: "Điểm danh QR",
    stage: "qr",
    group: "A",
    asIs: "Chưa làm (discovery còn mở cụm QR).",
    toBe: "Mã QR theo buổi — demo quét hộ, chưa camera thật.",
    rules: ["Cùng trừ buổi như điểm danh tay", "TODO: ai quét / cửa sổ giờ"],
    who: "Lễ tân quét hộ · GV xem",
    howTo: [
      "Mở Điểm danh QR: mã SVG theo buổi đang / hôm nay (chưa camera).",
      "Quét hộ = có mặt, trừ buổi giống điểm danh tay.",
      "Cửa sổ giờ và ai được quét còn TODO trên discovery.",
    ],
  },
  {
    id: "a11",
    code: "A11",
    title: "Lịch / Google Calendar",
    stage: "schedule",
    group: "A",
    asIs: "1 lịch Google chung của trung tâm; nội bộ xem.",
    toBe: "Sync buổi CRM → Calendar trung tâm (mock, chưa OAuth).",
    rules: ["Chỉ nội bộ (chủ / GV / NV)", "HV / PH không nhận GCal cá nhân"],
    who: "Chủ / QL bật sync · GV xem lịch trung tâm",
    howTo: [
      "Mở Lịch: một Google Calendar trung tâm, nội bộ studio.",
      "Bật / tắt sync demo từng tài khoản (chưa OAuth).",
      "Học viên / phụ huynh không nhận lịch Google cá nhân.",
    ],
  },
  {
    id: "a12",
    code: "A12",
    title: "Promotion / voucher",
    stage: "promotions",
    group: "A",
    asIs: "KM loan tin Zalo / Facebook.",
    toBe: "Catalog mã giảm / voucher trên CRM.",
    rules: ["Bật / tắt mã", "Hạn dùng"],
    who: "QL quản lý mã · lễ tân xem khi thu",
    howTo: [
      "Mở Promotion: catalog mã giảm / voucher, hạn dùng, lượt dùng demo.",
      "Bật hoặc tắt mã trên bảng — chưa trừ tiền tự động trên phiếu thu.",
    ],
  },
  {
    id: "a13",
    code: "A13",
    title: "Chăm sóc & thông báo",
    stage: "campaigns",
    group: "A",
    asIs: "Chúc SN / nhắc phí nhắn tay.",
    toBe: "Sinh nhật HV; Zalo / email hàng loạt cho HV hoặc PH (demo local).",
    rules: ["Chưa nối Zalo OA / SMTP"],
    who: "Lễ tân · QL",
    howTo: [
      "Mở Chăm sóc: sinh nhật tuần này, Zalo / email hàng loạt (HV hoặc PH).",
      "Gửi là demo local — chưa nối Zalo OA hay SMTP.",
    ],
  },
  {
    id: "a14",
    code: "A14",
    title: "Theo dõi doanh thu",
    stage: "reports",
    group: "A",
    asIs: "Chủ hỏi QL đã thu / nợ theo chi nhánh.",
    toBe: "Báo cáo đã thu · còn nợ · theo gói · theo CN.",
    rules: ["GV không xem số tiền", "Seed tháng 08/2026"],
    who: "Chủ · QL · GV không xem",
    howTo: [
      "Mở Doanh thu: đã thu, còn nợ, theo gói, theo chi nhánh (seed tháng 08/2026).",
      "Đổi vai trò GV trên CanvasBar để thấy số tiền bị ẩn.",
    ],
  },
  {
    id: "rooms",
    code: "A1",
    title: "Phòng tập",
    stage: "classrooms",
    group: "A",
    asIs: "7 phòng; khóa không cố định phòng — đông thì phòng lớn.",
    toBe: "Gán phòng theo buổi; lọc theo chi nhánh.",
    rules: ["Q10: MI1 MI2 MON3 MON4", "Q3: Room A", "PN: MI3 MI4"],
    who: "QL / lễ tân gán phòng theo buổi",
    howTo: [
      "Mở Phòng, lọc theo chi nhánh trên shell.",
      "Gán phòng trên từng buổi (khóa không khóa một phòng cố định).",
      "Q10: MI1, MI2, MON3, MON4 · Q3: Room A · Phú Nhuận: MI3, MI4.",
    ],
  },
  {
    id: "b1-web",
    code: "B1",
    title: "Website công khai",
    stage: "website",
    group: "B1",
    asIs: "Không thuộc vận hành lớp hiện tại.",
    toBe: "Site giới thiệu, admin nội dung, form/Zalo, SEO nền — preview, không login HV/GV.",
    rules: ["Không thu tiền trên site này", "Preview hardcode"],
    who: "Preview — chưa phải site production",
    howTo: [
      "Mở Website công khai để xem mô tả hạng mục (không phải site live).",
      "Không login HV/GV, không thu tiền trên canvas này.",
    ],
  },
  {
    id: "b1-portal",
    code: "B1",
    title: "Portal học viên & giáo viên",
    stage: "portal",
    group: "B1",
    asIs: "HV/PH xin BL / đổi lớp qua Zalo — không tự thao tác CRM.",
    toBe: "Đăng nhập xem lịch, lớp, sĩ số, khóa, hồ sơ, KM, video — chỉ xem.",
    rules: ["Không thu tiền trên portal", "Preview hardcode"],
    who: "Preview — HV/GV chỉ xem (khi làm production)",
    howTo: [
      "Mở Portal HV & GV: mô tả màn hình theo dõi lịch / lớp / KM.",
      "Chỉ xem; bảo lưu và đổi lớp vẫn làm trên CRM nội bộ.",
    ],
  },
  {
    id: "b1-store",
    code: "B1",
    title: "Website bán hàng cơ bản",
    stage: "store",
    group: "B1",
    asIs: "Ngoài as-is lớp–gói.",
    toBe: "Catalog / giỏ / thanh toán cơ bản — preview.",
    rules: ["Không thay thu học phí A7"],
    who: "Preview — ngoài vận hành lớp",
    howTo: [
      "Mở Bán hàng để xem phạm vi catalog / giỏ (preview).",
      "Học phí lớp vẫn thu trên Thu học phí (A7), không thay bằng store.",
    ],
  },
  {
    id: "b1-care",
    code: "B1",
    title: "AI Tuyển sinh & trực page 24/7",
    stage: "care-ai",
    group: "B1",
    asIs: "Lễ tân trực chat ngoài giờ hoặc bỏ lỡ tin.",
    toBe: "Dolphin Care đa kênh (web · Fanpage · Zalo OA) — preview hội thoại.",
    rules: ["Tư vấn lớp / lấy SĐT / hẹn học thử", "Chưa nối OA thật"],
    who: "Preview Care — chưa OA thật",
    howTo: [
      "Mở AI tuyển sinh: hội thoại demo tư vấn lớp / SĐT / hẹn học thử.",
      "Chưa nối Fanpage hay Zalo OA thật.",
    ],
  },
  {
    id: "b2-tasks",
    code: "B2",
    title: "Quản lý tác vụ",
    stage: "tasks",
    group: "B2",
    asIs: "Chia việc trên Zalo.",
    toBe: "Giao việc, hạn, trạng thái, lọc — không Jira sprint/epic.",
    rules: ["Nội bộ studio"],
    who: "Chủ · QL giao · lễ tân / GV nhận việc",
    howTo: [
      "Mở Tác vụ: lọc Việc của tôi / Đang mở / Hôm nay / Quá hạn.",
      "Thêm việc, đổi trạng thái, comment trên panel — không sprint/epic.",
    ],
  },
  {
    id: "b2-pay",
    code: "B2",
    title: "Thanh toán online",
    stage: "payment",
    group: "B2",
    asIs: "Thu quầy (A7).",
    toBe: "Cổng online trên CRM (phiếu method = Online CRM).",
    rules: ["Khác thu tay A7", "Demo local, chưa cổng thật"],
    who: "Lễ tân ghi phiếu Online CRM",
    howTo: [
      "Trên Thu học phí, phiếu method Online CRM là cổng demo (B2).",
      "Khác thu tay tiền mặt / CK + bill (A7). Chưa cổng thanh toán thật.",
    ],
  },
  {
    id: "b2-rent",
    code: "B2",
    title: "Đặt phòng thuê",
    stage: "rentals",
    group: "B2",
    asIs: "Thuê studio ngoài giờ — khác gán phòng lớp.",
    toBe: "Phiếu thuê + xác nhận cọc trên CRM.",
    rules: ["Không trừ buổi HV", "Không phải spa 1:1"],
    who: "Lễ tân · QL",
    howTo: [
      "Mở Đặt phòng thuê khi khách thuê studio ngoài giờ lớp.",
      "Xác nhận cọc trên phiếu. Không trừ buổi học viên, không phải booking spa.",
    ],
  },
  {
    id: "b2-aiops",
    code: "B2",
    title: "AI trợ lý vận hành",
    stage: "ai-ops",
    group: "B2",
    asIs: "Lễ tân nhập form tay.",
    toBe: "Câu lệnh giọng/văn bản → mở form; cảnh báo hết buổi / nợ.",
    rules: ["Demo local", "Không NLU thật"],
    who: "Lễ tân / QL dùng câu lệnh demo",
    howTo: [
      "Mở AI vận hành: chọn câu lệnh demo để mở form thu / cảnh báo hết buổi / nợ.",
      "Không phải NLU thật — keyword local như Ask Dolphin.",
    ],
  },
  {
    id: "b2-intel",
    code: "B2",
    title: "Dolphin Intelligent",
    stage: "intelligent",
    group: "B2",
    asIs: "Sửa data tay khi phát hiện sai.",
    toBe: "Cảnh báo cuối ngày + đề xuất; admin chọn → hệ thống áp dụng (demo).",
    rules: ["Giám sát EOD", "Chưa backend"],
    who: "Chủ / QL duyệt cảnh báo EOD",
    howTo: [
      "Mở Intelligent: cảnh báo cuối ngày + đề xuất (seed demo).",
      "Chọn giải pháp để áp dụng local — chưa backend.",
    ],
  },
];

export const GUIDE_CORE = QUOTE_SCOPE.filter((item) => item.group === "A");

export const GUIDE_ADDON = QUOTE_SCOPE.filter((item) => item.group === "B1" || item.group === "B2");
