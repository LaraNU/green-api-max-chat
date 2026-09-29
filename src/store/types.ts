import type { Message } from "../api/types";

export type Chat = {
  chatId: string;
  phone: string;
  name: string;
};

export type State = {
  chats: Chat[];
  messagesByChat: Record<string, Message[]>;
  activeChatId: string | null;
  unread: Record<string, boolean>;
};

export type Action =
  | { type: "addChat"; chat: Chat }
  | { type: "selectChat"; chatId: string }
  | { type: "messageAdded"; message: Message }
  | { type: "reset" };
