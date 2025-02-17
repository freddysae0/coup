export type SiteConfig = typeof siteConfig;

export const siteConfig = {
  name: "Coup Online Game",
  description: "A version of Coup Card Game",
  navItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "New Game",
      href: "/new-game",
    },
    {
      label: "Join existing game",
      href: "/join-game",
    },
    {
      label: "Rules",
      href: "/rules",
    },
  ],
  navMenuItems: [
    {
      label: "Home",
      href: "/",
    },
    {
      label: "New Game",
      href: "/new-game",
    },
    {
      label: "Join existing game",
      href: "/join-game",
    },
    {
      label: "Rules",
      href: "/rules",
    },
  ],
  links: {
    github: "https://github.com/heroui-inc/heroui",
    twitter: "https://twitter.com/hero_ui",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
