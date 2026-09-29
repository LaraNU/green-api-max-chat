import { useEffect, useRef } from "react";
import type { Message as MessageType } from "../../api/types";
import { Message } from "./Message";
import styles from "./MessagesList.module.css";

type MessagesListProps = {
  messages: MessageType[];
};

export function MessagesList({ messages }: MessagesListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ block: "end" });
  }, [messages]);

  return (
    <div className={styles.list}>
      {messages.map((message) => (
        <Message key={message.idMessage} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
