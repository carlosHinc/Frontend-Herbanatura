import { Injectable } from '@angular/core';
import { User } from '@domain/auth/auth.entity';
import { UserPermissions } from '@domain/auth/auth.response';

const TOKEN_KEY = 'auth_token';
const USER_KEY = 'auth_user';
const PERMISSIONS_KEY = 'auth_permissions';
const CIPHER_KEY = 'h3rb4n4tur4-s3cur1ty-k3y-2026';

function encrypt(text: string): string {
  const encoded = new TextEncoder().encode(text);
  const key = new TextEncoder().encode(CIPHER_KEY);
  const result = new Uint8Array(encoded.length);
  for (let i = 0; i < encoded.length; i++) {
    result[i] = encoded[i] ^ key[i % key.length];
  }
  return btoa(String.fromCharCode(...result));
}

function decrypt(cipherText: string): string {
  const raw = Uint8Array.from(atob(cipherText), (c) => c.charCodeAt(0));
  const key = new TextEncoder().encode(CIPHER_KEY);
  const result = new Uint8Array(raw.length);
  for (let i = 0; i < raw.length; i++) {
    result[i] = raw[i] ^ key[i % key.length];
  }
  return new TextDecoder().decode(result);
}

@Injectable({ providedIn: 'root' })
export class AuthTokenService {
  getToken(): string | null {
    const encrypted = localStorage.getItem(TOKEN_KEY);
    if (!encrypted) {
      return null;
    }
    try {
      return decrypt(encrypted);
    } catch {
      return null;
    }
  }

  getUser(): User | null {
    const raw = localStorage.getItem(USER_KEY);
    if (!raw) return null;
    return JSON.parse(raw);
  }

  getPermissions(): UserPermissions[] | null {
    const raw = localStorage.getItem(PERMISSIONS_KEY);
    if (!raw) return null;
    try {
      return JSON.parse(raw);
    } catch {
      return null;
    }
  }

  saveSession(
    token: string,
    user: User,
    permissions: UserPermissions[],
  ): void {
    localStorage.setItem(TOKEN_KEY, encrypt(token));
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    localStorage.setItem(PERMISSIONS_KEY, JSON.stringify(permissions));
  }

  clearSession(): void {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    localStorage.removeItem(PERMISSIONS_KEY);
  }

  isAuthenticated(): boolean {
    const token = this.getToken();
    if (!token) return false;

    try {
      const payloadBase64 = token.split('.')[1];
      const payload = JSON.parse(atob(payloadBase64));
      const now = Math.floor(Date.now() / 1000);
      return payload.exp > now;
    } catch {
      return false;
    }
  }
}
