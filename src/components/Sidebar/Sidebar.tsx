import type { Message } from "../../api/types";
import type { Chat } from "../../store/types";
import styles from "./Sidebar.module.css";

type SidebarProps = {
  chats: Chat[];
  activeChatId: string | null;
  messagesByChat: Record<string, Message[]>;
  onSelectChat: (chatId: string) => void;
};

export function Sidebar({
  chats,
  activeChatId,
  messagesByChat,
  onSelectChat,
}: SidebarProps) {
  return (
    <aside className={styles.sidebar}>
      <div className={styles.header}>
        <h1 className={styles.title}>Чаты</h1>
        <button type="button" className={styles.newChat}>
          <svg
            xmlns="http://w3.org"
            width="24"
            height="24"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            stroke-linecap="round"
            stroke-linejoin="round"
          >
            <line x1="12" y1="5" x2="12" y2="19"></line>
            <line x1="5" y1="12" x2="19" y2="12"></line>
          </svg>
        </button>
      </div>

      <ul className={styles.list}>
        {chats.length > 0 ? (
          chats.map((chat) => {
            const messages = messagesByChat[chat.chatId];
            const lastMessage = messages?.[messages.length - 1];

            return (
              <li key={chat.chatId}>
                <button
                  type="button"
                  className={
                    chat.chatId === activeChatId ? styles.itemActive : styles.item
                  }
                  onClick={() => onSelectChat(chat.chatId)}
                >
                  <span className={styles.name}>{chat.name}</span>
                  <span className={styles.phone}>{chat.phone}</span>
                  {lastMessage && (
                    <span className={styles.lastMessage}>{lastMessage.text}</span>
                  )}
                </button>
              </li>
            );
          })
        ) : (
          <span>Нет чатов</span>
        )}
      </ul>
    </aside>
  );
}
