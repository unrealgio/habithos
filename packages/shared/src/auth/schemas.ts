import { z } from "zod";

const PASSWORD_MIN_LENGTH = 8;
const PASSWORD_MAX_BYTES = 72;
const DISPLAY_NAME_MIN_LENGTH = 2;
const DISPLAY_NAME_MAX_LENGTH = 50;

function getUtf8ByteLength(value: string): number {
  let bytes = 0;

  for (const character of value) {
    const codePoint = character.codePointAt(0) ?? 0;

    if (codePoint < 0x80) {
      bytes += 1;
    } else if (codePoint < 0x800) {
      bytes += 2;
    } else if (codePoint < 0x10000) {
      bytes += 3;
    } else {
      bytes += 4;
    }
  }

  return bytes;
}

function isValidTimeZone(value: string): boolean {
  try {
    new Intl.DateTimeFormat("en-US", { timeZone: value });
    return true;
  } catch {
    return false;
  }
}

const emailSchema = z.string().trim().toLowerCase().pipe(z.email("Informe um e-mail válido."));

export const registerSchema = z.object({
  email: emailSchema,
  password: z
    .string()
    .min(PASSWORD_MIN_LENGTH, `A senha deve ter pelo menos ${PASSWORD_MIN_LENGTH} caracteres.`)
    .refine((value) => getUtf8ByteLength(value) <= PASSWORD_MAX_BYTES, "A senha é longa demais."),
  displayName: z
    .string()
    .trim()
    .min(
      DISPLAY_NAME_MIN_LENGTH,
      `O nome deve ter pelo menos ${DISPLAY_NAME_MIN_LENGTH} caracteres.`,
    )
    .max(
      DISPLAY_NAME_MAX_LENGTH,
      `O nome deve ter no máximo ${DISPLAY_NAME_MAX_LENGTH} caracteres.`,
    ),
  timezone: z.string().refine(isValidTimeZone, "Fuso horário inválido."),
});

export const loginSchema = z.object({
  email: emailSchema,
  password: z.string().min(1, "Informe a senha."),
});

export type RegisterInput = z.infer<typeof registerSchema>;
export type LoginInput = z.infer<typeof loginSchema>;
