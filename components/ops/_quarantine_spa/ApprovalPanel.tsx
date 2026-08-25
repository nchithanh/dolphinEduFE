"use client";

import type { ApprovalStatus, DemoApproval, DemoTask } from "../../lib/types";
import { PageInfo } from "./PageInfo";
import { StatusChip } from "./StatusChip";
import "./chrome.css";
import "./ApprovalPanel.css";

type ApprovalPanelProps = {
  item: DemoApproval;
  others: DemoTask[];
  status: ApprovalStatus;
  onReview: () => void;
  onApprove: () => void;
  onOpen: (id: string) => void;
  onPromo: () => void;
};

export function ApprovalPanel({
  item,
  others,
  status,
  onReview,
  onApprove,
  onOpen,
  onPromo,
}: ApprovalPanelProps) {
  const pending = status === "pending";

  return (
    <section className="ops-approve" aria-labelledby="ops-approve-heading">
      <div className="ops-page__head">
        <h1 id="ops-approve-heading" className="ops-page__title" tabIndex={-1}>
          Cần bạn duyệt
        </h1>
        <StatusChip tone={pending ? "delay" : "done"}>
          {pending ? "Đang chờ phê duyệt" : "Đã duyệt hủy"}
        </StatusChip>
      </div>
      <p className="ops-page__lede">Hủy buổi — AI không tự chạy. Seed demo, chưa ghi server.</p>

      <div className="ops-approve__grid">
        <article className="ops-approve__panel">
          <h2 className="ops-approve__sub">Chi tiết</h2>
          <dl className="ops-info__dl">
            <div>
              <dt>Mã</dt>
              <dd>{item.id}</dd>
            </div>
            <div>
              <dt>Học viên</dt>
              <dd>{item.customer}</dd>
            </div>
            <div>
              <dt>Khóa học</dt>
              <dd>{item.service}</dd>
            </div>
            <div>
              <dt>Giờ</dt>
              <dd>
                <time dateTime={item.time}>{item.time}</time>
              </dd>
            </div>
            <div>
              <dt>Loại</dt>
              <dd>Hủy buổi</dd>
            </div>
          </dl>
          <div className="ops-approve__actions">
            <button className="ops-page__ghost" type="button" onClick={onReview}>
              Xem lại
            </button>
            <button className="ops-page__cta" type="button" onClick={onApprove} disabled={!pending}>
              Duyệt hủy
            </button>
          </div>
          {pending ? null : <p className="ops-approve__notice">Bản demo — chưa ghi server.</p>}
        </article>

        <aside className="ops-approve__panel" aria-labelledby="ops-approve-sum">
          <h2 id="ops-approve-sum" className="ops-approve__sub">
            Tóm tắt
          </h2>
          <p className="ops-approve__body">
            Hủy buổi {item.time} {item.customer} — {item.service}.
          </p>
        </aside>
      </div>

      <h2 className="ops-over__pri-title">Tác vụ khác · seed demo</h2>
      <ul className="ops-res-list">
        {others.map((task) => (
          <li key={task.id}>
            <article className="ops-res">
              <div className="ops-res__head">
                <span className="ops-res__icon" aria-hidden>
                  ✦
                </span>
                <div className="ops-res__copy">
                  <h3>
                    <button type="button" className="ops-res__title" onClick={() => onOpen(task.id)}>
                      {task.customer}
                    </button>
                  </h3>
                  <p className="ops-res__sub">
                    {task.id} · {task.detail}
                  </p>
                </div>
                <span className="ops-res__meta">{task.time}</span>
              </div>
              <div className="ops-res__foot">
                <button type="button" className="ops-res__link" onClick={() => onOpen(task.id)}>
                  Mở duyệt
                </button>
                <span className="ops-res__stats">Hủy buổi</span>
              </div>
            </article>
          </li>
        ))}
      </ul>
      <PageInfo onPromo={onPromo} />
    </section>
  );
}
