import { useState, type SubmitEvent } from "react";
import type { Credentials } from "../../api/types";
import styles from "./LoginForm.module.css";

type LoginFormProps = {
  onLogin: (credentials: Credentials) => void;
  isLoading: boolean;
  error: string | null;
};

export function LoginForm({ onLogin, isLoading, error }: LoginFormProps) {
  const [idInstance, setIdInstance] = useState("");
  const [apiTokenInstance, setApiTokenInstance] = useState("");

  const canSubmit = idInstance.length > 0 && apiTokenInstance.length > 0 && !isLoading;

  function handleSubmit(event: SubmitEvent<HTMLFormElement>) {
    event.preventDefault();
    if (!canSubmit) return;
    onLogin({ idInstance, apiTokenInstance });
  }

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      <h1 className={styles.title}>Вход в MAX-чат</h1>

      <label className={styles.field}>
        <span className={styles.label}>idInstance</span>
        <input
          className={styles.input}
          type="text"
          inputMode="numeric"
          autoComplete="off"
          value={idInstance}
          onChange={(event) => setIdInstance(event.target.value.replace(/\D/g, ""))}
        />
      </label>

      <label className={styles.field}>
        <span className={styles.label}>apiTokenInstance</span>
        <input
          className={styles.input}
          type="password"
          autoComplete="off"
          value={apiTokenInstance}
          onChange={(event) => setApiTokenInstance(event.target.value.trim())}
        />
      </label>

      <button className={styles.submit} type="submit" disabled={!canSubmit}>
        {isLoading ? "Входим…" : "Войти"}
      </button>

      {error && (
        <p className={styles.error} role="alert">
          {error}
        </p>
      )}
    </form>
  );
}
