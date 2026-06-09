/* nukipa-widget.js — hydrates interactive islands rendered by @nukipa/post-content */
(function () {
  'use strict';

  if (window.__nukipaWidgetMounted) return;
  window.__nukipaWidgetMounted = true;

  function mountCharts() {
    var islands = document.querySelectorAll('[data-island="chart"]');
    if (!islands.length) return;

    var s = document.createElement('script');
    s.src = 'https://cdn.jsdelivr.net/npm/chart.js@4/dist/chart.umd.min.js';
    s.onload = function () {
      islands.forEach(function (el) {
        var canvas = el.querySelector('canvas');
        if (!canvas || canvas._chartMounted) return;
        canvas._chartMounted = true;
        try {
          var cfg = JSON.parse(el.getAttribute('data-chart') || '{}');
          new Chart(canvas, {
            type: cfg.type || 'line',
            data: cfg.data || {},
            options: Object.assign({ responsive: true, maintainAspectRatio: true }, cfg.options || {})
          });
        } catch (e) {
          console.warn('[nukipa-widget] chart hydration error', e);
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
