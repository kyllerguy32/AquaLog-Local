function renderNav(activePage) {
  const user = AquaDB.getUser();
  const initials = user ? user.name.charAt(0).toUpperCase() : '?';
  const logoUrl = 'https://i.ibb.co/XfF9nN4X/Chat-GPT-Image-May-11-2026-05-18-16-PM.png';
  const logo = `<img src="${logoUrl}" alt="AquaLog logo" class="brand-logo-img">`;

  const links = [
    { href: 'dashboard.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/></svg>`, label: 'Dashboard', key: 'dashboard' },
    { href: 'tanks.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M2 12h20M2 18h20M2 6h20"/><path d="M5 6c0-2 1.5-3 3-3s3 1 3 3"/></svg>`, label: 'My Tanks', key: 'tanks' },
    { href: 'water-tests.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2V9M9 21H5a2 2 0 01-2-2V9m0 0h18"/></svg>`, label: 'Water Tests', key: 'tests' },
    { href: 'livestock.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"/></svg>`, label: 'Livestock', key: 'livestock' },
    { href: 'maintenance.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14.7 6.3a1 1 0 000 1.4l1.6 1.6a1 1 0 001.4 0l3.77-3.77a6 6 0 01-7.94 7.94l-6.91 6.91a2.12 2.12 0 01-3-3l6.91-6.91a6 6 0 017.94-7.94l-3.76 3.76z"/></svg>`, label: 'Maintenance', key: 'maintenance' },
  ];

  const systemLinks = [
    { href: 'settings.html', icon: `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 00.33 1.82l.06.06a2 2 0 010 2.83 2 2 0 01-2.83 0l-.06-.06a1.65 1.65 0 00-1.82-.33 1.65 1.65 0 00-1 1.51V21a2 2 0 01-2 2 2 2 0 01-2-2v-.09A1.65 1.65 0 009 19.4a1.65 1.65 0 00-1.82.33l-.06.06a2 2 0 01-2.83 0 2 2 0 010-2.83l.06-.06A1.65 1.65 0 004.68 15a1.65 1.65 0 00-1.51-1H3a2 2 0 01-2-2 2 2 0 012-2h.09A1.65 1.65 0 004.6 9a1.65 1.65 0 00-.33-1.82l-.06-.06a2 2 0 010-2.83 2 2 0 012.83 0l.06.06A1.65 1.65 0 009 4.68a1.65 1.65 0 001-1.51V3a2 2 0 012-2 2 2 0 012 2v.09a1.65 1.65 0 001 1.51 1.65 1.65 0 001.82-.33l.06-.06a2 2 0 012.83 0 2 2 0 010 2.83l-.06.06A1.65 1.65 0 0019.4 9a1.65 1.65 0 001.51 1H21a2 2 0 012 2 2 2 0 01-2 2h-.09a1.65 1.65 0 00-1.51 1z"/></svg>`, label: 'Settings', key: 'settings' },
  ];

  return `
    <aside class="sidebar" id="sidebar">
      <div class="sidebar-logo">
        <div class="logo-icon">${logo}</div>
        <div class="logo-text">Aqua<span>Log</span></div>
      </div>
      <nav class="sidebar-nav">
        <div class="nav-label">Aquariums</div>
        ${links.map(l => `
          <a href="${l.href}" class="nav-link ${l.key === activePage ? 'active' : ''}">
            ${l.icon} <span>${l.label}</span>
          </a>
        `).join('')}
        <div class="nav-label" style="margin-top:8px">System</div>
        ${systemLinks.map(l => `
          <a href="${l.href}" class="nav-link ${l.key === activePage ? 'active' : ''}">
            ${l.icon} <span>${l.label}</span>
          </a>
        `).join('')}
      </nav>
      <div class="sidebar-footer">
        <div class="user-pill">
          <div class="user-avatar">${initials}</div>
          <div class="user-name">${user ? user.name : 'Guest'}</div>
          <button class="btn-icon" onclick="AquaDB.logout()" title="Sign out">
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 01-2-2V5a2 2 0 012-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          </button>
        </div>
      </div>
    </aside>
    <div class="mobile-header">
      <div style="display:flex;align-items:center;gap:10px">
        <div class="mobile-brand-mark">${logo}</div>
        <span class="mobile-brand-name">AquaLog</span>
      </div>
      <button onclick="document.getElementById('sidebar').classList.toggle('open')" style="background:none;border:none;cursor:pointer;color:var(--text)">
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>
      </button>
    </div>
  `;
}

function toast(msg, type = 'ok') {
  let container = document.getElementById('toast-container');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toast-container';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }
  const toastEl = document.createElement('div');
  toastEl.className = `toast toast-${type}`;
  toastEl.innerHTML = `<span>${type === 'ok' ? 'OK' : 'ERR'}</span> ${msg}`;
  container.appendChild(toastEl);
  setTimeout(() => toastEl.remove(), 3500);
}

(function initAquaUI() {
  if (window.AquaUI) return;

  function navigate(url) {
    if (!url) return;
    const target = new URL(url, window.location.href);
    if (target.href === window.location.href) return;
    if (document.body.classList.contains('page-leaving')) return;
    document.body.classList.add('page-leaving');
    window.setTimeout(() => {
      window.location.href = target.href;
    }, 320);
  }

  function shouldHandleLink(event, link) {
    if (!link) return false;
    if (event.defaultPrevented || event.button !== 0) return false;
    if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey) return false;
    if (link.target && link.target !== '_self') return false;
    if (link.hasAttribute('download')) return false;
    const target = new URL(link.href, window.location.href);
    if (target.origin !== window.location.origin) return false;
    if (!target.pathname.endsWith('.html')) return false;
    if (target.pathname === window.location.pathname && target.search === window.location.search) return false;
    return true;
  }

  function markReady() {
    if (document.body) document.body.classList.remove('page-leaving');
  }

  window.AquaUI = { navigate };

  function enhanceSelect(select) {
    if (!select || select.dataset.aquaEnhanced === '1') return;
    if (select.closest('.aqua-select')) return;

    select.dataset.aquaEnhanced = '1';
    select.classList.add('form-select-native');

    const wrap = document.createElement('div');
    wrap.className = 'aqua-select';
    const isCompact = select.classList.contains('select-compact') || select.style.width === 'auto';
    if (isCompact) {
      wrap.classList.add('compact');
    }

    const trigger = document.createElement('button');
    trigger.type = 'button';
    trigger.className = 'form-select aqua-select-trigger';

    const value = document.createElement('span');
    value.className = 'select-value';

    const chevron = document.createElement('span');
    chevron.className = 'aqua-select-chevron';

    const menu = document.createElement('div');
    menu.className = 'aqua-select-menu';

    wrap.append(trigger);
    select.parentNode.insertBefore(wrap, select);
    wrap.appendChild(select);
    document.body.appendChild(menu);
    trigger.append(value, chevron);

    let cleanupPosition = null;

    const syncLabel = () => {
      const opt = select.selectedOptions[0];
      value.textContent = opt ? opt.textContent.trim() : 'Select';
      menu.querySelectorAll('[aria-selected="true"]').forEach(el => el.setAttribute('aria-selected', 'false'));
      const active = menu.querySelector(`[data-value="${CSS.escape(select.value)}"]`);
      if (active) active.setAttribute('aria-selected', 'true');
    };

    const close = () => {
      wrap.classList.remove('open');
      trigger.setAttribute('aria-expanded', 'false');
      menu.style.opacity = '0';
      menu.style.pointerEvents = 'none';
      menu.style.transform = 'translateY(-6px) scale(0.98)';
      if (cleanupPosition) {
        cleanupPosition();
        cleanupPosition = null;
      }
    };

    const open = () => {
      wrap.classList.add('open');
      trigger.setAttribute('aria-expanded', 'true');
      const rect = trigger.getBoundingClientRect();
      const width = Math.max(rect.width, 180);
      const viewportWidth = window.innerWidth;
      const left = Math.min(rect.left, viewportWidth - width - 12);
      const top = rect.bottom + 10;
      menu.style.left = `${Math.max(12, left)}px`;
      menu.style.top = `${top}px`;
      menu.style.width = `${width}px`;
      menu.style.opacity = '1';
      menu.style.pointerEvents = 'auto';
      menu.style.transform = 'translateY(0) scale(1)';
      const reposition = () => {
        const r = trigger.getBoundingClientRect();
        const nextLeft = Math.min(r.left, window.innerWidth - width - 12);
        menu.style.left = `${Math.max(12, nextLeft)}px`;
        menu.style.top = `${r.bottom + 10}px`;
      };
      window.addEventListener('scroll', reposition, true);
      window.addEventListener('resize', reposition);
      cleanupPosition = () => {
        window.removeEventListener('scroll', reposition, true);
        window.removeEventListener('resize', reposition);
      };
    };

    const renderMenu = () => {
      menu.innerHTML = '';
      Array.from(select.options).forEach((option) => {
        const item = document.createElement('button');
        item.type = 'button';
        item.className = 'aqua-select-option';
        item.textContent = option.textContent;
        item.dataset.value = option.value;
        item.setAttribute('role', 'option');
        item.setAttribute('aria-selected', option.selected ? 'true' : 'false');
        item.addEventListener('click', () => {
          select.value = option.value;
          select.dispatchEvent(new Event('change', { bubbles: true }));
          syncLabel();
          close();
        });
        menu.appendChild(item);
      });
      syncLabel();
    };

    trigger.setAttribute('aria-haspopup', 'listbox');
    trigger.setAttribute('aria-expanded', 'false');
    trigger.addEventListener('click', (event) => {
      event.stopPropagation();
      const shouldOpen = !wrap.classList.contains('open');
      document.querySelectorAll('.aqua-select.open').forEach(el => {
        if (el !== wrap) {
          const btn = el.querySelector('.aqua-select-trigger');
          if (btn) btn.click();
        }
      });
      if (shouldOpen) open();
      else close();
    });

    select.addEventListener('change', syncLabel);
    select.addEventListener('focus', open);

    renderMenu();

    const observer = new MutationObserver(renderMenu);
    observer.observe(select, { childList: true, subtree: false, attributes: true, attributeFilter: ['value'] });
    select.__aquaObserver = observer;
  }

    function enhanceSelects(root = document) {
    root.querySelectorAll('select.form-select, select#tank-switcher, .tank-select-bar select').forEach((select) => {
      if (select.closest('.aqua-select')) return;
      enhanceSelect(select);
    });
  }

  document.addEventListener('click', (event) => {
    const link = event.target.closest('a[href]');
    if (!shouldHandleLink(event, link)) return;
    event.preventDefault();
    navigate(link.href);
    return;
  });

  document.addEventListener('click', (event) => {
    if (!event.target.closest('.aqua-select')) {
      document.querySelectorAll('.aqua-select.open').forEach(el => {
        const btn = el.querySelector('.aqua-select-trigger');
        if (btn) btn.click();
      });
    }
  });

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', markReady, { once: true });
  } else {
    markReady();
  }

  const startEnhancing = () => enhanceSelects(document);
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', startEnhancing, { once: true });
  } else {
    startEnhancing();
  }

  const bodyObserver = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === 1) enhanceSelects(node);
      });
    }
  });
  bodyObserver.observe(document.documentElement, { childList: true, subtree: true });

  window.addEventListener('pageshow', markReady);
})();
