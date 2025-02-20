import { Game } from "@/types";
import { State } from "@/types/game";
import { UUID } from "crypto";
export let globalState: Record<string, Game.State> = {};

export async function GET(req: Request) {
  const url = new URL(req.url);
  const queryParams = Object.fromEntries(url.searchParams.entries());
  if (!("uuid" in queryParams)) {
    return new Response("'uuid' is required.", { status: 400 });
  }
  console.log(globalState);
  return Response.json({ state: globalState[queryParams.uuid] });
}

export async function POST(req: Request) {
  const { state, room } = await req.json();
  if (!state || !room)
    return new Response("No'state' or 'room provided.", { status: 400 });

  globalState[room] = state;
  return Response.json({ message: "Variable updated!" });
}
