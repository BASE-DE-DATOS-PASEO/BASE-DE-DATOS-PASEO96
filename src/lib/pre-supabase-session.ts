"use client";

import { useSyncExternalStore } from "react";

const SESSION_EMAIL_KEY = "paseo96_session_email";
const SESSION_CHANGED_EVENT = "paseo96-session-changed";

function normalizeEmail(email: string) {
  return email.trim().toLowerCase();
}

function readSessionEmail() {
  if (typeof window === "undefined") return "";
  return window.localStorage.getItem(SESSION_EMAIL_KEY) ?? "";
}

function emitSessionChange() {
  window.dispatchEvent(new Event(SESSION_CHANGED_EVENT));
}

export function setSessionEmail(email: string) {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(SESSION_EMAIL_KEY, normalizeEmail(email));
  emitSessionChange();
}

export function clearSessionEmail() {
  if (typeof window === "undefined") return;
  window.localStorage.removeItem(SESSION_EMAIL_KEY);
  emitSessionChange();
}

export function getSessionEmail() {
  return readSessionEmail();
}

export function useSessionEmail() {
  return useSyncExternalStore(
    (onStoreChange) => {
      window.addEventListener("storage", onStoreChange);
      window.addEventListener(SESSION_CHANGED_EVENT, onStoreChange);
      return () => {
        window.removeEventListener("storage", onStoreChange);
        window.removeEventListener(SESSION_CHANGED_EVENT, onStoreChange);
      };
    },
    readSessionEmail,
    () => ""
  );
}
