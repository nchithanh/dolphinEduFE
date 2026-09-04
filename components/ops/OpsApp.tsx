"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { CHIP } from "../../lib/chat";
import { cancelClass, enrollStudent, generateClasses } from "../../lib/edu";
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
import { isLiveStage, navItemFromGroups, type NavGroup } from "../../lib/nav";
import { cloneSeedStudioTasks } from "../../lib/tasks-demo";
import type { ChatMessage, ClassFilter, DemoClass, DemoCourse, DemoRoom, DemoStudent, DemoStudioTask, Stage } from "../../lib/types";
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
  const [student, setStudent] = useState<DemoStudent>(DEFAULT_STUDENT);
  const [notice, setNotice] = useState<string | null>(null);
  const [reveal, setReveal] = useState<string | null>(null);
  const revealTimer = useRef<number | null>(null);
  const [locale, setLocaleState] = useState<OpsLocale>("vi");
  const [branchId, setBranchIdState] = useState(ALL_BRANCH_ID);

  const menuGroups = useMemo(() => mapMenuGroups(HARDCODED_MENU, locale), [locale]);
  const orgName = HARDCODED_MENU.organization.name;
  const menuState = "ready" as const;
  const focusKey = canvasKey(stage, studentView, courseForm);

  function setLocale(next: OpsLocale) {
    setLocaleState(next);
    writeStoredLocale(next);
    document.documentElement.lang = next;
  }

  function setBranch(next: string) {
    setBranchIdState(next);
    writeStoredBranch(next);
  }

  const loadMenu = useCallback(() => undefined, []);

  useEffect(() => {
    const stored = readStoredLocale();
    setLocaleState(stored);
    document.documentElement.lang = stored;
    setBranchIdState(readStoredBranch());
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

  const goCourses = () => selectNav("courses");

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
          setNotice("Đã hủy lớp. Demo FE, chưa server.");
        }}
        onOpenCourse={(id) => openCourses({ id: id || null })}
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
      />
    );
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
      branchId={branchId}
      onBranchChange={setBranch}
      canvas={canvas}
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
