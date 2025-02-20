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
      href: "/game/new",
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
      label: "Rules",
      href: "/rules",
    },
  ],
  links: {
    github: "https://github.com/freddysae0/coup",
    linkedin: "https://www.linkedin.com/in/freddy-js/",
    docs: "https://heroui.com",
    discord: "https://discord.gg/9b6yyZKmH4",
    sponsor: "https://patreon.com/jrgarciadev",
  },
};
