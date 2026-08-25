"use client";

import {
  CLASS_STATUS_LABEL,
  COURSE_STATUS_LABEL,
  classStatus,
  courseStatus,
  coursesForStudent,
  classesForStudent,
  formatViDate,
} from "../../lib/edu";
import type { DemoClass, DemoCourse, DemoStudent } from "../../lib/types";
import { PageInfo } from "./PageInfo";
import { StatusChip, classChip, courseChip } from "./StatusChip";
import "./chrome.css";
import "./EduTable.css";
import "./Customer360.css";

type Customer360Props = {
  student: DemoStudent;
  courses: DemoCourse[];
  classes: DemoClass[];
  onEnroll: () => void;
  onBack: () => void;
  onPromo: () => void;
};

export function Customer360({ student, courses, classes, onEnroll, onBack, onPromo }: Customer360Props) {
  const enrolled = coursesForStudent(courses, student.id);
  const sessions = classesForStudent(classes, student.id).sort((a, b) =>
    `${a.date}${a.startTime}`.localeCompare(`${b.date}${b.startTime}`),
  );

  return (
    <section className="ops-360" aria-labelledby="ops-360-heading">
      <nav className="ops-crumb" aria-label="Breadcrumb">
        <ol>
          <li>
            <button className="ops-360__back" type="button" onClick={onBack}>
              Học viên
            </button>
          </li>
          <li aria-current="page">{student.name}</li>
        </ol>
      </nav>
      <div className="ops-page__head">
        <div>
          <h1 id="ops-360-heading" className="ops-page__title" tabIndex={-1}>
            {student.name}
          </h1>
          <p className="ops-page__lede">Hồ sơ học viên — khóa đã ghi danh và buổi học. Seed demo.</p>
        </div>
        <button className="ops-page__cta" type="button" onClick={onEnroll}>
          Ghi danh khóa
        </button>
      </div>

      <div className="ops-360__grid">
        <article className="ops-360__panel">
          <h2 className="ops-360__sub">Hồ sơ</h2>
          <dl className="ops-info__dl">
            <div>
              <dt>Mã</dt>
              <dd>{student.id}</dd>
            </div>
            <div>
              <dt>Số điện thoại</dt>
              <dd>
                {student.phone ? (
                  <a href={`tel:${student.phone.replace(/\s/g, "")}`}>{student.phone}</a>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Khóa</dt>
              <dd>{enrolled.length}</dd>
            </div>
          </dl>
          <h3 className="ops-360__sub">Khóa đã ghi danh</h3>
          {enrolled.length ? (
            <ul className="ops-360__courses">
              {enrolled.map((course) => {
                const status = courseStatus(course);
                return (
                  <li key={course.id}>
                    {course.name}{" "}
                    <StatusChip tone={courseChip(status).tone}>{COURSE_STATUS_LABEL[status]}</StatusChip>
                  </li>
                );
              })}
            </ul>
          ) : (
            <p className="ops-360__empty">Chưa ghi danh khóa nào.</p>
          )}
        </article>

        <article className="ops-360__panel">
          <h2 className="ops-360__sub">Buổi học</h2>
          {sessions.length > 0 ? (
            <table className="ops-360__table">
              <thead>
                <tr>
                  <th scope="col">Ngày</th>
                  <th scope="col">Giờ</th>
                  <th scope="col">Khóa</th>
                  <th scope="col">Trạng thái</th>
                </tr>
              </thead>
              <tbody>
                {sessions.map((row) => {
                  const status = classStatus(row);
                  const course = courses.find((c) => c.id === row.courseId);
                  return (
                    <tr key={row.id}>
                      <td>
                        <time dateTime={row.date}>{formatViDate(row.date)}</time>
                      </td>
                      <td>
                        {row.startTime}–{row.endTime}
                      </td>
                      <td>{course?.name ?? row.courseId}</td>
                      <td>
                        <StatusChip tone={classChip(status).tone}>{CLASS_STATUS_LABEL[status]}</StatusChip>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          ) : (
            <p className="ops-360__empty">Chưa có buổi học.</p>
          )}
        </article>
      </div>
      <PageInfo onPromo={onPromo} />
    </section>
  );
}
