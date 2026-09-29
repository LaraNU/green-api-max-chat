import { ApiError, type StateInstance } from "./types";

export function getErrorMessage(error: unknown): string {
  if (!(error instanceof ApiError)) {
    return "Нет соединения с GREEN-API. Проверьте интернет и idInstance";
  }
  switch (error.status) {
    case 401:
      return "Неверный apiTokenInstance или idInstance";
    case 403:
      return "Неверный idInstance";
    case 400:
      return "Инстанс не авторизован или недоступен. Проверьте его в личном кабинете GREEN-API";
    case 502:
      return "Сервер GREEN-API временно недоступен, попробуйте позже";
    default:
      return `Ошибка GREEN-API (${error.status})`;
  }
}

// https://green-api.com/v3/docs/api/account/GetStateInstance/
const STATE_MESSAGES: Record<Exclude<StateInstance, "authorized">, string> = {
  notAuthorized:
    "Инстанс не авторизован. Отсканируйте QR-код в личном кабинете GREEN-API",
  starting: "Инстанс запускается, это может занять до 5 минут. Попробуйте позже",
  blocked: "Аккаунт MAX заблокирован",
  pendingPassword:
    "Требуется пароль двухфакторной аутентификации. Завершите вход в личном кабинете",
  suspended:
    "Отправка временно ограничена: на номера не из контактов сообщения не уйдут",
};

export function getStateMessage(state: StateInstance): string {
  if (state === "authorized") return "";
  return STATE_MESSAGES[state] ?? `Инстанс недоступен (${state})`;
}
