"use client";
import { title, subtitle } from "@/components/primitives";
import { createDeck, createThrows } from "../utils";
import { v4 } from "uuid"
import { Card, Discussion, Player } from "@/types/game";
import PlayersComponent from "./components/PlayersComponent";
import { Snippet } from "@heroui/snippet";
import { useEffect, useState } from "react";
import WebSocketComponent from "@/components/websocket";
import { Button } from "@heroui/button";
import { Input } from "@heroui/input";
import { useWebSocket } from "@/app/providers";
import RunningGame from "./components/RunningGame";

export default function Game() {

    const [isGameStarted, setIsGameStarted] = useState(false)
    const [, setPathUrl] = useState("")
    const [, setRouteUuid] = useState("")
    const [name, setName] = useState("")
    const [baseUrl, setBaseUrl] = useState("")

    let newPlayer = {} as Player
    const [discussions, setDiscussions] = useState<Discussion[]>([])
    const [turn, setTurn] = useState<Player>(newPlayer)
    const [player, setPlayer] = useState<Player>(newPlayer)
    const [players, setPlayers] = useState<Player[]>([])
    const [room, setRoom] = useState<string>("none")
    const [deck, setDeck] = useState<Card[]>([])
    const [throws, setThrows] = useState<Card[]>([])
    const { socket } = useWebSocket();

    const handleNamingButton = () => {
        if (!player) return;
        player.name = name;
        setPlayer(player)
        localStorage.setItem("player", JSON.stringify(player))
        socket?.send(JSON.stringify({ type: "updatePlayerName", player: player, room: room }))

    }
    const gameStarts = () => {
        setIsGameStarted(true)
    }
    const sendStartGameSignal = () => {
        socket?.send(JSON.stringify({ type: "startGame", room: room }))
    }

    useEffect(() => {
        const ls_player = localStorage.getItem("player")

        if (ls_player) {
            newPlayer = JSON.parse(ls_player) as Player
        } else {
            newPlayer = {
                id: v4(),
                name: "You",
                cards: [],
                isHost: false,
                coins: 0,
                isBeingChallenged: false,
            }
            localStorage.setItem("player", JSON.stringify(newPlayer))
        }

        setName(newPlayer.name)
        setPlayers([...players, newPlayer as Player])
        setPlayer(newPlayer as Player)
        setDeck(createDeck())
        setThrows(createThrows())
        setBaseUrl(window.location.origin);
        setPathUrl(window.location.pathname);
        const parts = window.location.pathname.split("/");
        const routeUuid = parts[parts.length - 1];

        setRoom(routeUuid)
        setRouteUuid(routeUuid)

        console.log(routeUuid)
        console.log(player?.isHost, routeUuid)



    }, [])

    if (room !== "none") return (
        <WebSocketComponent
            deck={deck}
            throws={throws}
            players={players}
            player={player as Player}
            room={room}
            turn={turn}
            discussions={discussions}
            setDiscussions={setDiscussions}
            setDeck={setDeck}
            setThrows={setThrows}
            setPlayers={setPlayers}
            setPlayer={setPlayer}
            gameStarts={gameStarts}
            setTurn={setTurn}
        >

            <div className="w-full">
                {player && !isGameStarted && <div className="flex flex-col gap-3">

                    <h1 className={title()}>Coup room</h1>
                    <p className={subtitle()}>Invite your friends to play together.</p>


                    {players.length > 1 && player?.isHost &&
                        <Button onPress={sendStartGameSignal} variant="flat" color="danger">Start Game</Button>}

                    <h2 className={"text-left"}>Room Link:</h2>
                    <Snippet symbol="" color="secondary" codeString={baseUrl + "/game/" + room}>{baseUrl + "/game/...." + room.split("-")[4]}</Snippet>


                    <h2 className={"text-left"}>Insert your nickname:</h2>
                    <form onSubmit={(e) => { e.preventDefault(); handleNamingButton() }} className="flex gap-2">
                        <Input className="mb-3" value={name} color="default" onChange={(e) => setName(e.target.value)}></Input>
                        <Button onPress={handleNamingButton} color="primary" variant="flat">
                            Update
                        </Button>
                    </form>


                    <h2 className={"text-left"}>Players in the room:</h2>
                    <PlayersComponent players={players} playerId={player.id}>
                    </PlayersComponent>
                </div>}
                {isGameStarted &&
                    <RunningGame discussions={discussions} turn={turn} deck={deck} player={player} players={players} room={room} ></RunningGame>
                }
            </div>
        </WebSocketComponent>
    );
    else return null
}
