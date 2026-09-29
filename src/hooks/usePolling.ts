import { useEffect } from "react";
import type { Dispatch } from "react";
import { deleteNotification, fromNotification, receiveNotification } from "../api/greenApi";
import { ApiError } from "../api/types";
import type { Credentials } from "../api/types";
import type { Action } from "../store/types";

const RETRY_DELAY_MS = 5000;
const AUTH_ERROR_STATUSES = new Set([401, 403]);

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function usePolling(
  credentials: Credentials | null,
  dispatch: Dispatch<Action>,
  onAuthError: () => void,
) {
  useEffect(() => {
    if (!credentials) return;
    const creds = credentials;

    let active = true;
    const controller = new AbortController();

    async function poll() {
      while (active) {
        try {
          const notification = await receiveNotification(creds, controller.signal);
          if (notification) {
            const message = fromNotification(notification.body);
            if (message) {
              dispatch({ type: "messageAdded", message });
            }
            await deleteNotification(creds, notification.receiptId);
          }
        } catch (err) {
          if (!active) break;
          if (err instanceof ApiError && AUTH_ERROR_STATUSES.has(err.status)) {
            onAuthError();
            break;
          }
          await sleep(RETRY_DELAY_MS);
        }
      }
    }

    void poll();

    return () => {
      active = false;
      controller.abort();
    };
  }, [credentials, dispatch, onAuthError]);
}
