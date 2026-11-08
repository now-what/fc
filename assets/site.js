(function () {
    'use strict';

    var root = document.documentElement;

    try {
        var saved = localStorage.getItem('theme');
        if (saved === 'light' || saved === 'dark') root.setAttribute('data-theme', saved);
    } catch (e) {}

    document.addEventListener('DOMContentLoaded', function () {
        var darkQuery = window.matchMedia('(prefers-color-scheme: dark)');
        var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

        var themeBtn = document.getElementById('theme-toggle-btn');

        function isDark() {
            var explicit = root.getAttribute('data-theme');
            return explicit ? explicit === 'dark' : darkQuery.matches;
        }

        function syncTheme() {
            var d = themeBtn.dataset;
            themeBtn.textContent = isDark() ? d.lightText : d.darkText;
            themeBtn.setAttribute('aria-label', isDark() ? d.lightLabel : d.darkLabel);
        }

        if (themeBtn) {
            themeBtn.hidden = false;
            syncTheme();
            themeBtn.addEventListener('click', function () {
                var next = isDark() ? 'light' : 'dark';
                root.setAttribute('data-theme', next);
                try { localStorage.setItem('theme', next); } catch (e) {}
                syncTheme();
            });
        }

        var factEl = document.getElementById('rotating-fact');
        var pauseBtn = document.getElementById('pause-btn');
        var facts = Array.prototype.map.call(document.querySelectorAll('#facts li'), function (li) {
            return li.textContent.replace(/\s+/g, ' ').trim();
        });
        var index = 0;
        var timer = null;
        var paused = false;

        function rotate() {
            factEl.classList.add('fade-out');
            setTimeout(function () {
                index = (index + 1) % facts.length;
                factEl.textContent = facts[index];
                factEl.classList.remove('fade-out');
            }, 400);
        }

        function start() {
            if (timer || paused || reduceMotion.matches) return;
            timer = setInterval(rotate, 4000);
        }

        function stop() {
            clearInterval(timer);
            timer = null;
        }

        function syncMotion() {
            pauseBtn.hidden = reduceMotion.matches;
            if (reduceMotion.matches) stop(); else start();
        }

        if (factEl && pauseBtn && facts.length > 1) {
            pauseBtn.addEventListener('click', function () {
                paused = !paused;
                pauseBtn.setAttribute('data-paused', paused ? 'true' : 'false');
                pauseBtn.setAttribute('aria-label', paused ? pauseBtn.dataset.resumeLabel : pauseBtn.dataset.pauseLabel);
                if (paused) stop(); else start();
            });
            syncMotion();
        }
    });
})();
