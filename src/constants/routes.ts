export const ROUTES = {
  admin: {
    home: "/open-profile/admin",
    userLookup: "/open-profile/admin/user-lookup",
    featureFlags: "/open-profile/admin/feature-flags",
  },
  dashboard: {
    home: "/dashboard",
    profileBuilder: "/dashboard/profile-builder",
    insights: "/dashboard/insights",
    notifications: "/dashboard/notifications",
    canvas: "/dashboard/canvas",
    help: {
      home: "/dashboard/help",
    },
    settings: {
      home: "/dashboard/settings",
      email: "/dashboard/settings/email",
      security: "/dashboard/settings/security",
      billing: "/dashboard/settings/billing",
    },
  },
  auth: {
    login: "/login",
    signup: "/signup",
  },
  public: {
    faq: "/faq",
    privacy: "/privacy-policy",
    terms: "/terms",
  },
  comingSoon: "/coming-soon",
  home: "/",
} as const;

export const Navlinks = [
  { label: "How it works", href: "/how-it-works" },
  { label: "Pricing", href: "/#pricing" },
  { label: "FAQ", href: "/faq" },
] as const;
