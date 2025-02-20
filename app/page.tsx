
import { Link } from "@heroui/link";
import { Snippet } from "@heroui/snippet";
import { Code } from "@heroui/code";
import { button as buttonStyles } from "@heroui/theme";

import { siteConfig } from "@/config/site";
import { GithubIcon } from "@/components/icons";
import { Button } from "@heroui/button";
import { randomUUID } from "crypto";



export default function Home() {
  const uuid = randomUUID();
  return (
    <section className="flex flex-col items-center justify-center gap-4 py-8 md:py-10">
      <div className="flex flex-col gap-3">
        <Link color="primary" href={`game/${uuid}`} className={buttonStyles({ variant: "bordered" })}> New Game</Link>

        <Link
          className={buttonStyles({ variant: "bordered" })}
          href="rules"
        >
          Rules
        </Link>
      </div>

    </section>
  );
}
