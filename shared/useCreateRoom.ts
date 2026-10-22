"use client";
import { useCallback } from "react";
import { useRouter } from "next/navigation";
import { v4 } from "uuid";

/** Rooms are just URLs: a fresh id is a fresh room. */
export function useCreateRoom() {
  const router = useRouter();

  return useCallback(() => router.push(`/game/${v4()}`), [router]);
}

/** Accepts a full invite link or a bare room id. */
export function parseRoomInput(input: string): string | null {
  const value = input.trim();
  const match = value.match(/\/game\/([A-Za-z0-9_-]{1,64})\/?$/);

  if (match) return match[1];
  if (/^[A-Za-z0-9_-]{4,64}$/.test(value)) return value;

  return null;
}
