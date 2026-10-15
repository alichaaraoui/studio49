(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  /* nav: a row of boxed pills */
  const cur = (k) => (k === page ? ' aria-current="page"' : "");
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <a href="about.html"${cur("about")}>About</a>
    <a class="oval" href="projects.html"${cur("projects")}>Projects</a>
    <a class="logo" href="index.html"${cur("home")}><i></i>Studio 49</a>
    <a class="oval" href="team.html"${cur("team")}>Team</a>
    <a href="contact.html"${cur("contact")}>Contact</a>`;
  document.body.prepend(nav);

  /* footer (inner pages) */
  if (page !== "home") {
    const f = document.createElement("footer");
    f.className = "foot";
    f.innerHTML = `<span>© ${new Date().getFullYear()} Studio 49</span><span>${
      S.email ? `<a href="mailto:${S.email}">${S.email}</a> · ` : ""
    }<a href="contact.html">Work with us</a></span>`;
    document.body.append(f);
  }

  /* tabs */
  $$("[data-tabs]").forEach((tabs) => {
    const btns = $$("button", tabs);
    btns.forEach((b) =>
      b.addEventListener("click", () =>
        btns.forEach((x) => {
          x.setAttribute("aria-selected", x === b);
          document.getElementById(x.getAttribute("aria-controls")).hidden = x !== b;
        })
      )
    );
  });

  /* home: liquid gold. Blobs merge through a goo filter; light and a tendril follow you. */
  const blobs = $("[data-blobs]");
  if (blobs) {
    const svg = blobs.ownerSVGElement;
    const light = $("#light");
    const home = $(".home");
    const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const NS = "http://www.w3.org/2000/svg";
    const make = (r) => { const c = document.createElementNS(NS, "circle"); c.setAttribute("r", r); blobs.append(c); return c; };
    const core = { el: make(118), x: 300, y: 300 };
    const orbit = Array.from({ length: 8 }, (_, i) => ({
      el: make(18 + ((i * 7) % 30)), a: (i / 8) * Math.PI * 2, sp: 0.25 + ((i * 13) % 9) / 20, dist: 120 + ((i * 29) % 90), ph: i * 1.7,
    }));
    const tip = { el: make(34), x: 300, y: 300, vx: 0, vy: 0 };
    let splash = [], ptr = null, lx = 200, ly = 120;

    const toSvg = (e) => { const b = svg.getBoundingClientRect(); return { x: ((e.clientX - b.left) / b.width) * 600, y: ((e.clientY - b.top) / b.height) * 600 }; };
    addEventListener("pointermove", (e) => { ptr = toSvg(e); }, { passive: true });
    home.addEventListener("pointerleave", () => (ptr = null));
    home.addEventListener("pointerdown", (e) => {
      if (e.target.closest("a")) return;
      const p = toSvg(e);
      home.classList.add("played");
      for (let i = 0; i < 9; i++) {
        const a = Math.random() * Math.PI * 2, v = 6 + Math.random() * 9;
        splash.push({ el: make(8 + Math.random() * 16), x: p.x, y: p.y, vx: Math.cos(a) * v, vy: Math.sin(a) * v, life: 1 });
      }
    });

    const set = (b, x, y) => { b.el.setAttribute("cx", x.toFixed(1)); b.el.setAttribute("cy", y.toFixed(1)); };
    const tick = (now) => {
      const t = now / 1000;
      set(core, 300 + Math.sin(t * 0.7) * 10, 300 + Math.cos(t * 0.5) * 8);
      core.el.setAttribute("r", (116 + Math.sin(t * 1.3) * 6).toFixed(1));
      for (const o of orbit) {
        const d = o.dist + Math.sin(t * 0.9 + o.ph) * 55;
        set(o, 300 + Math.cos(o.a + t * o.sp) * d, 300 + Math.sin(o.a + t * o.sp) * d * 0.86);
      }
      // the tendril reaches toward the pointer, but stays attached to the pool
      let tx = 300, ty = 300;
      if (ptr) {
        const dx = ptr.x - 300, dy = ptr.y - 300, m = Math.hypot(dx, dy), k = Math.min(m, 230) / (m || 1);
        tx = 300 + dx * k; ty = 300 + dy * k;
        home.classList.add("played");
      }
      tip.vx = (tip.vx + (tx - tip.x) * 0.04) * 0.86;
      tip.vy = (tip.vy + (ty - tip.y) * 0.04) * 0.86;
      tip.x += tip.vx; tip.y += tip.vy;
      set(tip, tip.x, tip.y);
      // light drifts toward the pointer so the shine slides over the surface
      lx += ((ptr ? ptr.x : 300 + Math.cos(t * 0.4) * 220) - lx) * 0.05;
      ly += ((ptr ? ptr.y - 160 : 120 + Math.sin(t * 0.3) * 80) - ly) * 0.05;
      light.setAttribute("x", lx.toFixed(1)); light.setAttribute("y", ly.toFixed(1));
      // splashes fly out, then get pulled back into the pool
      splash = splash.filter((d) => {
        d.vx = (d.vx + (300 - d.x) * 0.006) * 0.95;
        d.vy = (d.vy + (300 - d.y) * 0.006) * 0.95;
        d.x += d.vx; d.y += d.vy; d.life -= 0.006;
        set(d, d.x, d.y);
        if (d.life <= 0) { d.el.remove(); return false; }
        return true;
      });
      if (!still) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  }

  /* projects: a small still drop of gold in each frame */
  $$("[data-drop]").forEach((el, i) => {
    let n = +el.dataset.drop;
    const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
    const dots = Array.from({ length: 5 }, () => `<circle cx="${(200 + (rnd() - 0.5) * 150).toFixed(0)}" cy="${(200 + (rnd() - 0.5) * 110).toFixed(0)}" r="${(30 + rnd() * 50).toFixed(0)}"/>`).join("");
    el.innerHTML = `<svg viewBox="0 0 400 400"><defs>
      <linearGradient id="d${i}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff1c4"/><stop offset=".4" stop-color="#e2bd62"/><stop offset=".75" stop-color="#a77d2c"/><stop offset="1" stop-color="#5e4212"/></linearGradient>
      <filter id="f${i}" x="-30%" y="-30%" width="160%" height="160%"><feGaussianBlur stdDeviation="14" result="b"/><feColorMatrix in="b" values="1 0 0 0 0 0 1 0 0 0 0 0 1 0 0 0 0 0 30 -13" result="g"/><feGaussianBlur in="g" stdDeviation="6" result="s"/><feSpecularLighting in="s" surfaceScale="6" specularConstant="1.1" specularExponent="24" lighting-color="#fff7dd" result="l"><fePointLight x="80" y="40" z="260"/></feSpecularLighting><feComposite in="l" in2="g" operator="in" result="h"/><feComposite in="g" in2="h" operator="arithmetic" k2="1" k3="1"/></filter>
    </defs><g filter="url(#f${i})" fill="url(#d${i})">${dots}</g></svg>`;
  });

  /* team */
  const shades = { leadership: "#8a6420", design: "#e2bd62", engineering: "#111", clients: "#bdb8ad", operations: "#a77d2c" };
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  const board = $("[data-board]");
  if (board)
    board.innerHTML = S.people
      .filter((p) => p.exec)
      .map((p) => `<div class="card"><div class="portrait"><span>${initials(p.name)}</span></div><p>${p.name}</p><p class="grey">${p.role}</p></div>`)
      .join("");

  const dir = $("[data-dir]");
  if (dir) {
    const input = $("[data-search]");
    const filters = $("[data-filters]");
    let team = "all";
    filters.innerHTML =
      `<button class="chip" aria-pressed="true" data-t="all">All</button>` +
      Object.entries(S.teams).map(([k, t]) => `<button class="chip" aria-pressed="false" data-t="${k}"><span class="dot" style="--c:${shades[k]}"></span>${t.name}</button>`).join("");
    const render = () => {
      const q = input.value.trim().toLowerCase();
      dir.innerHTML = S.people
        .filter((p) => (team === "all" || p.teams.includes(team)) && (!q || `${p.name} ${p.role}`.toLowerCase().includes(q)))
        .map((p) => `<tr><td>${p.name}</td><td><div class="chips">${p.teams.map((k) => `<span class="chip"><span class="dot" style="--c:${shades[k]}"></span>${S.teams[k].name}</span>`).join("") || '<span class="grey">Studio-wide</span>'}</div></td><td>${p.role}</td></tr>`)
        .join("");
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      team = b.dataset.t;
      $$("button", filters).forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
    });
    input.addEventListener("input", render);
    render();
  }

  /* form */
  const form = $("[data-form]");
  if (form) {
    const status = $("[data-status]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      if (fd.get("_gotcha")) return;
      if (S.formEndpoint) {
        const btn = $(".send", form);
        btn.disabled = true;
        btn.textContent = "Sending…";
        try {
          const res = await fetch(S.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.status);
          form.classList.add("sent");
        } catch {
          status.textContent = "That didn't go through. Please try again.";
          btn.disabled = false;
          btn.textContent = "Send";
        }
      } else if (S.email) {
        const body = [`Name: ${fd.get("name")}`, `Email: ${fd.get("email")}`, `Organization: ${fd.get("org") || "—"}`, `Needs: ${fd.getAll("type").join(", ") || "—"}`, `Timeline: ${fd.get("timeline") || "—"}`, `Budget: ${fd.get("budget") || "—"}`, "", fd.get("message")].join("\n");
        location.href = `mailto:${S.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(body)}`;
      } else {
        status.textContent = "Our inbox isn't connected yet. Check back soon.";
      }
    });
  }
})();
