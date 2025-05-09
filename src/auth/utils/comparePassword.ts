import { compare } from "bcryptjs";

export async function comparePassword(password: string, passwordHash: string) {
  return await compare(password, passwordHash);
}
