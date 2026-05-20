export const ROUTES = {
  dashboard: {
    home: "/dashboard",
    profileBuilder: "/dashboard/profile-builder",
    canvas: "/dashboard/canvas",
    help: "/dashboard/help",
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
  },
} as const;
