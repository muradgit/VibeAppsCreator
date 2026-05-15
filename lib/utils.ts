import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

const ENCRYPTION_KEY = (process.env.ENCRYPTION_KEY || "01234567890123456789012345678901").padEnd(32, "0").slice(0, 32);

export function encryptToken(token: string): string {
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string): string {
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", Buffer.from(ENCRYPTION_KEY), iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
