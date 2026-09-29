import type { Message as MessageType } from "../../api/types";
import styles from "./Message.module.css";

type MessageProps = {
  message: MessageType;
};

export function Message({ message }: MessageProps) {
  return (
    <div className={message.direction === "out" ? styles.rowOut : styles.rowIn}>
      <div className={message.direction === "out" ? styles.bubbleOut : styles.bubbleIn}>
        <span className={styles.text}>{message.text}</span>
      </div>
    </div>
  );
}
