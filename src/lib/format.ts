export function normalizePhone(input: string): string {
  const digits = input.replace(/\D/g, "");
  if (digits.length === 11 && digits.startsWith("8")) {
    return `7${digits.slice(1)}`;
  }
  return digits;
}

export function isValidPhone(digits: string): boolean {
  return digits.length >= 11 && digits.length <= 12;
}

export function formatPhone(digits: string): string {
  if (digits.length === 11 && digits.startsWith("7")) {
    const code = digits.slice(1, 4);
    const part1 = digits.slice(4, 7);
    const part2 = digits.slice(7, 9);
    const part3 = digits.slice(9, 11);
    return `+7 ${code} ${part1}-${part2}-${part3}`;
  }
  return `+${digits}`;
}
