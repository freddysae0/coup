import { describe, it, expect } from "vitest";

import { parseRoomInput } from "@/shared/useCreateRoom";
import { resolveLocale } from "@/i18n/config";

describe("parseRoomInput", () => {
  it("accepts invite links and bare room codes", () => {
    expect(parseRoomInput("https://coup.example/game/abc-123")).toBe("abc-123");
    expect(parseRoomInput("  http://localhost:3000/game/xyz_9/ ")).toBe(
      "xyz_9",
    );
    expect(parseRoomInput("3f2b-room")).toBe("3f2b-room");
  });

  it("rejects anything else", () => {
    expect(parseRoomInput("")).toBeNull();
    expect(parseRoomInput("not a room!")).toBeNull();
    expect(parseRoomInput("https://example.com/other")).toBeNull();
  });
});

describe("resolveLocale", () => {
  it("prefers the cookie, then the browser languages", () => {
    expect(resolveLocale("es", "en-US")).toBe("es");
    expect(resolveLocale(undefined, "es-ES,es;q=0.9,en;q=0.8")).toBe("es");
    expect(resolveLocale(undefined, "fr-FR,en;q=0.5")).toBe("en");
    expect(resolveLocale("de", null)).toBe("en");
  });
});
