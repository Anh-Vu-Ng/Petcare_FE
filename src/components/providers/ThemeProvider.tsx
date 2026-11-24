'use client';

import React, {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useSyncExternalStore,
} from 'react';
import { flushSync } from 'react-dom';
import { Toaster } from 'sonner';

export type Theme = 'light' | 'dark';

const STORAGE_KEY = 'petcare-theme';
const VIEW_TRANSITION_DURATION = 400;
const CSS_TRANSITION_DURATION = 380;
const REDUCED_TRANSITION_DURATION = 500;

interface ToggleOrigin {
  x: number;
  y: number;
}

interface ThemeContextValue {
  theme: Theme;
  mounted: boolean;
  toggleTheme: (origin?: ToggleOrigin) => void;
}

const ThemeContext = createContext<ThemeContextValue | null>(null);

interface ViewTransitionLike {
  ready: Promise<void>;
  finished: Promise<void>;
  skipTransition?: () => void;
}

type DocumentWithViewTransition = Document & {
  startViewTransition?: (callback: () => void) => ViewTransitionLike;
};

const themeListeners = new Set<() => void>();

function subscribeTheme(listener: () => void) {
  themeListeners.add(listener);
  return () => {
    themeListeners.delete(listener);
  };
}

function getThemeSnapshot(): Theme {
  if (typeof document === 'undefined') return 'light';
  return document.documentElement.classList.contains('dark') ? 'dark' : 'light';
}

function getServerThemeSnapshot(): Theme {
  return 'light';
}

const emptySubscribe = () => () => {};
const getMountedSnapshot = () => true;
const getServerMountedSnapshot = () => false;

function applyDomTheme(next: Theme) {
  const root = document.documentElement;
  if (next === 'dark') {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }
  try {
    localStorage.setItem(STORAGE_KEY, next);
  } catch {
    // Ignore storage errors in restricted browsing modes
  }
  themeListeners.forEach((listener) => listener());
}

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const theme = useSyncExternalStore(
    subscribeTheme,
    getThemeSnapshot,
    getServerThemeSnapshot
  );
  const mounted = useSyncExternalStore(
    emptySubscribe,
    getMountedSnapshot,
    getServerMountedSnapshot
  );

  const activeTransitionRef = useRef<ViewTransitionLike | null>(null);
  const transitionIdRef = useRef(0);
  const cleanupTimerRef = useRef<number | null>(null);

  useEffect(() => {
    return () => {
      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
      }
    };
  }, []);

  const toggleTheme = useCallback(
    (origin?: ToggleOrigin) => {
      const next: Theme = theme === 'dark' ? 'light' : 'dark';
      const root = document.documentElement;
      const currentId = ++transitionIdRef.current;

      if (cleanupTimerRef.current !== null) {
        window.clearTimeout(cleanupTimerRef.current);
        cleanupTimerRef.current = null;
      }

      if (activeTransitionRef.current) {
        try {
          activeTransitionRef.current.skipTransition?.();
        } catch {
          // Safe fallback if already finished
        }
        activeTransitionRef.current = null;
      }

      root.classList.remove(
        'theme-view-transitioning',
        'theme-transitioning',
        'theme-transitioning-reduced'
      );

      const prefersReducedMotion =
        typeof window !== 'undefined' &&
        window.matchMedia('(prefers-reduced-motion: reduce)').matches;

      const doc = document as DocumentWithViewTransition;
      if (typeof doc.startViewTransition === 'function') {
        const x = origin?.x ?? window.innerWidth - 48;
        const y = origin?.y ?? 32;
        const endRadius = Math.hypot(
          Math.max(x, window.innerWidth - x),
          Math.max(y, window.innerHeight - y)
        );

        root.classList.add('theme-view-transitioning');

        const transition = doc.startViewTransition(() => {
          flushSync(() => {
            applyDomTheme(next);
          });
        });

        activeTransitionRef.current = transition;

        transition.ready
          .then(() => {
            if (transitionIdRef.current !== currentId) return;
            if (prefersReducedMotion) return;
            document.documentElement.animate(
              {
                clipPath: [
                  `circle(0px at ${x}px ${y}px)`,
                  `circle(${endRadius}px at ${x}px ${y}px)`,
                ],
              },
              {
                duration: VIEW_TRANSITION_DURATION,
                easing: 'cubic-bezier(0.32, 0.72, 0, 1)',
                pseudoElement: '::view-transition-new(root)',
              }
            );
          })
          .catch(() => {
            // Snapshot aborted or unsupported; state is already updated
          });

        transition.finished
          .catch(() => {
            // Ignore abort errors on rapid double-toggles
          })
          .finally(() => {
            if (transitionIdRef.current === currentId) {
              root.classList.remove('theme-view-transitioning');
              activeTransitionRef.current = null;
            }
          });

        return;
      }

      if (prefersReducedMotion) {
        root.classList.add('theme-transitioning-reduced');
        flushSync(() => {
          applyDomTheme(next);
        });
        cleanupTimerRef.current = window.setTimeout(() => {
          if (transitionIdRef.current === currentId) {
            root.classList.remove('theme-transitioning-reduced');
          }
        }, REDUCED_TRANSITION_DURATION);
        return;
      }

      root.classList.add('theme-transitioning');
      applyDomTheme(next);
      cleanupTimerRef.current = window.setTimeout(() => {
        if (transitionIdRef.current === currentId) {
          root.classList.remove('theme-transitioning');
        }
      }, CSS_TRANSITION_DURATION);
    },
    [theme]
  );

  return (
    <ThemeContext.Provider value={{ theme, mounted, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme(): ThemeContextValue {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }
  return ctx;
}

export function ThemedToaster() {
  const { theme } = useTheme();
  return (
    <Toaster
      position="top-right"
      richColors
      closeButton
      theme={theme}
      toastOptions={{
        style: {
          fontFamily: 'var(--font-sans-ui), system-ui, sans-serif',
        },
      }}
    />
  );
}
