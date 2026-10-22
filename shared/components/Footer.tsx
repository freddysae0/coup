"use client";
import { LogoMark } from "./Logo";

import { siteConfig } from "@/config/site";
import { GithubIcon, LinkedinIcon } from "@/shared/icons";
import { useI18n } from "@/i18n";

export default function Footer() {
  const { t } = useI18n();

  return (
    <footer className="border-t border-divider">
      <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-8 text-sm text-foreground/70 sm:flex-row sm:items-center">
        <LogoMark className="h-7 w-7 text-foreground/80" />
        <p className="max-w-xl">{t.footer.credit}</p>
        <div className="flex items-center gap-4 sm:ml-auto">
          <span>
            {t.footer.builtBy}{" "}
            <a
              className="font-semibold text-primary hover:underline"
              href={siteConfig.links.author}
              rel="noreferrer"
              target="_blank"
            >
              Freddy
            </a>
          </span>
          <span className="flex items-center gap-1">
            <a
              aria-label={t.footer.code}
              className="rounded-md p-1 hover:bg-content1 hover:text-foreground"
              href={siteConfig.links.github}
              rel="noreferrer"
              target="_blank"
              title={t.footer.code}
            >
              <GithubIcon size={20} />
            </a>
            <a
              aria-label="LinkedIn"
              className="rounded-md p-1 hover:bg-content1 hover:text-foreground"
              href={siteConfig.links.linkedin}
              rel="noreferrer"
              target="_blank"
              title="LinkedIn"
            >
              <LinkedinIcon size={20} />
            </a>
          </span>
        </div>
      </div>
    </footer>
  );
}
