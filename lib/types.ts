export type LiveStage =
  | "overview"
  | "inbox"
  | "classes"
  | "students"
  | "tasks"
  | "teachers"
  | "classrooms"
  | "courses";
export type StubStage =
  | "notifications"
  | "campaigns"
  | "followup"
  | "packages"
  | "reports"
  | "shifts"
  | "attendance"
  | "inventory"
  | "suppliers"
  | "payment"
  | "refunds"
  | "settings"
  | "access"
  | "integrations"
  | "audit"
  | "schedule"
  | "activity"
  | "leads"
  | "consult"
  | "invoices";
export type Stage = LiveStage | StubStage;
export type ToolIntent = LiveStage | "course-form" | "none";
export type ChatView = "list" | "form" | "360" | "enroll" | "generate";
export type ChatExtract = "student" | "course";
export type ClassFilter = ClassStatus | "all";

export type ChatActionDef = {
  id: string;
  phrases: string[];
  stage: LiveStage;
  view: ChatView;
  chip: string;
  taskId?: string;
  extract?: ChatExtract[];
  classFilter?: ClassFilter;
};

export type ChatMatch = {
  id: string;
  stage: LiveStage | "none";
  view: ChatView | "none";
  chip: string;
  taskId?: string;
  classFilter?: ClassFilter;
};

export type ChatRole = "user" | "agent";
export type ChatMessage = {
  id: string;
  role: ChatRole;
  text: string;
  kind?: "text" | "chip";
};

/** JS getDay(): CN=0 … T7=6. UI labels: T2–T7, CN. */
export type Weekday = 0 | 1 | 2 | 3 | 4 | 5 | 6;
export type CourseStatus = "draft" | "recruiting" | "closed";
export type ClassStatus = "upcoming" | "ongoing" | "completed" | "cancelled";
export type StudioTaskStatus = "todo" | "doing" | "done" | "cancelled";
export type StudioTaskPriority = "high" | "mid" | "low";

export type DemoStudioChecklistItem = {
  id: string;
  text: string;
  done: boolean;
};

export type DemoStudioTaskEvent = {
  at: string;
  text: string;
};

export type DemoStudioTaskComment = {
  id: string;
  authorId: string;
  at: string;
  text: string;
};

export type CourseSchedule = {
  weekdays: Weekday[];
  startTime: string;
  endTime: string;
  sessionCount: number;
  firstDate: string;
};

export type DemoTeacher = {
  id: string;
  name: string;
  specialty: string;
};

export type DemoRoom = {
  id: string;
  label: string;
  branchId: string;
  active: boolean;
  note?: string;
};

export type DemoStudent = {
  id: string;
  name: string;
  phone: string;
};

export type DemoCourse = {
  id: string;
  name: string;
  level: string;
  enrollStart: string;
  enrollEnd: string;
  teacherIds: string[];
  roomId: string;
  capacity: number;
  studentIds: string[];
  schedule: CourseSchedule;
  note?: string;
};

export type DemoStudioTask = {
  id: string;
  code: string;
  title: string;
  detail: string;
  note?: string;
  assigneeId: string;
  reporterId: string;
  status: StudioTaskStatus;
  priority: StudioTaskPriority;
  due: string;
  dueTime?: string;
  created: string;
  courseName?: string;
  studentName?: string;
  branchId?: string;
  roomLabel?: string;
  checklist: DemoStudioChecklistItem[];
  history: DemoStudioTaskEvent[];
  comments: DemoStudioTaskComment[];
};

export type DemoClass = {
  id: string;
  courseId: string;
  date: string;
  startTime: string;
  endTime: string;
  teacherId: string;
  roomId: string;
  capacity: number;
  studentIds: string[];
  cancelled: boolean;
};

/** Kept so unused spa clone files still typecheck. */
export type BookingStatus = "confirmed" | "pending" | "incomplete";
export type BookingMissing = "time" | "staff" | "room";
export type VisitStatus = "done" | "cancelled";
export type ApprovalStatus = "pending" | "approved";
export type InboxAiStatus = "waiting" | "draft" | "done";
export type TaskKind = "cancel-class";
export type DemoCustomer = DemoStudent & { visits?: DemoVisit[] };
export type DemoVisit = {
  id: string;
  date: string;
  time: string;
  service: string;
  status: VisitStatus;
};
export type DemoBooking = {
  id: string;
  time: string;
  customer: string;
  service: string;
  status: BookingStatus;
  date?: string;
  staff?: string;
  room?: string;
  duration?: string;
  missing?: BookingMissing[];
  enrolled?: number;
  capacity?: number;
};
export type BookingDraft = {
  customer: string;
  phone: string;
  source: string;
  service: string;
  staff: string;
  room: string;
  date: string;
  time: string;
  duration: string;
  notes: string;
  capacity: string;
};
export type DemoApproval = {
  id: string;
  customer: string;
  service: string;
  time: string;
};
export type DemoInboxMessage = {
  id: string;
  from: "customer" | "ai" | "staff";
  text: string;
};
export type DemoInboxThread = {
  id: string;
  customer: string;
  preview: string;
  aiStatus: InboxAiStatus;
  messages: DemoInboxMessage[];
};
export type DemoTask = {
  id: string;
  kind: TaskKind;
  title: string;
  detail: string;
  customer: string;
  service: string;
  time: string;
};
