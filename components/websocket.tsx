"use client";
import { useWebSocket } from "@/app/providers";
import { Card, Discussion, Player, State } from "@/types/game";
import { Button } from "@heroui/button";
import React, { Dispatch, ReactElement, SetStateAction, useEffect, useState } from "react";


type WebSocketComponentProps = {
    room: string,
    children: ReactElement,
    deck: Card[],
    throws: Card[],
    player: Player,
    players: Player[],
    turn: Player,
    discussions: Discussion[],
    setDeck: Dispatch<SetStateAction<Card[]>>
    setThrows: Dispatch<SetStateAction<Card[]>>
    setPlayers: Dispatch<SetStateAction<Player[]>>
    setPlayer: Dispatch<SetStateAction<Player>>
    setTurn: Dispatch<SetStateAction<Player>>
    setDiscussions: Dispatch<SetStateAction<Discussion[]>>
    gameStarts: () => void
};


const WebSocketComponent = ({ room, children, deck, throws, player, players, turn, discussions, setDiscussions, setDeck, setTurn, setPlayers, setPlayer, setThrows, gameStarts }: WebSocketComponentProps) => {
    const { socket } = useWebSocket()
    useEffect(() => {
        const isFirefox = navigator.userAgent.toLowerCase().includes("firefox");
        console.log(socket, "socket")
        if (!socket) return;

        //Run in firefox
        /*  if (isFirefox) {
           */
        socket.onopen = () => {
            socket.send(JSON.stringify({ type: "createRoom", room: room, game: { deck, throws, players } }));
        }
        /* } else {
            socket.send(JSON.stringify({ type: "createRoom", room: room, game: { deck, throws, players } }));
        } */
        console.log("Creating room", room);
        socket.onmessage = (event) => {
            const msg = JSON.parse(event.data);
            switch (msg.type) {
                case "status":
                    setDeck(msg.data.deck);
                    setThrows(msg.data.throws);
                    setPlayers(msg.data.players);
                    setPlayer(msg.data.players.find((p: Player) => p.id === player.id) as Player);
                    setTurn(msg.data.turn as Player);
                    setDiscussions(msg.data.openDiscussions as Discussion[]);
                    msg.data.isGameStarted && gameStarts();
                    console.log("Status:", msg);
                    break;
                case "startGame":
                    console.log("Game starts");
                    gameStarts();
                default:
                    break;
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
        };

        return () => {
            //socket.close();
        };
    }, []);

    return <div className="w-full">
        {children}
    </div>
};

export default WebSocketComponent;
