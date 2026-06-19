const sanitizePhone = (raw: string): string => {
  return raw
    .replace(/[^\d+]/g, '') // убрать всё кроме цифр и '+'
    .replace(/(?!^)\+/g, ''); // удалить лишние '+'
};

const SIMPLE_PHONE_RE = /^\+?\d+$/;

export const toSimplePhone = (raw: string): string | null => {
  const s = sanitizePhone(raw);
  return SIMPLE_PHONE_RE.test(s) ? s : null;
};

export const buildAction = (name: string, fields: string[]): string => {
  let out = `Action: ${name}\r\n`;
  for (const line of fields) {
    out += `${line}\r\n`;
  }
  out += `\r\n`; // разделитель блока
  return out;
};

export const generateActionId = (prefix = 'c2c'): string => {
  const timestamp = Date.now();
  const rand = Math.floor(Math.random() * 10000)
    .toString()
    .padStart(4, '0');
  return `${prefix}-${timestamp}-${rand}`;
};
