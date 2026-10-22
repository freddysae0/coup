"use client";
import NextLink from "next/link";
import { usePathname } from "next/navigation";
import clsx from "clsx";

import Logo from "../Logo";
import LanguageSwitch from "../LanguageSwitch";

import { ThemeSwitch } from "@/shared/theme-switch";
import { GithubIcon } from "@/shared/icons";
import { siteConfig } from "@/config/site";
import { useI18n } from "@/i18n";
import { useCreateRoom } from "@/shared/useCreateRoom";

export const Navbar = () => {
  const { t } = useI18n();
  const pathname = usePathname();
  const createRoom = useCreateRoom();

  return (
    <header className="sticky top-0 z-40 border-b border-divider bg-background/80 backdrop-blur-md">
      <nav className="mx-auto flex h-16 max-w-6xl items-center gap-4 px-5">
        <NextLink aria-label={t.nav.home} href="/">
          <Logo />
        </NextLink>
        <div className="ml-auto flex items-center gap-1 sm:gap-3">
          <NextLink
            aria-current={pathname === "/rules" ? "page" : undefined}
            className={clsx(
              "rounded-md px-2 py-1 text-sm font-medium hover:text-primary",
              pathname === "/rules" && "text-primary",
            )}
            href="/rules"
          >
            {t.nav.rules}
          </NextLink>
          <button
            className="hidden rounded-md bg-primary px-3 py-1.5 text-sm font-semibold text-primary-foreground hover:opacity-90 sm:block"
            type="button"
            onClick={createRoom}
          >
            {t.nav.play}
          </button>
          <LanguageSwitch />
          <ThemeSwitch />
          <a
            aria-label={t.nav.source}
            className="hidden text-foreground/70 hover:text-foreground sm:block"
            href={siteConfig.links.github}
            rel="noreferrer"
            target="_blank"
          >
            <GithubIcon size={22} />
          </a>
        </div>
      </nav>
    </header>
  );
};

export default Navbar;
