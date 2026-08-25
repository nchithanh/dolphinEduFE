"use client";

import { FormEvent, useMemo } from "react";
import { branchName } from "../../lib/branch";
import {
  buildMatchGrid,
  freeRoomsAt,
  MATCH_STAFF,
  missingFactors,
  missingLabel,
  roomLabel,
  staffLabel,
  type RoomResource,
  type SlotBlock,
} from "../../lib/matching";
import {
  BOOKING_DURATIONS,
  BOOKING_SOURCES,
  DEMO_CUSTOMERS,
  formatViDate,
  type BookingOption,
} from "../../lib/seed";
import type { BookingDraft, DemoCourse } from "../../lib/types";
import { PageInfo } from "./PageInfo";
import "./chrome.css";
import "./BookingForm.css";

type BookingFormProps = {
  value: BookingDraft;
  onChange: (next: BookingDraft) => void;
  onConfirm: () => void;
  onBack: () => void;
  onPromo: () => void;
  notice: string | null;
  blocks: SlotBlock[];
  rooms: RoomResource[];
  courses: DemoCourse[];
  onBlockHold: (staffId: string, time: string, roomId: string, date: string) => void;
  onBlockClear: () => void;
};

function optionLabel(options: BookingOption[], id: string): string {
  return options.find((o) => o.id === id)?.label ?? "—";
}

function dash(value: string): string {
  const t = value.trim();
  return t || "—";
}

export function BookingForm({
  value,
  onChange,
  onConfirm,
  onBack,
  onPromo,
  notice,
  blocks,
  rooms,
  courses,
  onBlockHold,
  onBlockClear,
}: BookingFormProps) {
  function set<K extends keyof BookingDraft>(key: K, field: BookingDraft[K]) {
    onChange({ ...value, [key]: field });
  }

  function submit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    onConfirm();
  }

  const dateLabel = /^\d{4}-\d{2}-\d{2}$/.test(value.date) ? formatViDate(value.date) : dash(value.date);
  const missing = missingFactors(value);
  const statusHint = missing.length === 0 ? "Đủ 3 yếu tố — sẽ xác nhận" : missingLabel(missing);

  const grid = useMemo(
    () => buildMatchGrid(blocks, value.date, value.duration, "hold"),
    [blocks, value.date, value.duration],
  );

  const roomsFree = useMemo(() => {
    if (!value.time || !value.staff) return [];
    return freeRoomsAt(blocks, value.date, value.time, value.duration, rooms, "hold");
  }, [blocks, value.date, value.time, value.staff, value.duration, rooms]);

  function pickSlot(staffId: string, time: string) {
    const next = { ...value, staff: staffId, time, room: "" };
    onChange(next);
    onBlockHold(staffId, time, "", value.date);
  }

  function pickRoom(roomId: string) {
    onChange({ ...value, room: roomId });
    if (value.staff && value.time) onBlockHold(value.staff, value.time, roomId, value.date);
  }

  function clearMatch() {
    onChange({ ...value, staff: "", time: "", room: "" });
    onBlockClear();
  }

  return (
    <section className="ops-book" aria-labelledby="ops-booking-heading">
      <div className="ops-page__head">
        <h1 id="ops-booking-heading" className="ops-page__title" tabIndex={-1}>
          Lớp mới
        </h1>
        <button className="ops-page__ghost" type="button" onClick={onBack}>
          Hủy
        </button>
      </div>
      <p className="ops-page__lede">
        Matching demo — chọn slot trống (GV + giờ), rồi phòng tập. Thiếu yếu tố → incomplete.
      </p>

      <div className="ops-book__grid">
        <form className="ops-book__form" onSubmit={submit}>
          <fieldset className="ops-book__block">
            <legend>Học viên</legend>
            <div className="ops-book__cols">
              <p className="ops-book__field">
                <label htmlFor="ops-book-customer">Tên</label>
                <input
                  id="ops-book-customer"
                  name="customer"
                  list="ops-book-customers"
                  value={value.customer}
                  onChange={(e) => set("customer", e.target.value)}
                  autoComplete="off"
                />
                <datalist id="ops-book-customers">
                  {DEMO_CUSTOMERS.map((c) => (
                    <option key={c.id} value={c.name} />
                  ))}
                </datalist>
              </p>
              <p className="ops-book__field">
                <label htmlFor="ops-book-phone">SĐT</label>
                <input
                  id="ops-book-phone"
                  name="phone"
                  type="tel"
                  value={value.phone}
                  onChange={(e) => set("phone", e.target.value)}
                  autoComplete="off"
                />
              </p>
              <p className="ops-book__field">
                <label htmlFor="ops-book-source">Nguồn</label>
                <select
                  id="ops-book-source"
                  name="source"
                  value={value.source}
                  onChange={(e) => set("source", e.target.value)}
                >
                  {BOOKING_SOURCES.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </p>
            </div>
          </fieldset>

          <fieldset className="ops-book__block">
            <legend>Khóa học & ngày</legend>
            <div className="ops-book__cols">
              <p className="ops-book__field">
                <label htmlFor="ops-book-service">Khóa học</label>
                <select
                  id="ops-book-service"
                  name="service"
                  value={value.service}
                  onChange={(e) => set("service", e.target.value)}
                >
                  <option value="">Chọn khóa</option>
                  {courses.map((c) => (
                    <option key={c.id} value={c.name}>
                      {c.name}
                    </option>
                  ))}
                </select>
              </p>
              <p className="ops-book__field">
                <label htmlFor="ops-book-date">Ngày</label>
                <input
                  id="ops-book-date"
                  name="date"
                  type="date"
                  value={value.date}
                  onChange={(e) => {
                    onChange({ ...value, date: e.target.value, staff: "", time: "", room: "" });
                    onBlockClear();
                  }}
                />
              </p>
              <p className="ops-book__field">
                <label htmlFor="ops-book-duration">Thời lượng</label>
                <select
                  id="ops-book-duration"
                  name="duration"
                  value={value.duration}
                  onChange={(e) => {
                    onChange({ ...value, duration: e.target.value, staff: "", time: "", room: "" });
                    onBlockClear();
                  }}
                >
                  {BOOKING_DURATIONS.map((o) => (
                    <option key={o.id} value={o.id}>
                      {o.label}
                    </option>
                  ))}
                </select>
              </p>
              <p className="ops-book__field">
                <label htmlFor="ops-book-capacity">Sĩ số</label>
                <input
                  id="ops-book-capacity"
                  name="capacity"
                  type="number"
                  min="1"
                  max="40"
                  value={value.capacity}
                  onChange={(e) => set("capacity", e.target.value)}
                />
              </p>
            </div>
          </fieldset>

          <fieldset className="ops-book__block">
            <legend>1 · Slot trống (GV + giờ)</legend>
            <p className="ops-book__hint">
              Ô xanh = trống. Chọn một ô để block tạm giáo viên ở khung giờ đó.
            </p>
            <div className="ops-match" role="region" aria-label="Bảng slot trống theo giáo viên">
              <div className="ops-match__head" aria-hidden>
                <span className="ops-match__corner">Giờ</span>
                {MATCH_STAFF.map((s) => (
                  <span key={s.id} className="ops-match__col">
                    {s.name}
                  </span>
                ))}
              </div>
              <div className="ops-match__body">
                {[...new Set(grid.map((c) => c.time))].map((time) => (
                  <div key={time} className="ops-match__row">
                    <span className="ops-match__time">{time}</span>
                    {MATCH_STAFF.map((s) => {
                      const cell = grid.find((g) => g.time === time && g.staffId === s.id);
                      const free = cell?.free ?? false;
                      const selected = value.staff === s.id && value.time === time;
                      return (
                        <button
                          key={`${time}-${s.id}`}
                          type="button"
                          className={
                            selected
                              ? "ops-match__cell ops-match__cell--on"
                              : free
                                ? "ops-match__cell ops-match__cell--free"
                                : "ops-match__cell ops-match__cell--busy"
                          }
                          disabled={!free && !selected}
                          aria-pressed={selected}
                          onClick={() => (selected ? clearMatch() : pickSlot(s.id, time))}
                        >
                          {selected ? "Đang giữ" : free ? "Trống" : "Bận"}
                        </button>
                      );
                    })}
                  </div>
                ))}
              </div>
            </div>
            {(value.staff || value.time) && (
              <p className="ops-book__pick">
                Đã chọn: <strong>{staffLabel(value.staff)}</strong> · <strong>{value.time || "—"}</strong>
                <button type="button" className="ops-book__clear" onClick={clearMatch}>
                  Bỏ chọn
                </button>
              </p>
            )}
          </fieldset>

          <fieldset className="ops-book__block">
            <legend>2 · Phòng tập</legend>
            {!value.staff || !value.time ? (
              <p className="ops-book__hint">Chọn slot GV + giờ trước.</p>
            ) : roomsFree.length === 0 ? (
              <p className="ops-book__hint">Không còn phòng trống khung này — chọn slot khác.</p>
            ) : (
              <div className="ops-book__rooms" role="group" aria-label="Phòng tập trống">
                {roomsFree.map((r) => {
                  const on = value.room === r.id;
                  return (
                    <button
                      key={r.id}
                      type="button"
                      className={on ? "ops-book__room ops-book__room--on" : "ops-book__room"}
                      aria-pressed={on}
                      onClick={() => pickRoom(r.id)}
                    >
                      <span>{r.label}</span>
                      <span className="ops-book__room-kind">
                        {r.kind === "bed" ? "Floor / kids" : "Studio"}
                        {` · ${branchName(r.branchId)}`}
                      </span>
                    </button>
                  );
                })}
              </div>
            )}
          </fieldset>

          <p className="ops-book__field ops-book__notes">
            <label htmlFor="ops-book-notes">Ghi chú</label>
            <textarea
              id="ops-book-notes"
              name="notes"
              rows={2}
              value={value.notes}
              onChange={(e) => set("notes", e.target.value)}
            />
          </p>

          <p className={`ops-book__status ${missing.length ? "ops-book__status--warn" : "ops-book__status--ok"}`}>
            {statusHint}
          </p>

          <div className="ops-book__actions">
            <button className="ops-page__ghost" type="button" onClick={onBack}>
              Hủy
            </button>
            <button className="ops-page__cta" type="submit">
              {missing.length ? "Lưu (thiếu yếu tố)" : "Xác nhận lớp"}
            </button>
          </div>
          {notice ? <p className="ops-book__notice">{notice}</p> : null}
        </form>

        <aside className="ops-book__aside" aria-labelledby="ops-book-sum-heading">
          <h2 id="ops-book-sum-heading" className="ops-book__aside-title">
            Tóm tắt
          </h2>
          <dl className="ops-book__dl">
            <div>
              <dt>Học viên</dt>
              <dd>{dash(value.customer)}</dd>
            </div>
            <div>
              <dt>SĐT</dt>
              <dd>{dash(value.phone)}</dd>
            </div>
            <div>
              <dt>Nguồn</dt>
              <dd>{optionLabel(BOOKING_SOURCES, value.source)}</dd>
            </div>
            <div>
              <dt>Khóa học</dt>
              <dd>{dash(value.service)}</dd>
            </div>
            <div>
              <dt>Giáo viên</dt>
              <dd>{staffLabel(value.staff)}</dd>
            </div>
            <div>
              <dt>Phòng tập</dt>
              <dd>{roomLabel(value.room, rooms)}</dd>
            </div>
            <div>
              <dt>Sĩ số</dt>
              <dd>{dash(value.capacity)}</dd>
            </div>
            <div>
              <dt>Ngày</dt>
              <dd>
                {value.date ? (
                  <time dateTime={value.date}>{dateLabel}</time>
                ) : (
                  "—"
                )}
              </dd>
            </div>
            <div>
              <dt>Giờ</dt>
              <dd>
                {value.time ? <time dateTime={value.time}>{value.time}</time> : "—"}
              </dd>
            </div>
            <div>
              <dt>Thời lượng</dt>
              <dd>{optionLabel(BOOKING_DURATIONS, value.duration)}</dd>
            </div>
            <div>
              <dt>Trạng thái</dt>
              <dd>{missing.length ? "Incomplete" : "Đủ · xác nhận"}</dd>
            </div>
          </dl>
        </aside>
      </div>
      <PageInfo onPromo={onPromo} />
    </section>
  );
}
