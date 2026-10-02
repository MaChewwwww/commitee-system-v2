/**
 * Shared frontend utilities for SK Committee Management System.
 * Does not change API contracts — only UI helpers and path config.
 */
(function (window) {
  'use strict';

  var cfg = window.APP_CONFIG || {};
  var BACKEND = cfg.api || ((cfg.base || '') + '/backend/api');

  function toast(message, type) {
    type = type || 'info';
    var stack = document.getElementById('toastStack');
    if (!stack) {
      stack = document.createElement('div');
      stack.id = 'toastStack';
      stack.className = 'toast-stack';
      document.body.appendChild(stack);
    }
    var el = document.createElement('div');
    el.className = 'toast is-' + type;
    el.setAttribute('role', 'status');
    el.textContent = message;
    stack.appendChild(el);
    setTimeout(function () {
      el.style.opacity = '0';
      el.style.transition = 'opacity 0.2s ease';
      setTimeout(function () { el.remove(); }, 200);
    }, 3800);
  }

  async function logout() {
    try {
      await fetch((cfg.api || ((cfg.base || '') + '/backend/api')) + '/logout.php', {
        method: 'POST',
        credentials: 'same-origin'
      });
    } finally {
      try { localStorage.removeItem('user'); } catch (e) {}
      window.location.href = cfg.login || ((cfg.pages || ((cfg.base || '') + '/pages')) + '/login.php');
    }
  }

  async function fetchJSON(url) {
    try {
      var res = await fetch(url, { credentials: 'same-origin' });
      var text = await res.text();
      try {
        return JSON.parse(text);
      } catch (e) {
        var startArr = text.indexOf('[');
        var startObj = text.indexOf('{');
        if (startArr !== -1 && (startObj === -1 || startArr < startObj)) {
          return JSON.parse(text.substring(startArr));
        }
        if (startObj !== -1) {
          return JSON.parse(text.substring(startObj));
        }
        return [];
      }
    } catch (e) {
      console.error('fetchJSON error:', url, e);
      return [];
    }
  }

  function escapeHtml(str) {
    return String(str == null ? '' : str)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function loadingRow(colspan, label) {
    return '<tr><td colspan="' + colspan + '"><div class="state-box"><div class="spinner" aria-hidden="true"></div><p class="state-text">' + escapeHtml(label || 'Loading...') + '</p></div></td></tr>';
  }

  function emptyRow(colspan, title, text) {
    return '<tr><td colspan="' + colspan + '"><div class="state-box"><p class="state-title">' + escapeHtml(title || 'No records yet') + '</p><p class="state-text">' + escapeHtml(text || '') + '</p></div></td></tr>';
  }

  function errorRow(colspan, title) {
    return '<tr><td colspan="' + colspan + '"><div class="state-box is-error"><p class="state-title">' + escapeHtml(title || 'Unable to load data') + '</p><p class="state-text">Please try again.</p></div></td></tr>';
  }

  function badgeClass(status) {
    var s = String(status || '').toLowerCase();
    if (s === 'available' || s === 'active' || s === 'completed' || s === 'excellent' || s === 'good') return 'badge badge-success';
    if (s === 'busy' || s === 'inactive' || s === 'pending' || s === 'average' || s === 'warning') return 'badge badge-warning';
    if (s === 'unavailable' || s === 'dissolved' || s === 'needs improvement' || s === 'overloaded') return 'badge badge-danger';
    return 'badge badge-neutral';
  }

  function can(permission) {
    var cfg = window.APP_CONFIG || {};
    if (cfg.role === 'super_admin') return true;
    var perms = cfg.permissions || [];
    return perms.indexOf(permission) !== -1;
  }

  function applyPermissionUi(root) {
    root = root || document;
    var nodes = root.querySelectorAll('[data-permission]');
    for (var i = 0; i < nodes.length; i++) {
      var el = nodes[i];
      var need = el.getAttribute('data-permission');
      if (need && !can(need)) {
        el.hidden = true;
        el.setAttribute('aria-hidden', 'true');
      }
    }
  }

  function initShell() {
    var dateEl = document.getElementById('currentDate');
    if (dateEl) {
      dateEl.textContent = new Date().toLocaleDateString('en-PH', {
        weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
      });
    }

    applyPermissionUi(document);

    var shell = document.getElementById('appShell');
    var btn = document.getElementById('mobileMenuBtn');
    var overlay = document.getElementById('sidebarOverlay');

    function closeSidebar() {
      if (!shell) return;
      shell.classList.remove('sidebar-open');
      if (overlay) overlay.hidden = true;
      if (btn) btn.setAttribute('aria-expanded', 'false');
    }

    function openSidebar() {
      if (!shell) return;
      shell.classList.add('sidebar-open');
      if (overlay) overlay.hidden = false;
      if (btn) btn.setAttribute('aria-expanded', 'true');
    }

    if (btn) {
      btn.addEventListener('click', function () {
        if (shell && shell.classList.contains('sidebar-open')) closeSidebar();
        else openSidebar();
      });
    }
    if (overlay) {
      overlay.addEventListener('click', closeSidebar);
    }

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape') closeSidebar();
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShell);
  } else {
    initShell();
  }

  window.App = {
    BACKEND: BACKEND,
    toast: toast,
    logout: logout,
    fetchJSON: fetchJSON,
    escapeHtml: escapeHtml,
    loadingRow: loadingRow,
    emptyRow: emptyRow,
    errorRow: errorRow,
    badgeClass: badgeClass,
    can: can,
    applyPermissionUi: applyPermissionUi
  };

  // Backward-compatible globals used by page scripts
  window.BACKEND = BACKEND;
  window.logout = logout;
  window.fetchJSON = fetchJSON;
  window.showToast = toast;
})(window);
