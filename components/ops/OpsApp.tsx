"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHIP } from "../../lib/chat";
import { cancelClass, enrollStudent, generateClasses, patchClass } from "../../lib/edu";
import { resolveChat } from "../../lib/intent";
import {
  DEFAULT_STUDENT,
  DEMO_STUDENTS,
  DEMO_TEACHERS,
  cloneSeedClasses,
  cloneSeedCourses,
  cloneSeedRooms,
  findCourseFromIntent,
  findStudentFromIntent,
  studentByName,
} from "../../lib/seed";
import { HARDCODED_MENU, mapMenuGroups } from "../../lib/api-menu";
import { ALL_BRANCH_ID, readStoredBranch, writeStoredBranch } from "../../lib/branch";
import { CHROME, readStoredLocale, writeStoredLocale, type OpsLocale } from "../../lib/locale";
import { applyDocumentTheme, readStoredTheme, writeStoredTheme, type EduTheme } from "../../lib/theme";
import { isLiveStage, navItemFromGroups, type NavGroup } from "../../lib/nav";
import { quoteScopeForStage } from "../../lib/quote-scope";
import {
  cloneQuoteSeed,
  deductSession,
  markAttendance,
  restoreSession,
} from "../../lib/quote-demo";
import { readStoredRole, writeStoredRole, type DemoRole } from "../../lib/role";
import { cloneSeedStudioTasks } from "../../lib/tasks-demo";
import type {
  ChatMessage,
  ClassFilter,
  DemoClass,
  DemoCourse,
  DemoRoom,
  DemoStudent,
  DemoStudioTask,
  QuoteDemoState,
  Stage,
} from "../../lib/types";
import { AiReveal } from "./AiReveal";
import { ChatPanel } from "./ChatPanel";
import { ClassesBoard } from "./ClassesBoard";
import { ComingSoon } from "./ComingSoon";
import { CoursesBoard } from "./CoursesBoard";
import { Customer360 } from "./Customer360";
import { CustomerList } from "./CustomerList";
import { Overview } from "./Overview";
import { Shell } from "./Shell";
import { RoomsBoard } from "./RoomsBoard";
import { StaffBoard } from "./StaffBoard";
import { TasksBoard } from "./TasksBoard";
import {
  AccessBoard,
  AttendanceDesk,
  CalendarBoard,
  CareBoard,
  HoldsBoard,
  MidEnrollBoard,
  PackagesBoard,
  PaymentsBoard,
  PromosBoard,
  QrBoard,
  RentalsBoard,
  RevenueBoard,
} from "./QuoteBoards";
import {
  AiOpsBoard,
  CareAiPreview,
  IntelligentBoard,
  PortalPreview,
  StorePreview,
  WebsitePreview,
} from "./PreviewBoards";
import { QuoteScopeBanner } from "./QuoteScopeBanner";
import "./nexaflow.css";

const FOCUS: Record<string, string> = {
  overview: "ops-over-heading",
  classes: "ops-classes-heading",
  students: "ops-clist-heading",
  "student-360": "ops-360-heading",
  teachers: "ops-staff-heading",
  classrooms: "ops-rooms-heading",
  courses: "ops-courses-heading",
  "course-form": "ops-courses-heading",
  "course-detail": "ops-courses-heading",
  tasks: "ops-tasks-heading",
  packages: "ops-pack-heading",
  attendance: "ops-att-heading",
  qr: "ops-qr-heading",
  schedule: "ops-cal-heading",
  campaigns: "ops-care-heading",
  promotions: "ops-promo-heading",
  payment: "ops-pay-heading",
  holds: "ops-hold-heading",
  reports: "ops-rev-heading",
  access: "ops-acl-heading",
  leads: "ops-mid-heading",
  rentals: "ops-rent-heading",
  website: "ops-web-heading",
  portal: "ops-portal-heading",
  store: "ops-store-heading",
  "care-ai": "ops-careai-heading",
  "ai-ops": "ops-aiops-heading",
  intelligent: "ops-intel-heading",
};

function focusId(key: string): string {
  return FOCUS[key] ?? "ops-soon-heading";
}

const REVEAL_MS = 1100;
const REVEAL_MS_REDUCED = 280;
const HIDDEN: Stage[] = ["inbox"];

function canvasKey(stage: Stage, studentView: "list" | "360", courseForm: boolean): string {
  if (stage === "students" && studentView === "360") return "student-360";
  if (stage === "courses" && courseForm) return "course-form";
  return stage;
}

function stageTitle(groups: NavGroup[], id: Stage): string {
  return navItemFromGroups(groups, id).label;
}

function revealLabel(key: string, stage: Stage, groups: NavGroup[], locale: OpsLocale): string {
  return CHROME[locale].reveal[key] ?? CHROME[locale].opening(stageTitle(groups, stage));
}

export function OpsApp() {
  const [stage, setStage] = useState<Stage>("overview");
  const [studentView, setStudentView] = useState<"list" | "360">("list");
  const [courseForm, setCourseForm] = useState(false);
  const [courseId, setCourseId] = useState<string | null>(DEMO_COURSES_ID);
  const [classFilter, setClassFilter] = useState<ClassFilter>("all");
  const [draft, setDraft] = useState("");
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [courses, setCourses] = useState<DemoCourse[]>(() => cloneSeedCourses());
  const [classes, setClasses] = useState<DemoClass[]>(() => cloneSeedClasses());
  const [rooms, setRooms] = useState<DemoRoom[]>(() => cloneSeedRooms());
  const [studioTasks, setStudioTasks] = useState<DemoStudioTask[]>(() => cloneSeedStudioTasks());
  const [quote, setQuote] = useState<QuoteDemoState>(() => cloneQuoteSeed());
  const [student, setStudent] = useState<DemoStudent>(DEFAULT_STUDENT);
  const [notice, setNotice] = useState<string | null>(null);
  const [reveal, setReveal] = useState<string | null>(null);
  const revealTimer = useRef<number | null>(null);
  const [locale, setLocaleState] = useState<OpsLocale>("vi");
  const [theme, setThemeState] = useState<EduTheme>("light");
  const [branchId, setBranchIdState] = useState(ALL_BRANCH_ID);
  const [role, setRoleState] = useState<DemoRole>("manager");

  const menuGroups = useMemo(() => mapMenuGroups(HARDCODED_MENU, locale), [locale]);
  const orgName = HARDCODED_MENU.organization.name;
  const menuState = "ready" as const;
  const focusKey = canvasKey(stage, studentView, courseForm);

  function setLocale(next: OpsLocale) {
    setLocaleState(next);
    writeStoredLocale(next);
    document.documentElement.lang = next;
  }

  function setTheme(next: EduTheme) {
    setThemeState(next);
    writeStoredTheme(next);
    applyDocumentTheme(next);
  }

  function setBranch(next: string) {
    setBranchIdState(next);
    writeStoredBranch(next);
  }

  function setRole(next: DemoRole) {
    setRoleState(next);
    writeStoredRole(next);
  }

  const loadMenu = useCallback(() => undefined, []);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    document.documentElement.lang = stored;
    const storedTheme = readStoredTheme();
    setThemeState(storedTheme);
    applyDocumentTheme(storedTheme);
    setBranchIdState(readStoredBranch());
    setRoleState(readStoredRole());
  }, []);

  useEffect(() => {
    if (reveal) return;
    document.getElementById(focusId(focusKey))?.focus();
  }, [focusKey, reveal]);

  useEffect(() => {
    return () => {
      if (revealTimer.current) window.clearTimeout(revealTimer.current);
    };
  }, []);

  function clearReveal() {
    if (revealTimer.current) {
      window.clearTimeout(revealTimer.current);
      revealTimer.current = null;
    }
    setReveal(null);
  }

  function startReveal(label: string) {
    clearReveal();
    setReveal(label);
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    revealTimer.current = window.setTimeout(() => {
      setReveal(null);
      revealTimer.current = null;
    }, reduced ? REVEAL_MS_REDUCED : REVEAL_MS);
  }

  function revealCanvas(nextStage: Stage, nextKey: string) {
    startReveal(revealLabel(nextKey, nextStage, menuGroups, locale));
  }

  function withChip(current: ChatMessage[], text: string): ChatMessage[] {
    return [...current, { id: `a-${current.length}`, role: "agent", text, kind: "chip" }];
  }

  function selectNav(id: Stage) {
    if (HIDDEN.includes(id)) return;
    const nextKey = canvasKey(id, id === "students" ? "list" : studentView, false);
    if (nextKey !== focusKey) revealCanvas(id, nextKey);
    setStage(id);
    if (id === "students") setStudentView("list");
    if (id === "courses") setCourseForm(false);
    setNotice(null);
  }

  function openStudent(next: DemoStudent, thread?: ChatMessage[], chip: string = CHIP.students) {
    const same = stage === "students" && studentView === "360" && student.name === next.name;
    if (!same) revealCanvas("students", "student-360");
    setStudent(next);
    setStudentView("360");
    setStage("students");
    if (thread) setMessages(withChip(thread, chip));
  }

  function openCourses(opts?: { form?: boolean; id?: string | null; thread?: ChatMessage[]; chip?: string }) {
    const form = opts?.form ?? false;
    const nextKey = form ? "course-form" : "courses";
    if (focusKey !== nextKey) revealCanvas("courses", nextKey);
    setStage("courses");
    setCourseForm(form);
    if (opts?.id !== undefined) setCourseId(opts.id);
    if (opts?.thread) setMessages(withChip(opts.thread, opts.chip ?? CHIP.courses));
  }

  function saveCourse(next: DemoCourse) {
    if (!next.id) {
      const id = `crs-${Date.now().toString(36).slice(-5)}`;
      const created = { ...next, id };
      setCourses((current) => [...current, created]);
      setCourseId(id);
      setNotice("Đã tạo khóa. Thêm học viên rồi bấm Sinh lớp. Demo FE, chưa server.");
    } else {
      setCourses((current) => current.map((c) => (c.id === next.id ? { ...next, studentIds: c.studentIds } : c)));
      setCourseId(next.id);
      setNotice("Đã lưu khóa. Demo FE, chưa server.");
    }
    setCourseForm(false);
  }

  function doEnroll(targetCourseId: string, studentId: string, thread?: ChatMessage[], chip?: string) {
    const result = enrollStudent(courses, classes, targetCourseId, studentId);
    if (!result.ok) {
      setNotice(result.reason ?? "Không ghi danh được.");
      openCourses({ id: targetCourseId, thread, chip: result.reason ?? CHIP.none });
      return;
    }
    setCourses(result.courses);
    setClasses(result.classes);
    setCourseId(targetCourseId);
    const who = DEMO_STUDENTS.find((s) => s.id === studentId)?.name ?? studentId;
    const courseName = result.courses.find((c) => c.id === targetCourseId)?.name ?? "khóa";
    setNotice(`Đã thêm ${who} vào ${courseName}.`);
    openCourses({ id: targetCourseId, thread, chip: chip ?? CHIP.enroll });
  }

  function doGenerate(targetCourseId: string, thread?: ChatMessage[], chip?: string) {
    const course = courses.find((c) => c.id === targetCourseId);
    if (!course) return;
    const before = classes.filter((row) => row.courseId === targetCourseId).length;
    const next = generateClasses(course, classes);
    const after = next.filter((row) => row.courseId === targetCourseId).length;
    setClasses(next);
    setCourseId(targetCourseId);
    setNotice(
      after === before
        ? `${course.name} đã đủ ${course.schedule.sessionCount} lớp.`
        : `Đã sinh ${after - before} lớp cho ${course.name}.`,
    );
    openCourses({ id: targetCourseId, thread, chip: chip ?? CHIP.generate });
  }

  function markStudent(classId: string, studentId: string, mark: "present" | "absent") {
    setQuote((current) => {
      const prev = current.attendance[classId]?.[studentId];
      let packages = current.packages;
      if (mark === "present" && prev !== "present") packages = deductSession(packages, studentId);
      if (mark === "absent" && prev === "present") packages = restoreSession(packages, studentId);
      return { ...current, attendance: markAttendance(current.attendance, classId, studentId, mark), packages };
    });
    setNotice(mark === "present" ? "Có mặt — đã trừ 1 buổi gói (nếu còn)." : "Vắng — không trừ buổi, không học bù.");
  }

  function rescheduleClass(classId: string, patch: Partial<Pick<DemoClass, "startTime" | "endTime" | "teacherId" | "roomId">>) {
    const result = patchClass(classes, classId, patch);
    if (result.conflict) {
      setNotice(`Trùng phòng hoặc GV với buổi ${result.conflict.id}. Không lưu.`);
      return;
    }
    setClasses(result.classes);
    setNotice("Đã đổi giờ / phòng / GV. Demo FE.");
  }

  const goCourses = () => selectNav("courses");

  function onSubmit(text: string) {
    const thread: ChatMessage[] = [...messages, { id: `u-${messages.length}`, role: "user", text }];
    const match = resolveChat(text);

    if (match.stage === "none" || match.stage === "inbox") {
      setMessages(withChip(thread, match.stage === "none" ? match.chip : CHIP.none));
    } else if (match.view === "form") {
      setCourseForm(true);
      setStage("courses");
      revealCanvas("courses", "course-form");
      setMessages(withChip(thread, match.chip));
    } else if (match.view === "enroll") {
      const who = findStudentFromIntent(text);
      const course = findCourseFromIntent(text, courses);
      if (course) doEnroll(course.id, who.id, thread, match.chip);
    } else if (match.view === "generate") {
      const course = findCourseFromIntent(text, courses);
      if (course) doGenerate(course.id, thread, match.chip);
    } else if (match.view === "360") {
      openStudent(findStudentFromIntent(text), thread, match.chip);
    } else {
      if (match.stage === "classes" && match.classFilter) setClassFilter(match.classFilter);
      const nextKey = canvasKey(match.stage, match.stage === "students" ? "list" : studentView, false);
      if (nextKey !== focusKey) revealCanvas(match.stage, nextKey);
      setStage(match.stage);
      if (match.stage === "students") setStudentView("list");
      if (match.stage === "courses") setCourseForm(false);
      setMessages(withChip(thread, match.chip));
    }

    setDraft("");
  }

  let canvas;
  if (reveal) {
    canvas = <AiReveal label={reveal} />;
  } else if (stage === "overview") {
    canvas = (
      <Overview
        title={stageTitle(menuGroups, "overview")}
        courses={courses}
        classes={classes}
        students={DEMO_STUDENTS}
        teachers={DEMO_TEACHERS}
        rooms={rooms}
        onOpen={selectNav}
      />
    );
  } else if (stage === "classes") {
    canvas = (
      <ClassesBoard
        title={stageTitle(menuGroups, "classes")}
        classes={classes}
        courses={courses}
        students={DEMO_STUDENTS}
        teachers={DEMO_TEACHERS}
        rooms={rooms}
        filter={classFilter}
        onFilter={setClassFilter}
        onCancel={(id) => {
          setClasses((current) => cancelClass(current, id));
          setNotice("Đã hủy lớp. HV không mất buổi. Demo FE.");
        }}
        onOpenCourse={(id) => openCourses({ id: id || null })}
        attendance={quote.attendance}
        onMark={markStudent}
        onReschedule={rescheduleClass}
        hideFees={role === "teacher"}
        hidePhone={role === "teacher"}
      />
    );
  } else if (stage === "teachers") {
    canvas = (
      <StaffBoard
        title={stageTitle(menuGroups, "teachers")}
        teachers={DEMO_TEACHERS}
        courses={courses}
        classes={classes}
        onPromo={goCourses}
        onCover={(classId, teacherId) => rescheduleClass(classId, { teacherId })}
      />
    );
  } else if (stage === "classrooms") {
    canvas = (
      <RoomsBoard
        title={stageTitle(menuGroups, "classrooms")}
        rooms={rooms}
        classes={classes}
        courses={courses}
        branchId={branchId}
        onChange={setRooms}
        onPromo={goCourses}
      />
    );
  } else if (stage === "tasks") {
    canvas = <TasksBoard title={stageTitle(menuGroups, "tasks")} tasks={studioTasks} onChange={setStudioTasks} />;
  } else if (stage === "courses") {
    canvas = (
      <CoursesBoard
        title={stageTitle(menuGroups, "courses")}
        courses={courses}
        classes={classes}
        students={DEMO_STUDENTS}
        teachers={DEMO_TEACHERS}
        rooms={rooms}
        selectedId={courseId}
        showForm={courseForm}
        notice={notice}
        onSelect={(id) => {
          setCourseId(id);
          setCourseForm(false);
        }}
        onShowForm={setCourseForm}
        onSave={saveCourse}
        onEnroll={(cid, sid) => doEnroll(cid, sid)}
        onGenerate={(cid) => doGenerate(cid)}
        onOpenClasses={() => selectNav("classes")}
      />
    );
  } else if (stage === "students" && studentView === "360") {
    canvas = (
      <Customer360
        student={student}
        courses={courses}
        classes={classes}
        onBack={() => {
          if (focusKey !== "students") revealCanvas("students", "students");
          setStudentView("list");
        }}
        onEnroll={() => openCourses({ id: courses[0]?.id ?? null })}
        onPromo={goCourses}
        role={role}
      />
    );
  } else if (stage === "students") {
    canvas = (
      <CustomerList
        title={stageTitle(menuGroups, "students")}
        students={DEMO_STUDENTS}
        courses={courses}
        teachers={DEMO_TEACHERS}
        onOpen={(name) => openStudent(studentByName(name))}
        onPromo={goCourses}
        role={role}
      />
    );
  } else if (stage === "packages") {
    canvas = <PackagesBoard packages={quote.packages} students={DEMO_STUDENTS} notice={notice} />;
  } else if (stage === "payment") {
    canvas = (
      <PaymentsBoard
        receipts={quote.receipts}
        students={DEMO_STUDENTS}
        role={role}
        notice={notice}
        onCollect={(id) => {
          setQuote((q) => ({
            ...q,
            receipts: q.receipts.map((row) =>
              row.id === id ? { ...row, debt: false, amount: 1200000, method: "cash", note: "Thu nợ demo · tiền mặt" } : row,
            ),
          }));
          setNotice("Đã thu nợ (demo local).");
        }}
      />
    );
  } else if (stage === "holds") {
    canvas = (
      <HoldsBoard
        holds={quote.holds}
        students={DEMO_STUDENTS}
        role={role}
        notice={notice}
        onDecide={(id, status) => {
          setQuote((q) => ({
            ...q,
            holds: q.holds.map((row) => (row.id === id ? { ...row, status } : row)),
          }));
          setNotice(status === "approved" ? "Đã duyệt bảo lưu. Giữ chỗ sĩ số." : "Đã từ chối bảo lưu.");
        }}
      />
    );
  } else if (stage === "attendance") {
    canvas = (
      <AttendanceDesk
        classes={classes}
        courses={courses}
        students={DEMO_STUDENTS}
        attendance={quote.attendance}
        notice={notice}
        onMark={markStudent}
      />
    );
  } else if (stage === "qr") {
    canvas = (
      <QrBoard
        classes={classes}
        courses={courses}
        students={DEMO_STUDENTS}
        attendance={quote.attendance}
        notice={notice}
        onMark={(classId, studentId) => markStudent(classId, studentId, "present")}
      />
    );
  } else if (stage === "schedule") {
    canvas = (
      <CalendarBoard
        links={quote.calendars}
        classes={classes}
        courses={courses}
        teachers={DEMO_TEACHERS}
        rooms={rooms}
        notice={notice}
        onToggle={(id) => {
          setQuote((q) => ({
            ...q,
            calendars: q.calendars.map((row) => (row.id === id ? { ...row, synced: !row.synced } : row)),
          }));
          setNotice("Đã đổi trạng thái sync Google Calendar (demo, chưa OAuth).");
        }}
      />
    );
  } else if (stage === "promotions") {
    canvas = (
      <PromosBoard
        promos={quote.promos}
        notice={notice}
        onToggle={(id) => {
          setQuote((q) => ({
            ...q,
            promos: q.promos.map((row) => (row.id === id ? { ...row, active: !row.active } : row)),
          }));
        }}
      />
    );
  } else if (stage === "campaigns") {
    canvas = (
      <CareBoard
        blasts={quote.blasts}
        notice={notice}
        onSend={(id) => {
          setQuote((q) => ({
            ...q,
            blasts: q.blasts.map((row) => (row.id === id ? { ...row, status: "sent", when: "2026-08-24 17:15" } : row)),
          }));
          setNotice("Đã gửi demo (chưa Zalo OA / SMTP).");
        }}
      />
    );
  } else if (stage === "reports") {
    canvas = <RevenueBoard role={role} />;
  } else if (stage === "access") {
    canvas = <AccessBoard role={role} />;
  } else if (stage === "rentals") {
    canvas = (
      <RentalsBoard
        rentals={quote.rentals}
        rooms={rooms}
        notice={notice}
        onConfirm={(id) => {
          setQuote((q) => ({
            ...q,
            rentals: q.rentals.map((row) => (row.id === id ? { ...row, status: "confirmed" } : row)),
          }));
          setNotice("Đã xác nhận cọc thuê phòng.");
        }}
      />
    );
  } else if (stage === "leads") {
    canvas = (
      <MidEnrollBoard
        courses={courses}
        students={DEMO_STUDENTS}
        notice={notice}
        onEnroll={(cid, sid) => doEnroll(cid, sid)}
      />
    );
  } else if (stage === "website") {
    canvas = <WebsitePreview />;
  } else if (stage === "portal") {
    canvas = <PortalPreview />;
  } else if (stage === "store") {
    canvas = <StorePreview />;
  } else if (stage === "care-ai") {
    canvas = <CareAiPreview />;
  } else if (stage === "ai-ops") {
    canvas = (
      <AiOpsBoard
        packages={quote.packages}
        receipts={quote.receipts}
        students={DEMO_STUDENTS}
        onOpenPayment={() => selectNav("payment")}
      />
    );
  } else if (stage === "intelligent") {
    canvas = <IntelligentBoard />;
  } else if (!isLiveStage(stage) || !navItemFromGroups(menuGroups, stage).ready) {
    canvas = (
      <ComingSoon
        item={navItemFromGroups(menuGroups, stage)}
        onHome={() => selectNav("overview")}
        onPromo={goCourses}
      />
    );
  } else {
    canvas = (
      <ComingSoon
        item={navItemFromGroups(menuGroups, "overview")}
        onHome={() => selectNav("overview")}
        onPromo={goCourses}
      />
    );
  }

  const scopeItem = !reveal && stage !== "overview" ? quoteScopeForStage(stage) : undefined;
  const canvasWithScope =
    scopeItem ? (
      <>
        <QuoteScopeBanner item={scopeItem} />
        {canvas}
      </>
    ) : (
      canvas
    );

  return (
    <Shell
      active={stage}
      canvasKey={focusKey}
      onSelect={selectNav}
      groups={menuGroups}
      orgName={orgName}
      menuState={menuState}
      onRetryMenu={loadMenu}
      locale={locale}
      onLocaleChange={setLocale}
      theme={theme}
      onThemeChange={setTheme}
      branchId={branchId}
      onBranchChange={setBranch}
      role={role}
      onRoleChange={setRole}
      canvas={canvasWithScope}
      chat={
        <ChatPanel
          draft={draft}
          onDraftChange={setDraft}
          onSubmit={onSubmit}
          onNew={() => {
            setDraft("");
            setMessages([]);
          }}
          messages={messages}
        />
      }
    />
  );
}

const DEMO_COURSES_ID = "crs-hiphop";
