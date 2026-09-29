import { useState } from "react";
import type { FormEvent, KeyboardEvent } from "react";
import { getErrorMessage } from "../../api/errors";
import { fromSent, sendMessage } from "../../api/greenApi";
import type { Credentials, Message } from "../../api/types";
import styles from "./MessageInput.module.css";

const MAX_LENGTH = 4000;

type MessageInputProps = {
  credentials: Credentials;
  chatId: string;
  onSent: (message: Message) => void;
};

export function MessageInput({ credentials, chatId, onSent }: MessageInputProps) {
  const [text, setText] = useState("");
  const [isSending, setIsSending] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSend = text.trim().length > 0 && !isSending;

  async function handleSend() {
    if (!canSend) return;

    setIsSending(true);
    setError(null);

    try {
      const { idMessage } = await sendMessage(credentials, chatId, text);
      onSent(fromSent(chatId, text, idMessage));
      setText("");
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSending(false);
    }
  }

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    void handleSend();
  }

  function handleKeyDown(event: KeyboardEvent<HTMLTextAreaElement>) {
    if (event.key === "Enter" && !event.shiftKey) {
      event.preventDefault();
      void handleSend();
    }
  }

  return (
    <div className={styles.wrapper}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.field}>
          <textarea
            className={styles.textarea}
            value={text}
            maxLength={MAX_LENGTH}
            onChange={(event) => setText(event.target.value)}
            onKeyDown={handleKeyDown}
            rows={1}
          />
          <button type="submit" className={styles.send} disabled={!canSend}>
            <svg
              xmlns="http://w3.org"
              viewBox="0 0 24 24"
              width="24"
              height="24"
              fill="currentColor"
            >
              <path d="M12 4L4 12h5v8h6v-8h5L12 4z" />
            </svg>
          </button>
        </div>
        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </div>
  );
}
