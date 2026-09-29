import { formatPhone } from "../../lib/format";
import styles from "./ChatHeader.module.css";

type ChatHeaderProps = {
  phone: string;
};

export function ChatHeader({ phone }: ChatHeaderProps) {
  return (
    <div className={styles.header}>
      <span className={styles.phone}>{formatPhone(phone)}</span>
    </div>
  );
}
