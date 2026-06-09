/* nukipa-widget.js — hydrates chart islands rendered by @nukipa/post-content.
   Runs on full page loads; client-side navigation is handled by ChartIslands.tsx. */
(function () {
  'use strict';

  function mountCharts() {
    var islands = Array.prototype.filter.call(
      document.querySelectorAll('[data-island="chart"]'),
      function (el) { return !el.dataset.hydrated; }
    );
    if (!islands.length) return;

    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
    s.onload = function () {
      islands.forEach(function (el) {
        if (el.dataset.hydrated) return;
        el.dataset.hydrated = '1';
        var canvas = el.querySelector('canvas');
        if (!canvas) return;
        try {
          var cfg = JSON.parse(el.getAttribute('data-chart') || '{}');
          new Chart(canvas, {
            type: cfg.type || 'line',
            data: cfg.data || {},
            options: Object.assign({ responsive: true, maintainAspectRatio: true }, cfg.options || {})
          });
        } catch (e) {
          console.warn('[nukipa-widget] chart error', e);
        }
      });
    };
    document.head.appendChild(s);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountCharts);
  } else {
    mountCharts();
  }
})();
