import { AppError } from "../errors/app-error";

export function notFound(): never {
  throw new AppError(404, "NOT_FOUND", "Rota não encontrada.");
}
