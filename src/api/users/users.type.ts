export type AuthProvider = "email" | "google";

export type UserSettings = {
  email: string;
  username: string | null;
  fullName: string | null;
  isVerified: boolean;
  authProvider: AuthProvider;
  onboardingComplete: boolean;
};

export type BillingInfo = {
  plan: string;
  nextBillingDate: string | null;
};

export type ThemeMode = "light" | "dark" | "system";

export type UserPreferences = {
  mode: ThemeMode;
  colorTheme: string;
};

export type UpdatePreferencesRequest = Partial<UserPreferences>;

export type UpdateEmailRequest = {
  email: string;
};

export type UpdateEmailResponse = {
  email: string;
};

export type ChangePasswordRequest = {
  currentPassword: string;
  newPassword: string;
};

export type UpdateVisibilityRequest = {
  isPublic: boolean;
};

export type VisibilityResponse = {
  isPublic: boolean;
};
