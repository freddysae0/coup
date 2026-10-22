"use client";
import { useEffect, useState } from "react";
import clsx from "clsx";

import GameCard from "@/shared/components/GameCard";
import ActionBadge from "@/shared/components/ActionBadge";
import { ACTION_META, ACTION_ORDER, ROLES } from "@/shared/gameMeta";
import { useI18n } from "@/i18n";
import { Dictionary } from "@/i18n/en";

type SectionId = keyof Dictionary["rules"]["sections"];

const SECTIONS: SectionId[] = [
  "goal",
  "setup",
  "turn",
  "actions",
  "challenges",
  "blocks",
  "losing",
  "special",
  "online",
  "characters",
];

/** Highlights the section currently in view in the table of contents. */
function useActiveSection() {
  const [active, setActive] = useState<SectionId>("goal");

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        const visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => a.boundingClientRect.top - b.boundingClientRect.top);

        if (visible[0]) setActive(visible[0].target.id as SectionId);
      },
      { rootMargin: "-20% 0px -65% 0px" },
    );

    SECTIONS.forEach((id) => {
      const el = document.getElementById(id);

      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, []);

  return active;
}

export default function RulesPage() {
  const { t } = useI18n();
  const r = t.rules;
  const active = useActiveSection();

  const list = (items: string[]) => (
    <ul className="mt-4 space-y-3">
      {items.map((item) => (
        <li key={item} className="flex gap-3">
          <span
            aria-hidden="true"
            className="mt-[0.6em] h-1.5 w-1.5 shrink-0 rotate-45 bg-primary"
          />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  );

  return (
    <div className="mx-auto max-w-6xl px-5 pb-24 pt-10 md:pt-16">
      <header className="max-w-3xl">
        <h1 className="display text-[clamp(3rem,8vw,6rem)] uppercase">
          {r.title}
        </h1>
        <p className="mt-4 text-lg text-foreground/75">{r.lead}</p>
      </header>

      <div className="mt-12 grid gap-12 md:grid-cols-[200px_1fr]">
        <nav aria-label={r.toc} className="hidden md:block">
          <div className="sticky top-24">
            <p className="mb-3 text-sm font-semibold text-foreground/60">
              {r.toc}
            </p>
            <ul className="space-y-1 border-l border-divider">
              {SECTIONS.map((id) => (
                <li key={id}>
                  <a
                    aria-current={active === id ? "true" : undefined}
                    className={clsx(
                      "-ml-px block border-l-2 py-1 pl-4 text-sm transition-colors",
                      active === id
                        ? "border-primary font-semibold text-foreground"
                        : "border-transparent text-foreground/60 hover:text-foreground",
                    )}
                    href={`#${id}`}
                  >
                    {r.sections[id]}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </nav>

        <article className="prose-rules min-w-0 space-y-16 text-[1.05rem]">
          <Section id="goal" title={r.sections.goal}>
            <p className="mt-4">{r.goal}</p>
          </Section>

          <Section id="setup" title={r.sections.setup}>
            {list(r.setup)}
          </Section>

          <Section id="turn" title={r.sections.turn}>
            {list(r.turn)}
          </Section>

          <Section id="actions" title={r.sections.actions}>
            <div className="mt-6 overflow-x-auto rounded-xl border border-divider">
              <table className="w-full min-w-[620px] text-left text-sm">
                <thead className="bg-content1 text-foreground/70">
                  <tr>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      {r.table.action}
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      {r.table.character}
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      {r.table.effect}
                    </th>
                    <th className="px-4 py-3 font-semibold" scope="col">
                      {r.table.blockedBy}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {ACTION_ORDER.map((action) => {
                    const meta = ACTION_META[action];

                    return (
                      <tr key={action} className="border-t border-divider">
                        <th className="px-4 py-3 font-bold" scope="row">
                          <span className="flex items-center gap-3">
                            <ActionBadge action={action} />
                            {t.actions[action]}
                          </span>
                        </th>
                        <td className="px-4 py-3">
                          {meta.role ? (
                            t.roles[meta.role]
                          ) : (
                            <span className="text-foreground/60">
                              {r.table.anyone}
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-3">{r.effects[action]}</td>
                        <td className="px-4 py-3">
                          {meta.blockedBy.length
                            ? meta.blockedBy.map((b) => t.roles[b]).join(", ")
                            : r.table.none}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </Section>

          <Section id="challenges" title={r.sections.challenges}>
            {list(r.challenges)}
          </Section>

          <Section id="blocks" title={r.sections.blocks}>
            {list(r.blocks)}
          </Section>

          <Section id="losing" title={r.sections.losing}>
            {list(r.losing)}
          </Section>

          <Section id="special" title={r.sections.special}>
            {list(r.special)}
          </Section>

          <Section id="online" title={r.sections.online}>
            {list(r.online)}
          </Section>

          <Section id="characters" title={r.sections.characters}>
            <ul className="mt-6 grid grid-cols-2 gap-6 sm:grid-cols-3 lg:grid-cols-5">
              {ROLES.map((role) => (
                <li key={role}>
                  <GameCard
                    alt={t.roles[role]}
                    character={role}
                    sizes="(max-width: 640px) 45vw, 180px"
                  />
                  <p className="display mt-3 text-2xl">{t.roles[role]}</p>
                  <p className="text-sm text-foreground/70">
                    {t.landing.court[role].action}
                  </p>
                </li>
              ))}
            </ul>
          </Section>
        </article>
      </div>
    </div>
  );
}

function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section aria-labelledby={`${id}-title`} className="scroll-mt-24" id={id}>
      <h2 className="display text-4xl md:text-5xl" id={`${id}-title`}>
        {title}
      </h2>
      {children}
    </section>
  );
}
