import { useState } from "react";
import type { FormEvent } from "react";
import { checkAccount } from "../../api/greenApi";
import { getErrorMessage } from "../../api/errors";
import type { Credentials } from "../../api/types";
import { isValidPhone, normalizePhone } from "../../lib/format";
import type { Chat } from "../../store/types";
import { Modal } from "../ui/Modal/Modal";
import styles from "./CreateChatModal.module.css";

type CreateChatModalProps = {
  isOpen: boolean;
  credentials: Credentials;
  onClose: () => void;
  onCreated: (chat: Chat) => void;
};

export function CreateChatModal({
  isOpen,
  credentials,
  onClose,
  onCreated,
}: CreateChatModalProps) {
  const [phone, setPhone] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const canSubmit = phone.trim().length > 0 && !isSubmitting;

  function handleClose() {
    setPhone("");
    setError(null);
    onClose();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;

    const digits = normalizePhone(phone);
    if (!isValidPhone(digits)) {
      setError("Введите номер телефона полностью");
      return;
    }

    setIsSubmitting(true);
    setError(null);

    try {
      const { exist, chatId } = await checkAccount(credentials, Number(digits));
      if (!exist) {
        setError("Номер не зарегистрирован в MAX");
        return;
      }
      onCreated({ chatId, phone: digits });
      handleClose();
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2 className={styles.title}>Новый чат</h2>

        <label className={styles.field}>
          <span className={styles.label}>Номер телефона</span>
          <input
            className={styles.input}
            type="tel"
            autoComplete="off"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </label>

        <button className={styles.submit} type="submit" disabled={!canSubmit}>
          {isSubmitting ? "Создаём…" : "Создать"}
        </button>

        {error && (
          <p className={styles.error} role="alert">
            {error}
          </p>
        )}
      </form>
    </Modal>
  );
}
