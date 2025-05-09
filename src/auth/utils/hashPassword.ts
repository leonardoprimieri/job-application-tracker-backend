import { hash } from "bcryptjs";

export async function hashPassword(
  password: string,
  saltRounds: number = 6
): Promise<string> {
  return await hash(password, saltRounds);
}
