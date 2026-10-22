"use client";
import { FormEvent, useEffect, useState } from "react";
import NextLink from "next/link";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import clsx from "clsx";

import GameCard from "@/shared/components/GameCard";
import { useI18n } from "@/i18n";
import { parseRoomInput, useCreateRoom } from "@/shared/useCreateRoom";
import { wakeServer } from "@/shared/useCoupSocket";
import { useDragScroll } from "@/shared/useDragScroll";
import { Role } from "@/types/game";

const COURT: Role[] = ["Duke", "Assassin", "Captain", "Ambassador", "Contessa"];

// Where each card lands in the hero fan.
const FAN = [
  { rotate: -22, x: "-62%", y: 34 },
  { rotate: -11, x: "-31%", y: 8 },
  { rotate: 0, x: "0%", y: 0 },
  { rotate: 11, x: "31%", y: 8 },
  { rotate: 22, x: "62%", y: 34 },
];

export default function Home() {
  const { t } = useI18n();
  const courtScroll = useDragScroll<HTMLUListElement>();
  const router = useRouter();
  const createRoom = useCreateRoom();
  const [invite, setInvite] = useState("");
  const [inviteError, setInviteError] = useState(false);

  // Free hosting tiers sleep when idle: start waking the server right away.
  useEffect(() => wakeServer(), []);

  const join = (e: FormEvent) => {
    e.preventDefault();
    const room = parseRoomInput(invite);

    if (!room) return setInviteError(true);
    router.push(`/game/${room}`);
  };

  return (
    <>
      {/* Hero ------------------------------------------------------------ */}
      <section className="relative overflow-hidden">
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-5 pb-16 pt-10 md:grid-cols-[1.05fr_1fr] md:pb-24 md:pt-16">
          <div className="relative z-10 flex flex-col gap-6">
            <h1 className="display text-[clamp(3.4rem,9vw,6.8rem)] uppercase">
              {t.landing.title}
            </h1>
            <p className="max-w-[52ch] text-lg leading-relaxed text-foreground/80">
              {t.landing.lead}
            </p>
            <div className="flex flex-wrap items-center gap-4">
              <button
                className="rounded-lg bg-primary px-6 py-3.5 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5 active:translate-y-0"
                data-testid="create-room"
                type="button"
                onClick={createRoom}
              >
                {t.landing.create}
              </button>
              <NextLink
                className="px-2 py-3 font-semibold underline decoration-primary decoration-2 underline-offset-4 hover:text-primary"
                href="/rules"
              >
                {t.landing.readRules}
              </NextLink>
            </div>
            <form className="flex max-w-md flex-col gap-2" onSubmit={join}>
              <label
                className="text-sm text-foreground/70"
                htmlFor="invite-input"
              >
                {t.landing.joinLabel}
              </label>
              <div className="flex gap-2">
                <input
                  aria-describedby={inviteError ? "invite-error" : undefined}
                  aria-invalid={inviteError}
                  className="min-w-0 flex-1 rounded-lg border border-divider bg-content1 px-3 py-2.5 outline-none focus:border-primary"
                  id="invite-input"
                  placeholder={t.landing.joinPlaceholder}
                  value={invite}
                  onChange={(e) => {
                    setInvite(e.target.value);
                    setInviteError(false);
                  }}
                />
                <button
                  className="rounded-lg border border-foreground/30 px-4 font-semibold hover:border-foreground"
                  type="submit"
                >
                  {t.landing.join}
                </button>
              </div>
              {inviteError && (
                <p className="text-sm text-danger" id="invite-error">
                  {t.landing.joinInvalid}
                </p>
              )}
            </form>
          </div>

          <div
            aria-hidden="true"
            className="relative mx-auto h-[min(68vw,430px)] w-full max-w-[520px]"
          >
            <div className="hatching absolute inset-[6%] rounded-full text-foreground/[0.06]" />
            {COURT.map((role, i) => (
              <motion.div
                key={role}
                animate={{ ...FAN[i], opacity: 1 }}
                className="absolute left-1/2 top-[6%] -ml-[14%] w-[28%] origin-bottom md:-ml-[17%] md:w-[34%]"
                initial={{ rotate: 0, x: "0%", y: 120, opacity: 0 }}
                style={{ zIndex: i }}
                transition={{
                  delay: 0.25 + i * 0.11,
                  type: "spring",
                  stiffness: 140,
                  damping: 17,
                }}
                whileHover={{ y: FAN[i].y - 22, transition: { duration: 0.2 } }}
              >
                <GameCard
                  priority
                  alt={t.roles[role]}
                  character={role}
                  sizes="(max-width: 768px) 34vw, 180px"
                />
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The court ------------------------------------------------------- */}
      <section className="border-t border-divider bg-content1/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="display max-w-3xl text-[clamp(2.4rem,5vw,4rem)]">
            {t.landing.courtTitle}
          </h2>
          <p className="mt-4 max-w-[62ch] text-lg text-foreground/75">
            {t.landing.courtLead}
          </p>
          <ul
            ref={courtScroll.ref}
            className={clsx(
              "no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory scroll-px-5 gap-6 overflow-x-auto px-5 pb-4 select-none md:mx-0 md:grid md:cursor-auto md:select-auto md:grid-cols-5 md:overflow-visible md:px-0",
              courtScroll.dragging ? "cursor-grabbing" : "cursor-grab",
            )}
            {...courtScroll.handlers}
          >
            {COURT.map((role) => {
              const info = t.landing.court[role];

              return (
                <li key={role} className="w-44 shrink-0 snap-start md:w-auto">
                  <GameCard
                    alt={t.roles[role]}
                    character={role}
                    className="w-full"
                    sizes="(max-width: 768px) 176px, 220px"
                  />
                  <h3 className="display mt-4 text-3xl">{t.roles[role]}</h3>
                  <dl className="mt-2 space-y-2 text-sm">
                    <div>
                      <dt className="text-foreground/60">{t.landing.action}</dt>
                      <dd className="font-medium">{info.action}</dd>
                    </div>
                    <div>
                      <dt className="text-foreground/60">{t.landing.blocks}</dt>
                      <dd className="font-medium">
                        {info.blocks || t.landing.nothingToBlock}
                      </dd>
                    </div>
                  </dl>
                </li>
              );
            })}
          </ul>
        </div>
      </section>

      {/* A turn ---------------------------------------------------------- */}
      <section className="border-t border-divider">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="display text-[clamp(2.4rem,5vw,4rem)]">
            {t.landing.turnTitle}
          </h2>
          <ol className="mt-10 grid gap-8 md:grid-cols-4 md:gap-6">
            {t.landing.steps.map((step, i) => (
              <li key={step.title} className="relative md:pt-10">
                <span
                  aria-hidden="true"
                  className="absolute left-0 top-0 hidden h-px w-full bg-divider md:block"
                />
                <span className="display absolute left-0 top-0 hidden -translate-y-1/2 bg-background pr-3 text-2xl text-primary md:block">
                  {i + 1}
                </span>
                <h3 className="display text-3xl">
                  <span className="mr-2 text-primary md:hidden">{i + 1}.</span>
                  {step.title}
                </h3>
                <p className="mt-2 text-foreground/75">{step.text}</p>
              </li>
            ))}
          </ol>
        </div>
      </section>

      {/* Online ---------------------------------------------------------- */}
      <section className="border-t border-divider bg-content1/40">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <h2 className="display text-[clamp(2.4rem,5vw,4rem)]">
            {t.landing.onlineTitle}
          </h2>
          <div className="mt-10 grid gap-10 md:grid-cols-3">
            {t.landing.online.map((item) => (
              <div key={item.title}>
                <h3 className="text-lg font-bold">{item.title}</h3>
                <p className="mt-2 text-foreground/75">{item.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Closing --------------------------------------------------------- */}
      <section className="relative overflow-hidden border-t border-divider">
        <div className="hatching absolute inset-0 text-foreground/[0.05]" />
        <div className="relative mx-auto flex max-w-6xl flex-col items-start gap-6 px-5 py-20 md:flex-row md:items-end md:justify-between">
          <div>
            <h2 className="display text-[clamp(3rem,7vw,5.5rem)] uppercase">
              {t.landing.finalTitle}
            </h2>
            <p className="mt-2 text-lg text-foreground/75">
              {t.landing.finalText}
            </p>
          </div>
          <button
            className="rounded-lg bg-primary px-6 py-3.5 text-lg font-bold text-primary-foreground shadow-lg shadow-primary/20 transition-transform hover:-translate-y-0.5"
            type="button"
            onClick={createRoom}
          >
            {t.landing.create}
          </button>
        </div>
      </section>
    </>
  );
}
