import catalog from "../data/chat-actions.json";
import type { ChatActionDef, ChatMatch, ToolIntent } from "./types";

type ChatCatalog = {
  none: { chip: string };
  actions: ChatActionDef[];
};

const FILE = catalog as ChatCatalog;

function haystack(text: string): string {
  return text.normalize("NFC").toLowerCase();
}

function matchesPhrase(text: string, phrase: string): boolean {
  return haystack(text).includes(phrase.normalize("NFC").toLowerCase());
}

export function resolveChat(text: string): ChatMatch {
  const action = FILE.actions.find((item) => item.phrases.some((phrase) => matchesPhrase(text, phrase)));
  if (!action) {
    return { id: "none", stage: "none", view: "none", chip: FILE.none.chip };
  }
  return {
    id: action.id,
    stage: action.stage,
    view: action.view,
    chip: action.chip,
    taskId: action.taskId,
    classFilter: action.classFilter,
  };
}

export function resolveIntent(text: string): ToolIntent {
  const match = resolveChat(text);
  if (match.stage === "none") return "none";
  if (match.view === "form") return "course-form";
  return match.stage;
}

export function actionExtracts(text: string): ChatActionDef["extract"] {
  const action = FILE.actions.find((item) => item.phrases.some((phrase) => matchesPhrase(text, phrase)));
  return action?.extract ?? [];
}
