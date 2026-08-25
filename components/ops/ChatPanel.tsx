"use client";

import {
  FormEvent,
  KeyboardEvent,
  useEffect,
  useRef,
  useState,
  type CSSProperties,
} from "react";
import { DOCK_PLACEHOLDER, SUGGESTIONS } from "../../lib/chat";
import { studioHour } from "../../lib/edu";
import { CHAT_MASCOT } from "../../lib/mascot";
import type { ChatMessage } from "../../lib/types";
import "./ChatPanel.css";

type ChatPanelProps = {
  draft: string;
  onDraftChange: (value: string) => void;
  onSubmit: (text: string) => void;
  onNew: () => void;
  onClose?: () => void;
  open?: boolean;
  messages?: ChatMessage[];
};

const TYPE_MS = 26;

const SUGGESTION_MARKS = ["◎", "◈", "♡", "✦"] as const;

function dayPartHello(hour = studioHour()): string {
  if (hour < 12) return "Good morning.";
  if (hour < 18) return "Good afternoon.";
  return "Good evening.";
}

function AgentReply({ id, text }: { id: string; text: string }) {
  const [shown, setShown] = useState("");
  const [done, setDone] = useState(false);
  const nodeRef = useRef<HTMLParagraphElement>(null);

  useEffect(() => {
    const chars = Array.from(text);
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches || chars.length === 0) {
      setShown(text);
      setDone(true);
      return;
    }
    setShown("");
    setDone(false);
    let i = 0;
    const tick = window.setInterval(() => {
      i += 1;
      setShown(chars.slice(0, i).join(""));
      if (i >= chars.length) {
        window.clearInterval(tick);
        setDone(true);
      }
    }, TYPE_MS);
    return () => window.clearInterval(tick);
  }, [id, text]);

  useEffect(() => {
    nodeRef.current?.scrollIntoView({ block: "end", behavior: "smooth" });
  }, [shown]);

  return (
    <p ref={nodeRef} className="ops-chat__bubble ops-chat__bubble--agent" aria-label={text}>
      {shown}
      {done ? null : <span className="ops-chat__type" aria-hidden />}
    </p>
  );
}

export function ChatPanel({
  draft,
  onDraftChange,
  onSubmit,
  onNew,
  onClose,
  open = true,
  messages = [],
}: ChatPanelProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const canSend = draft.trim().length > 0;
  const showWelcome = !messages.some((m) => m.role === "user");
  const [hello, setHello] = useState("Hello.");

  useEffect(() => {
    setHello(dayPartHello());
  }, []);

  function submit(event?: FormEvent) {
    event?.preventDefault();
    const text = draft.trim();
    if (!text) return;
    onSubmit(text);
  }

  function onKeyDown(event: KeyboardEvent<HTMLInputElement>) {
    if (event.key !== "Enter" || event.shiftKey) return;
    event.preventDefault();
    submit();
  }

  return (
    <aside
      id="ops-chat"
      className="ops-chat"
      aria-labelledby="ops-chat-heading"
      aria-hidden={!open}
      {...(!open ? { inert: true } : {})}
    >
      <div className="ops-chat__pane">
      <header className="ops-chat__bar">
        <button type="button" className="ops-chat__title-btn" onClick={onNew}>
          <span id="ops-chat-heading" className="ops-chat__title">
            New conversation
          </span>
          <span className="ops-chat__caret" aria-hidden>
            ▾
          </span>
        </button>
        <button className="ops-chat__icon-btn" type="button" onClick={onNew} aria-label="New conversation">
          <span aria-hidden>+</span>
        </button>
        {onClose ? (
          <button className="ops-chat__icon-btn" type="button" onClick={onClose} aria-label="Close">
            <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" stroke="currentColor" strokeWidth="1.8" aria-hidden>
              <path d="M7 7l10 10M17 7 7 17" strokeLinecap="round" />
            </svg>
          </button>
        ) : null}
      </header>

      <div className="ops-chat__dots" role="log" aria-live="polite" aria-label="Conversation">
        {showWelcome ? (
          <div className="ops-chat__welcome">
            <div className="ops-chat__banner">
              <p>Need more help?</p>
              <button
                type="button"
                className="ops-chat__support"
                onClick={() => inputRef.current?.focus()}
              >
                Contact
              </button>
            </div>
            <div className="ops-chat__hero">
              <img
                className="ops-chat__mascot"
                src={CHAT_MASCOT}
                alt=""
                width={120}
                height={120}
                aria-hidden
              />
              <h2 className="ops-chat__hello">{hello}</h2>
              <p className="ops-chat__sub">What are we doing today?</p>
            </div>
            <ul className="ops-chat__suggest">
              {SUGGESTIONS.map((item, index) => (
                <li
                  key={item.text}
                  className="ops-chat__suggest-item"
                  style={{ "--kuct-chat-delay": `${120 + index * 70}ms` } as CSSProperties}
                >
                  <button type="button" className="ops-chat__tile" onClick={() => onSubmit(item.text)}>
                    <span className="ops-chat__tile-mark" aria-hidden>
                      {SUGGESTION_MARKS[index] ?? "✦"}
                    </span>
                    <span className="ops-chat__tile-copy">
                      <span className="ops-chat__tile-title">{item.title}</span>
                      <span className="ops-chat__tile-hint">{item.hint}</span>
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <div className="ops-chat__thread">
            {messages.map((message) =>
              message.role === "user" ? (
                <p key={message.id} className="ops-chat__bubble ops-chat__bubble--user">
                  {message.text}
                </p>
              ) : (
                <AgentReply key={message.id} id={message.id} text={message.text} />
              ),
            )}
          </div>
        )}
      </div>

      <p className="ops-chat__legal">
        Chats may be recorded to improve the service. Don&apos;t share sensitive data.
      </p>

      <form className="ops-chat__composer" onSubmit={submit}>
        <label className="ops-chat__sr" htmlFor="ops-dock-intent">
          Việc cần làm
        </label>
        <div className="ops-chat__box-wrap">
          <button
            type="button"
            className="ops-chat__ask"
            disabled={!canSend}
            aria-label="Ask"
            onClick={() => submit()}
          >
            <IconSparkle />
            Ask
          </button>
          <input
            ref={inputRef}
            id="ops-dock-intent"
            className="ops-chat__box"
            name="intent"
            placeholder={DOCK_PLACEHOLDER}
            value={draft}
            onChange={(e) => onDraftChange(e.target.value)}
            onKeyDown={onKeyDown}
            autoComplete="off"
          />
          <button className="ops-chat__send" type="submit" aria-label="Send" disabled={!canSend}>
            <IconSend />
          </button>
        </div>
      </form>
      </div>
    </aside>
  );
}

function IconSparkle() {
  return (
    <svg viewBox="0 0 24 24" width="0.875rem" height="0.875rem" fill="none" aria-hidden>
      <path
        d="M12 3.5l1.1 4.2c.15.55.58.98 1.13 1.13L18.5 10l-4.27 1.17c-.55.15-.98.58-1.13 1.13L12 16.5l-1.1-4.2a1.6 1.6 0 00-1.13-1.13L5.5 10l4.27-1.17c.55-.15.98-.58 1.13-1.13L12 3.5z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function IconSend() {
  return (
    <svg viewBox="0 0 24 24" width="1rem" height="1rem" fill="none" aria-hidden>
      <path
        d="M5 12h12M13 6l6 6-6 6"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}
