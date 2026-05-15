import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
import { createCipheriv, createDecipheriv, randomBytes } from "crypto";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

function getEncryptionKey(): Buffer {
  const key = process.env.ENCRYPTION_KEY;
  if (!key) {
    throw new Error("ENCRYPTION_KEY is required and must be 32 characters for AES-256-GCM");
  }

  const keyBuffer = Buffer.from(key);
  if (keyBuffer.length !== 32) {
    throw new Error("ENCRYPTION_KEY must be exactly 32 bytes for AES-256-GCM");
  }

  return keyBuffer;
}

export function encryptToken(token: string): string {
    const keyBuffer = getEncryptionKey();
    const iv = randomBytes(16);
    const cipher = createCipheriv("aes-256-gcm", keyBuffer, iv);
    let encrypted = cipher.update(token, "utf8", "hex");
    encrypted += cipher.final("hex");
    const authTag = cipher.getAuthTag().toString("hex");
    return `${iv.toString("hex")}:${authTag}:${encrypted}`;
}

export function decryptToken(encryptedData: string): string {
    const keyBuffer = getEncryptionKey();
    const [ivHex, authTagHex, encryptedText] = encryptedData.split(":");
    const iv = Buffer.from(ivHex, "hex");
    const authTag = Buffer.from(authTagHex, "hex");
    const decipher = createDecipheriv("aes-256-gcm", keyBuffer, iv);
    decipher.setAuthTag(authTag);
    let decrypted = decipher.update(encryptedText, "hex", "utf8");
    decrypted += decipher.final("utf8");
    return decrypted;
}
