import type { Credentials, Message } from "../../api/types";
import type { Chat } from "../../store/types";
import { ChatHeader } from "./ChatHeader";
import styles from "./ChatWindow.module.css";
import { MessageInput } from "./MessageInput";
import { MessagesList } from "./MessagesList";

type ChatWindowProps = {
  chat: Chat;
  credentials: Credentials;
  messages: Message[];
  onMessageSent: (message: Message) => void;
};

export function ChatWindow({
  chat,
  credentials,
  messages,
  onMessageSent,
}: ChatWindowProps) {
  return (
    <div className={styles.window}>
      <ChatHeader phone={chat.phone} />
      <div className={styles.wrapper}>
        <MessagesList messages={messages} />
        <MessageInput
          key={chat.chatId}
          credentials={credentials}
          chatId={chat.chatId}
          onSent={onMessageSent}
        />
      </div>
    </div>
  );
}
