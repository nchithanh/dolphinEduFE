export const PHONE_MQ = "(max-width: 47.99rem)";

export function subscribePhone(onChange: () => void) {
  const mq = window.matchMedia(PHONE_MQ);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function getPhoneSnapshot() {
  return window.matchMedia(PHONE_MQ).matches;
}
