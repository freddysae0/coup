"use client";
import { Player } from "@/types/game";
import { Button } from "@heroui/react";
import { Alert, Dropdown, DropdownItem, DropdownMenu, DropdownTrigger } from "@heroui/react";
import { button } from "@heroui/theme";

export default function PlayersComponent({ players, playerId }: { players: Player[], playerId: string }) {
    const items = [
        {
            key: "edit",
            label: "Edit player",
        },
        {
            key: "delete",
            label: "Delete player",
        },
    ];
    return (
        <div className="flex flex-col gap-3">
            {
                players.map((player, index) => (

                    <Alert
                        color={player.id == playerId ? "primary" : "default"}
                        key={index}
                        icon={<UserIcon />}
                        className="text-left"
                        endContent={

                            <Dropdown>
                                <DropdownTrigger>
                                    <button className={button({ variant: "bordered" })}>Open Menu</button>
                                </DropdownTrigger>
                                <DropdownMenu aria-label="Dynamic Actions" items={items}>
                                    {(item) => (
                                        <DropdownItem
                                            key={item.key}
                                            className={item.key === "delete" ? "text-danger" : ""}
                                            color={item.key === "delete" ? "danger" : "default"}
                                        >
                                            {item.label}
                                        </DropdownItem>
                                    )}
                                </DropdownMenu>
                            </Dropdown>
                        }
                        title={player.name}
                        variant="flat"
                    />
                ))

            }
        </div>
    );
}



const UserIcon = ({ fill = "currentColor", ...props }) => {
    return (
        <svg
            data-name="Iconly/Curved/Profile"
            height={24}
            viewBox="0 0 24 24"
            width={24}
            xmlns="http://www.w3.org/2000/svg"
            {...props}
        >
            <g
                fill="none"
                stroke={fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            >
                <path
                    d="M11.845 21.662C8.153 21.662 5 21.088 5 18.787s3.133-4.425 6.845-4.425c3.692 0 6.845 2.1 6.845 4.4s-3.134 2.9-6.845 2.9z"
                    data-name="Stroke 1"
                />
                <path d="M11.837 11.174a4.372 4.372 0 10-.031 0z" data-name="Stroke 3" />
            </g>
        </svg>
    );
};