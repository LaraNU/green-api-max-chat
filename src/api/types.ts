export type Credentials = {
  idInstance: string;
  apiTokenInstance: string;
};

export type GetStateInstanceResponse = {
  stateInstance: string;
};

export type CheckAccountResponse = {
  exist: boolean;
  chatId: string;
};

export type SendMessageResponse = {
  idMessage: string;
};

export type NotificationBody = {
  typeWebhook: string;
};

export type IncomingMessageBody = {
  typeWebhook: "incomingMessageReceived";
  idMessage: string;
  timestamp: number;
  senderData: {
    chatId: string;
    senderName: string;
  };
  messageData: {
    typeMessage: string;
    textMessageData?: { textMessage: string };
  };
};

export type ReceiveNotificationResponse = {
  receiptId: number;
  body: NotificationBody;
};

export type DeleteNotificationResponse = {
  result: boolean;
  reason: string;
};

export type Message = {
  idMessage: string;
  chatId: string;
  text: string;
  timestamp: number;
  direction: "in" | "out";
};

export type HistoryItem = {
  type: "incoming" | "outgoing";
  idMessage: string;
  timestamp: number;
  chatId: string;
  typeMessage: string;
  textMessage?: string;
};

export class ApiError extends Error {
  readonly status: number;

  constructor(status: number, message: string) {
    super(message);
    this.name = "ApiError";
    this.status = status;
  }
}
