import { useEffect, useState } from 'react';

export function usePathname(): string {
  const [pathname, setPathname] = useState(window.location.pathname);

  useEffect(() => {
    const handlePopState = () => setPathname(window.location.pathname);
    window.addEventListener('popstate', handlePopState);
    return () => window.removeEventListener('popstate', handlePopState);
  }, []);

  return pathname;
}

let localNavigator: ((path: string) => void) | null = null;

export function setLocalNavigator(handler: ((path: string) => void) | null): void {
  localNavigator = handler;
}

export function navigate(path: string): void {
  if (localNavigator) {
    localNavigator(path);
    return;
  }
  if (window.location.pathname === path) return;
  window.history.pushState({}, '', path);
  window.dispatchEvent(new PopStateEvent('popstate'));
}