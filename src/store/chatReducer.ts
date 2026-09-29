import type { Message } from "../api/types";
import type { Action, Chat, State } from "./types";

export const initialState: State = {
  chats: [],
  messagesByChat: {},
  activeChatId: null,
  unread: {},
};

function withoutKey<T>(record: Record<string, T>, key: string): Record<string, T> {
  if (!(key in record)) {
    return record;
  }
  const next = { ...record };
  delete next[key];
  return next;
}

function addChat(state: State, chat: Chat): State {
  const exists = state.chats.some((c) => c.chatId === chat.chatId);

  if (exists) {
    return selectChat(state, chat.chatId);
  }

  return {
    ...state,
    chats: [...state.chats, chat],
    activeChatId: chat.chatId,
  };
}

function selectChat(state: State, chatId: string): State {
  if (state.activeChatId === chatId && !state.unread[chatId]) return state;

  return {
    ...state,
    activeChatId: chatId,
    unread: withoutKey(state.unread, chatId),
  };
}

function messageAdded(state: State, message: Message): State {
  const chatExists = state.chats.some((c) => c.chatId === message.chatId);
  if (!chatExists) {
    return state;
  }

  const existingMessages = state.messagesByChat[message.chatId] ?? [];
  const isDuplicate = existingMessages.some((m) => m.idMessage === message.idMessage);
  if (isDuplicate) {
    return state;
  }

  const isUnread = message.direction === "in" && message.chatId !== state.activeChatId;

  return {
    ...state,
    messagesByChat: {
      ...state.messagesByChat,
      [message.chatId]: [...existingMessages, message],
    },
    unread: isUnread ? { ...state.unread, [message.chatId]: true } : state.unread,
  };
}

export function chatReducer(state: State, action: Action): State {
  switch (action.type) {
    case "addChat":
      return addChat(state, action.chat);
    case "selectChat":
      return selectChat(state, action.chatId);
    case "messageAdded":
      return messageAdded(state, action.message);
    case "reset":
      return initialState;
    default:
      return state;
  }
}
