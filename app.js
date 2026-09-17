(() => {
  'use strict';
  const data = window.PORTFOLIO;
  if (!data) return;
  const reducedQuery = matchMedia('(prefers-reduced-motion: reduce)');
  const finePointer = matchMedia('(hover: hover) and (pointer: fine)');
  const $ = (s, root = document) => root.querySelector(s);
  const $$ = (s, root = document) => [...root.querySelectorAll(s)];
  const escape = (s) => String(s).replace(/[&<>"']/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
  const short = (n) => n >= 1e9 ? `${(n / 1e9).toFixed(2)}b` : n >= 1e6 ? `${(n / 1e6).toFixed(1)}m` : n >= 1e3 ? `${(n / 1e3).toFixed(1)}k` : String(n);
  const number = (n) => n.toLocaleString('en-US');
  function highlight(code) {
    const tokens = /(--[^\n]*|"[^"\n]*"|'[^'\n]*'|\b(?:local|function|if|then|end|return|or|and|not|else|elseif|true|false|nil)\b|\b\d+(?:\.\d+)?\b)/g;
    let last = 0, html = '';
    for (const m of code.matchAll(tokens)) {
      html += escape(code.slice(last, m.index));
      const text = m[0];
      const cls = text.startsWith('--') ? 'comment' : /^["']/.test(text) ? 'str' : /^\d/.test(text) ? 'num' : 'kw';
      html += `<span class="${cls}">${escape(text)}</span>`;
      last = m.index + text.length;
    }
    return html + escape(code.slice(last));
  }
  const typing = new Map();
  function typeCode(el, source, duration = 1300) {
    if (typing.has(el)) cancelAnimationFrame(typing.get(el));
    if (reducedQuery.matches) { el.innerHTML = highlight(source); return; }
    let started;
    function tick(now) {
      if (!started) started = now;
      const done = reducedQuery.matches ? 1 : Math.min(1, (now - started) / duration);
      el.innerHTML = highlight(source.slice(0, Math.floor(source.length * done)));
      if (done < 1) typing.set(el, requestAnimationFrame(tick));
      else typing.delete(el);
    }
    typing.set(el, requestAnimationFrame(tick));
  }
  $('#year').textContent = new Date().getFullYear();
  $('#hero-code').innerHTML = highlight(data.heroCode);
  let alreadyVisited = false;
  try { alreadyVisited = sessionStorage.getItem('xclaqz-intro') === 'shown'; sessionStorage.setItem('xclaqz-intro', 'shown'); } catch (_) { /* storage is optional */ }
  if (alreadyVisited || reducedQuery.matches) $('#intro').remove();
  else setTimeout(() => $('#intro')?.remove(), 1400);
  setTimeout(() => typeCode($('#hero-code'), data.heroCode, 1550), alreadyVisited ? 200 : 900);

  $('#game-list').innerHTML = data.games.map(g => `<a class="game-row reveal" href="https://www.roblox.com/games/${g.placeId}" target="_blank" rel="noopener noreferrer" aria-label="${escape(g.name)}, ${number(g.visits)} visits, ${number(g.favorites)} favorites. Opens Roblox.">
    <div class="game-name"><h3>${escape(g.name)}</h3><span>${escape(g.creator)}</span></div>
    <span class="game-genre mono">${escape(g.genre)}</span>
    <div class="game-number" title="${number(g.visits)} visits"><strong>${short(g.visits)}</strong><span>visits</span></div>
    <div class="game-number" title="${number(g.favorites)} favorites"><strong>${short(g.favorites)}</strong><span>favorites</span></div>
    <span class="game-arrow" aria-hidden="true">↗</span></a>`).join('');
  $$('.source-note').find(el => el.textContent.includes('Game-wide'))?.insertAdjacentHTML('beforeend', ` <a class="inline-source" href="${escape(data.statsSource)}" target="_blank" rel="noopener noreferrer">view source ↗</a>`);
  $$('[data-type]').forEach(el => { el.innerHTML = highlight(data.projects[el.dataset.type].card); });
  if ('IntersectionObserver' in window && !reducedQuery.matches) {
    document.body.classList.add('js-motion');
    const observer = new IntersectionObserver(entries => entries.forEach(entry => {
      if (!entry.isIntersecting) return;
      entry.target.classList.add('visible');
      const code = $('[data-type]', entry.target);
      if (code) typeCode(code, data.projects[code.dataset.type].card);
      observer.unobserve(entry.target);
    }), {threshold:0.08});
    $$('.reveal').forEach(el => observer.observe(el));
    reducedQuery.addEventListener('change', () => {
      if (reducedQuery.matches) { observer.disconnect(); document.body.classList.remove('js-motion'); }
    });
  }
  const glow = $('#pointer-glow');
  let mouseFrame = 0;
  document.addEventListener('pointermove', e => {
    if (!finePointer.matches || reducedQuery.matches || mouseFrame) return;
    mouseFrame = requestAnimationFrame(() => {
      glow.style.left = e.clientX + 'px'; glow.style.top = e.clientY + 'px'; mouseFrame = 0;
    });
  }, {passive:true});
  document.addEventListener('pointerdown', e => {
    if (!finePointer.matches || reducedQuery.matches || e.button !== 0) return;
    const ripple = document.createElement('span');
    ripple.className = 'click-ripple'; ripple.setAttribute('aria-hidden','true');
    ripple.style.left = e.clientX + 'px'; ripple.style.top = e.clientY + 'px';
    document.body.append(ripple); ripple.addEventListener('animationend', () => ripple.remove(), {once:true});
  }, {passive:true});
  let toastTimer;
  function toast(message) {
    const el = $('#toast'); el.textContent = message; el.classList.add('show');
    clearTimeout(toastTimer); toastTimer = setTimeout(() => el.classList.remove('show'), 3500);
  }
  $('#copy-discord').addEventListener('click', async () => {
    try {
      await navigator.clipboard.writeText('xclaqz');
      toast('discord username copied — xclaqz');
      $('.copy-label').textContent = 'copied ✓';
      setTimeout(() => $('.copy-label').textContent = 'copy ↗', 3000);
    } catch (_) { toast('discord username: xclaqz — select and copy it manually.'); }
  });

  const dialog = $('#project-dialog');
  let projectKey = 'anticheat', lastOpener, jumpFrame = 0;
  function stopJump() { cancelAnimationFrame(jumpFrame); jumpFrame = 0; }
  function selectTab(name) {
    for (const tabName of ['code','demo']) {
      const active = tabName === name;
      const tab = $(`#${tabName}-tab`);
      tab.setAttribute('aria-selected', String(active)); tab.tabIndex = active ? 0 : -1;
      $(`#${tabName}-panel`).hidden = !active;
    }
    if (name === 'demo') { renderDemo(); }
    else { stopJump(); typeCode($('#dialog-code'), data.projects[projectKey].source, 1600); }
  }
  $$('.project-open').forEach(btn => btn.addEventListener('click', () => {
    lastOpener = btn; projectKey = btn.dataset.project;
    const project = data.projects[projectKey];
    $('#dialog-title').textContent = project.name;
    $('#dialog-description').textContent = project.description;
    $('#dialog-filename').textContent = project.file;
    $('.source-note', $('#code-panel')).textContent = project.note + ' This preview displays code; it does not execute Luau.';
    dialog.showModal(); document.body.style.overflow = 'hidden'; selectTab('code');
  }));
  $('#dialog-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', e => {
    if (e.target !== dialog) return;
    const r = dialog.getBoundingClientRect();
    if (e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom) dialog.close();
  });
  dialog.addEventListener('close', () => {
    document.body.style.overflow = ''; stopJump();
    const code = $('#dialog-code'); if (typing.has(code)) {cancelAnimationFrame(typing.get(code)); typing.delete(code);}
    lastOpener?.focus();
  });
  $('#code-tab').addEventListener('click', () => selectTab('code'));
  $('#demo-tab').addEventListener('click', () => selectTab('demo'));
  $('.dialog-tabs').addEventListener('keydown', e => {
    if (!['ArrowLeft','ArrowRight','Home','End'].includes(e.key)) return;
    e.preventDefault();
    const name = e.key === 'Home' ? 'code' : e.key === 'End' ? 'demo' : $('#code-tab').getAttribute('aria-selected') === 'true' ? 'demo' : 'code';
    selectTab(name); $(`#${name}-tab`).focus();
  });
  $('#replay-code').addEventListener('click', () => typeCode($('#dialog-code'), data.projects[projectKey].source, 1800));

  function renderDemo() {
    stopJump();
    const panel = $('#demo-panel');
    if (projectKey === 'anticheat') {
      panel.innerHTML = `<p class="demo-label">speed check / horizontal displacement</p>
        <label class="demo-control" for="speed-input"><span>simulated movement speed</span><output id="speed-output" for="speed-input">16 studs/s</output></label>
        <input id="speed-input" class="demo-range" type="range" min="0" max="60" value="16" step="1">
        <div class="demo-readings"><span>sample: 0.30s</span><span>limit: 19 studs/s</span><span>allowed distance: 5.70 studs</span></div>
        <svg class="demo-graph" viewBox="0 0 620 160" role="img" aria-labelledby="speed-graph-title"><title id="speed-graph-title">Observed movement distance compared with the speed-check limit</title><path d="M35 50H585M35 110H585" stroke="#333"/><text x="35" y="35" fill="#999" font-size="12" font-family="monospace">observed displacement</text><rect id="speed-bar" x="35" y="48" height="7" rx="3" width="147" fill="#bdbdbd"/><path d="M209 42V124" stroke="#ddd" stroke-dasharray="4 5"/><text x="220" y="128" fill="#999" font-size="12" font-family="monospace">5.70 stud limit</text></svg>
        <div class="demo-result" role="status"><strong id="speed-state">accepted</strong><span id="speed-detail">4.80 studs moved / 5.70 allowed</span></div>
        <button id="speed-spike" class="button light" type="button">simulate speed spike <span>↗</span></button>
        <p class="demo-caption">Illustrative browser simulation of SpeedA’s distance comparison, not live game telemetry. In the supplied code, a failed check moves the character back to its previous recorded position.</p>`;
      const update = () => {
        const speed = Number($('#speed-input').value), distance = speed * .3, fails = distance > 19 * .3;
        $('#speed-output').value = `${speed} studs/s`;
        $('#speed-state').textContent = fails ? 'flagged → rollback' : 'accepted';
        $('#speed-detail').textContent = `${distance.toFixed(2)} studs moved / 5.70 allowed`;
        $('#speed-bar').setAttribute('width', String(distance / 18 * 550));
        $('#speed-bar').setAttribute('fill', fails ? '#dbafa3' : '#b7c5b0');
      };
      $('#speed-input').addEventListener('input', update);
      $('#speed-spike').addEventListener('click', () => {$('#speed-input').value = '45'; update();});
      update();
    } else {
      panel.innerHTML = `<p class="demo-label">jump arc / custom gravity</p><div class="demo-readings"><span>gravity: 110 studs/s²</span><span>jump speed: 36 studs/s</span><span>fall cap: 70 studs/s</span></div>
        <svg class="demo-graph" style="margin-top:20px" viewBox="0 0 620 240" role="img" aria-labelledby="jump-graph-title"><title id="jump-graph-title">Simulated jump height over time</title><path d="M45 200H590M45 30V200M45 145H590M45 90H590M45 35H590" stroke="#333"/><text x="53" y="224" fill="#999" font-size="12" font-family="monospace">0s</text><text x="530" y="224" fill="#999" font-size="12" font-family="monospace">0.65s</text><text x="54" y="24" fill="#999" font-size="12" font-family="monospace">height / studs</text><path id="jump-path" fill="none" stroke="#626262" stroke-width="2"/><path id="jump-progress" fill="none" stroke="#ddd" stroke-width="2"/><circle id="jump-point" cx="45" cy="200" r="5" fill="#eee"/></svg>
        <div class="demo-actions"><button id="jump-run" class="button light" type="button">preview jump <span>↑</span></button><p id="jump-status" role="status">ready · grounded</p></div>
        <p class="demo-caption">Illustrative browser simulation using a 60 Hz step and the source’s jump constants. It shows vertical motion only, not Roblox rendering, collision, or multiplayer behavior.</p>`;
      const points = [{t:0,h:0,v:36}]; let h = 0, v = 36, t = 0;
      while (t < 2) {
        t += 1/60; v = Math.max(v - 110/60, -70); h = Math.max(0, h + v/60);
        points.push({t,h,v}); if (h === 0) break;
      }
      const end = points.at(-1).t;
      const coords = p => `${45+(p.t/end)*545},${200-p.h*27}`;
      const path = ps => ps.map((p,i) => `${i?'L':'M'}${coords(p)}`).join(' ');
      $('#jump-path').setAttribute('d', path(points));
      function show(index) {
        const p = points[index], [x,y] = coords(p).split(',');
        $('#jump-point').setAttribute('cx',x); $('#jump-point').setAttribute('cy',y);
        $('#jump-progress').setAttribute('d',path(points.slice(0,index+1)));
        $('#jump-status').textContent = index === points.length-1 ? `landed · ${end.toFixed(2)}s airtime` : `${p.h.toFixed(2)} studs · ${p.v > 0 ? 'rising':'falling'}`;
      }
      $('#jump-run').addEventListener('click', () => {
        stopJump();
        if (reducedQuery.matches) { show(points.length-1); return; }
        let start;
        const tick = now => {
          if (!start) start = now;
          const index = Math.min(points.length-1,Math.floor((now-start)/1000*60));
          show(index);
          if (index < points.length-1 && dialog.open && !panel.hidden) jumpFrame = requestAnimationFrame(tick);
        };
        jumpFrame = requestAnimationFrame(tick);
      });
    }
  }
  $('.contact-form').addEventListener('submit', e => {
    if (location.protocol === 'file:') {
      e.preventDefault();
      $('#form-status').textContent = 'The form needs a published website. For now, email samuelljenkins01@gmail.com or contact xclaqz on Discord.';
      return;
    }
    $('#form-status').textContent = 'Continuing to FormSubmit for verification. Your message has not been confirmed as delivered yet.';
  });
})();
