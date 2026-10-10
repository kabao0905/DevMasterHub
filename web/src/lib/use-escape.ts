// Phim Escape de lui mot cap (giong app cu): bai hoc -> roadmap -> Dashboard.
import { useEffect, useEffectEvent } from 'react';

export function useEscape(lui: () => void) {
  const khiBam = useEffectEvent(lui);
  useEffect(() => {
    function nghe(e: KeyboardEvent) {
      if (e.key !== 'Escape' || e.defaultPrevented) return;
      const el = document.activeElement as HTMLElement | null;
      // Dang go chu: Escape chi bo focus, khong roi trang
      if (el && (el.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(el.tagName))) {
        el.blur();
        return;
      }
      // Hop thoai / menu dang mo tu dong lai bang Escape
      if (document.querySelector('[role="dialog"], [role="menu"]')) return;
      khiBam();
    }
    window.addEventListener('keydown', nghe);
    return () => window.removeEventListener('keydown', nghe);
  }, []);
}
