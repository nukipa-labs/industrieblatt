'use client';
import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window { Chart: any; __chartJsLoading?: boolean; }
}

export function ChartIslands() {
  const pathname = usePathname();

  useEffect(() => {
    const islands = Array.from(
      document.querySelectorAll<HTMLElement>('[data-island="chart"]')
    ).filter(el => !el.dataset.hydrated);

    if (!islands.length) return;

    function hydrate() {
      islands.forEach(el => {
        if (el.dataset.hydrated) return;
        el.dataset.hydrated = '1';
        const canvas = el.querySelector('canvas') as HTMLCanvasElement | null;
        if (!canvas) return;
        try {
          const cfg = JSON.parse(el.getAttribute('data-chart') || '{}');
          new window.Chart(canvas, {
            type: cfg.type || 'line',
            data: cfg.data || {},
            options: { responsive: true, maintainAspectRatio: true, ...(cfg.options || {}) },
          });
        } catch (e) {
          console.warn('[ChartIslands]', e);
        }
      });
    }

    if (window.Chart) {
      hydrate();
    } else if (!window.__chartJsLoading) {
      window.__chartJsLoading = true;
      const s = document.createElement('script');
      s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
      s.onload = hydrate;
      document.head.appendChild(s);
    } else {
      // Chart.js already loading from a prior navigation — poll until ready
      const t = setInterval(() => {
        if (window.Chart) { clearInterval(t); hydrate(); }
      }, 50);
      return () => clearInterval(t);
    }
  }, [pathname]);

  return null;
}
