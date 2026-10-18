import { useEffect, useEffectEvent } from 'react';

export function useEscape(lui: () => void) {
  const khiBam = useEffectEvent(lui);
  useEffect(() => {
    function nghe(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const el = document.activeElement as HTMLElement | null;
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) {
        el.blur();
        return;
      }
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      khiBam();
    }
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  }, []);
}
