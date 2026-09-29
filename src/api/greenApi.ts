import {
  ApiError,
  type CheckAccountResponse,
  type Credentials,
  type DeleteNotificationResponse,
  type GetStateInstanceResponse,
  type HistoryItem,
  type IncomingMessageBody,
  type Message,
  type NotificationBody,
  type ReceiveNotificationResponse,
  type SendMessageResponse,
} from "./types";

const API_HOST_ID_LENGTH = 4;
const UNSUPPORTED_TEXT = "Неподдерживаемый тип сообщения";
const TEXT_TYPES = ["textMessage", "extendedTextMessage"];

function buildApiUrl(idInstance: string): string {
  const hostId = idInstance.slice(0, API_HOST_ID_LENGTH);
  return `https://${hostId}.api.green-api.com`;
}

function buildUrl(creds: Credentials, method: string): string {
  return `${buildApiUrl(creds.idInstance)}/waInstance${creds.idInstance}/${method}/${creds.apiTokenInstance}`;
}

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const response = await fetch(url, init);

  if (!response.ok) {
    const text = await response.text().catch(() => "");
    throw new ApiError(response.status, text || response.statusText);
  }

  return (await response.json()) as T;
}

export async function getStateInstance(
  creds: Credentials,
): Promise<GetStateInstanceResponse> {
  return request<GetStateInstanceResponse>(buildUrl(creds, "getStateInstance"));
}

export async function checkAccount(
  creds: Credentials,
  phoneNumber: number,
): Promise<CheckAccountResponse> {
  return request<CheckAccountResponse>(buildUrl(creds, "checkAccount"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phoneNumber }),
  });
}

export async function sendMessage(
  creds: Credentials,
  chatId: string,
  message: string,
): Promise<SendMessageResponse> {
  return request<SendMessageResponse>(buildUrl(creds, "sendMessage"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, message }),
  });
}

export async function receiveNotification(
  creds: Credentials,
  signal?: AbortSignal,
): Promise<ReceiveNotificationResponse | null> {
  return request<ReceiveNotificationResponse | null>(
    `${buildUrl(creds, "receiveNotification")}?receiveTimeout=20`,
    { signal },
  );
}

export async function deleteNotification(
  creds: Credentials,
  receiptId: number,
): Promise<DeleteNotificationResponse> {
  return request<DeleteNotificationResponse>(
    `${buildUrl(creds, "deleteNotification")}/${receiptId}`,
    {
      method: "DELETE",
    },
  );
}

export function getChatHistory(creds: Credentials, chatId: string, count = 100) {
  return request<HistoryItem[]>(buildUrl(creds, "getChatHistory"), {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chatId, count }),
  });
}

export function fromHistory(item: HistoryItem): Message {
  const isText = TEXT_TYPES.includes(item.typeMessage);
  return {
    idMessage: item.idMessage,
    chatId: item.chatId,
    text: isText ? (item.textMessage ?? "") : UNSUPPORTED_TEXT,
    timestamp: item.timestamp,
    direction: item.type === "outgoing" ? "out" : "in",
  };
}

export function isIncomingMessage(body: NotificationBody): body is IncomingMessageBody {
  return body.typeWebhook === "incomingMessageReceived";
}

export function fromNotification(body: NotificationBody): Message | null {
  if (!isIncomingMessage(body)) return null;
  return {
    idMessage: body.idMessage,
    chatId: body.senderData.chatId,
    text: body.messageData.textMessageData?.textMessage ?? UNSUPPORTED_TEXT,
    timestamp: body.timestamp,
    direction: "in",
  };
}

export function fromSent(chatId: string, text: string, idMessage: string): Message {
  return {
    idMessage,
    chatId,
    text,
    timestamp: Math.floor(Date.now() / 1000),
    direction: "out",
  };
}
