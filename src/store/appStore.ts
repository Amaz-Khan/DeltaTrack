import { create } from "zustand";
import { persist } from "zustand/middleware";

export interface Application {
  id: string;
  name: string;
  projectKey: string;
  createdAt?: string;
}

export interface ErrorEvent {
  id: string;
  type: string;
  message: string;
  stack?: string;
  url?: string;
  lineno?: number;
  colno?: number;
  userAgent?: string;
  timestamp: string;
  environment?: string;
  applicationId: string;
  count?: number;
  lastSeen?: string;
  firstSeen?: string;
  browser?: string;
  os?: string;
  device?: string;
}

interface AppState {
  applications: Application[];
  selectedApp: Application | null;
  hasCompletedOnboarding: boolean;
  errors: ErrorEvent[];
  isLoadingErrors: boolean;
  setApplications: (apps: Application[]) => void;
  addApplication: (app: Application) => void;
  selectApp: (app: Application | null) => void;
  setOnboardingComplete: () => void;
  setErrors: (errors: ErrorEvent[]) => void;
  setLoadingErrors: (loading: boolean) => void;
  resetAppState: () => void;
}

export const useAppStore = create<AppState>()(
  persist(
    (set) => ({
      applications: [],
      selectedApp: null,
      hasCompletedOnboarding: false,
      errors: [],
      isLoadingErrors: false,

      setApplications: (applications) => set({ applications }),

      addApplication: (app) =>
        set((state) => ({
          applications: [...state.applications, app],
          selectedApp: app,
          hasCompletedOnboarding: true,
        })),

      selectApp: (app) => set({ selectedApp: app, errors: [] }),

      setOnboardingComplete: () => set({ hasCompletedOnboarding: true }),

      setErrors: (errors) => set({ errors }),

      setLoadingErrors: (isLoadingErrors) => set({ isLoadingErrors }),

      resetAppState: () =>
        set({
          applications: [],
          selectedApp: null,
          hasCompletedOnboarding: false,
          errors: [],
          isLoadingErrors: false,
        }),
    }),
    {
      name: "app-storage",
      partialize: (state) => ({
        applications: state.applications,
        selectedApp: state.selectedApp,
        hasCompletedOnboarding: state.hasCompletedOnboarding,
      }),
    }
  )
);
