"use client";
import { Link } from "@heroui/link";
import { button as buttonStyles } from "@heroui/theme";
import { useEffect, useState } from "react";
import { v4 } from "uuid";

export default function Home() {
  const [uuid, setUUID] = useState("");

  useEffect(() => {
    setUUID(v4());
  }, []);
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex flex-col gap-3">
        <Link
          className={buttonStyles({ variant: "bordered" })}
          color="primary"
          href={`game/${uuid}`}
        >
          {" "}
          New Game
        </Link>

        <Link className={buttonStyles({ variant: "bordered" })} href="rules">
          Rules
        </Link>
      </div>
    </section>
  );
}
