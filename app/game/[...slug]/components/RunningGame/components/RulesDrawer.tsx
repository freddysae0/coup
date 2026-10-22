import { Drawer, DrawerBody, DrawerContent, DrawerHeader } from "@heroui/react";

import ActionBadge from "@/shared/components/ActionBadge";
import { ACTION_META, ACTION_ORDER } from "@/shared/gameMeta";
import { useI18n } from "@/i18n";

/** Cheat sheet that can be opened mid-game without leaving the table. */
export default function RulesDrawer({
  isOpen,
  onOpenChange,
}: {
  isOpen: boolean;
  onOpenChange: (open: boolean) => void;
}) {
  const { t } = useI18n();
  const r = t.rules;

  const list = (title: string, items: string[]) => (
    <section>
      <h3 className="mb-2 text-sm font-bold">{title}</h3>
      <ul className="space-y-1.5 text-sm text-foreground/80">
        {items.map((item) => (
          <li key={item} className="flex gap-2">
            <span
              aria-hidden="true"
              className="mt-[0.55em] h-1 w-1 shrink-0 rotate-45 bg-primary"
            />
            <span>{item}</span>
          </li>
        ))}
      </ul>
    </section>
  );

  return (
    <Drawer
      isOpen={isOpen}
      placement="right"
      size="md"
      onOpenChange={onOpenChange}
    >
      <DrawerContent>
        <DrawerHeader className="display text-3xl">{t.nav.rules}</DrawerHeader>
        <DrawerBody className="gap-6 pb-8">
          <p className="text-sm text-foreground/80">{r.goal}</p>

          <section>
            <h3 className="mb-2 text-sm font-bold">{r.sections.actions}</h3>
            <ul className="flex flex-col gap-2" data-testid="rules-actions">
              {ACTION_ORDER.map((action) => {
                const meta = ACTION_META[action];

                return (
                  <li
                    key={action}
                    className="flex gap-3 rounded-lg bg-content2/60 p-2.5"
                  >
                    <ActionBadge action={action} />
                    <div className="min-w-0 text-sm">
                      <p className="font-semibold">
                        {t.actions[action]}{" "}
                        <span className="font-normal text-foreground/60">
                          · {meta.role ? t.roles[meta.role] : r.table.anyone}
                        </span>
                      </p>
                      <p className="text-foreground/80">{r.effects[action]}</p>
                      {meta.blockedBy.length > 0 && (
                        <p className="text-xs text-foreground/60">
                          {r.table.blockedBy}:{" "}
                          {meta.blockedBy.map((b) => t.roles[b]).join(", ")}
                        </p>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>
          </section>

          {list(r.sections.turn, r.turn)}
          {list(r.sections.challenges, r.challenges)}
          {list(r.sections.blocks, r.blocks)}
          {list(r.sections.losing, r.losing)}
          {list(r.sections.special, r.special)}

          <a
            className="text-sm font-semibold text-primary underline-offset-4 hover:underline"
            href="/rules"
            rel="noreferrer"
            target="_blank"
          >
            {t.game.fullRules} ↗
          </a>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
}
