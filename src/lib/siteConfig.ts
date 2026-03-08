// ── Types ──────────────────────────────────────────────────────────────────────

export interface SocialLink {
  /** Platform identifier used to look up the icon */
  platform: string;
  /** Full URL or site-relative path */
  url: string;
  /** Accessible label for screen readers */
  label: string;
}

export interface GiscusConfig {
  /** GitHub repository in "owner/name" format */
  repo: string;
  /** Repository ID from https://giscus.app */
  repoId: string;
  /** Discussion category name */
  category: string;
  /** Discussion category ID from https://giscus.app */
  categoryId: string;
}

export interface SiteConfig {
  title: string;
  titleTemplate: string;
  description: string;
  author: string;
  tagline: string;
  siteUrl: string;
  gravatarHash: string;
  goatcounterId: string;
  giscus: GiscusConfig;
  socialLinks: SocialLink[];
}

// ── Config ────────────────────────────────────────────────────────────────────

export const siteConfig: SiteConfig = {
  title: "Just A(I) Programmer",
  titleTemplate: "%s | Just A(I) Programmer",
  description:
    "Don Quixote fighting entropy — a programming blog by Marcin Malinowski",
  author: "Marcin Malinowski",
  tagline: "~ Don Quixote fighting entropy",
  siteUrl: "https://blog.orientman.com",
  gravatarHash: "78d50dc34ae3edcfa5449ff9ad47f0a2",
  goatcounterId: "orientman",
  giscus: {
    repo: "orient-man/blog",
    repoId: "R_kgDORahAUg",
    category: "Blog Comments",
    categoryId: "DIC_kwDORahAUs4C35SY",
  },
  socialLinks: [
    {
      platform: "x",
      url: "https://twitter.com/orientman",
      label: "X (Twitter)",
    },
    {
      platform: "facebook",
      url: "https://www.facebook.com/orient.man",
      label: "Facebook",
    },
    {
      platform: "linkedin",
      url: "https://www.linkedin.com/in/marcin-malinowski-0335ab",
      label: "LinkedIn",
    },
    {
      platform: "github",
      url: "https://github.com/orient-man",
      label: "GitHub",
    },
    {
      platform: "rss",
      url: "/feed.xml",
      label: "RSS Feed",
    },
  ],
};
