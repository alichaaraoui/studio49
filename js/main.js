(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MARK = `<span class="br">&lt;/</span>STUDIO&nbsp;49<span class="br">&gt;</span>`;
  const LINKS = [
    ["projects.html", "Projects", "projects"],
    ["about.html", "About", "about"],
    ["team.html", "Team", "team"],
    ["contact.html", "Work with us", "contact"],
  ];
  const cur = (k) => (k === page ? ' aria-current="page"' : "");

  /* ---------- nav + mobile sheet */
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML = `
    <div class="nav__side">
      <span class="nav__meta">CLT <b data-clock>--:--</b></span>
      <nav class="nav__links" aria-label="Primary">
        ${LINKS.slice(0, 2).map(([h, t, k]) => `<a href="${h}"${cur(k)}>${t}</a>`).join("")}
      </nav>
    </div>
    <a class="nav__logo mark" href="index.html" aria-label="Studio 49 home">${MARK}</a>
    <div class="nav__side nav__side--r">
      <nav class="nav__links" aria-label="Secondary">
        ${LINKS.slice(2, 3).map(([h, t, k]) => `<a href="${h}"${cur(k)}>${t}</a>`).join("")}
      </nav>
      <a class="btn" href="contact.html">Work with us <span class="arr">↗</span></a>
      <button class="menu-btn" aria-expanded="false" aria-controls="sheet">Menu</button>
    </div>`;
  const frame = $(".frame");
  frame.prepend(nav);

  const sheet = document.createElement("div");
  sheet.className = "sheet";
  sheet.id = "sheet";
  sheet.innerHTML = `
    <div class="sheet__top"><span class="mark" style="font-size:18px">${MARK}</span><button>Close</button></div>
    <nav>${LINKS.map(([h, t], i) => `<a href="${h}"><span>0${i + 1}</span>${t}</a>`).join("")}</nav>
    <div class="sheet__foot label"><span>Charlotte, NC</span><span class="status">Inquiries open</span></div>`;
  document.body.append(sheet);
  const menuBtn = $(".menu-btn", nav);
  const toggle = (open) => {
    sheet.classList.toggle("open", open);
    menuBtn.setAttribute("aria-expanded", open);
  };
  menuBtn.addEventListener("click", () => toggle(true));
  $(".sheet__top button", sheet).addEventListener("click", () => toggle(false));

  addEventListener("scroll", () => nav.classList.toggle("is-stuck", scrollY > 8), { passive: true });

  /* ---------- footer */
  const social = [
    S.instagram && `<li><a href="${S.instagram}" target="_blank" rel="noopener">Instagram ↗</a></li>`,
    S.linkedin && `<li><a href="${S.linkedin}" target="_blank" rel="noopener">LinkedIn ↗</a></li>`,
    S.email && `<li><a href="mailto:${S.email}">${S.email}</a></li>`,
  ].filter(Boolean).join("") || `<li><a href="contact.html">Start a project →</a></li>`;

  const foot = document.createElement("footer");
  foot.className = "foot";
  foot.innerHTML = `
    <div class="foot__grid">
      <div><p class="foot__tag">Design meets code. <span class="serif muted">From brief to launch.</span></p></div>
      <div><h4 class="label">Index</h4><ul>${LINKS.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join("")}</ul></div>
      <div><h4 class="label">Contact</h4><ul>${social}</ul></div>
      <div><h4 class="label">Studio</h4><ul><li>Charlotte, NC</li><li>Local <span data-clock>--:--</span></li><li class="status">Inquiries open</li></ul></div>
    </div>
    <div class="foot__big mark" aria-hidden="true">${MARK}</div>
    <div class="foot__base label"><span>© ${new Date().getFullYear()} Studio 49</span><span>Built in-house</span><a href="#top">Back to top ↑</a></div>`;
  if (page !== "home") frame.append(foot);

  /* ---------- clock (Charlotte) */
  const clock = () => {
    const t = new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" }).format(new Date());
    $$("[data-clock]").forEach((el) => (el.textContent = t));
  };
  clock();
  setInterval(clock, 15000);

  /* ---------- reveal on scroll */
  const io = new IntersectionObserver(
    (es) => es.forEach((e) => e.isIntersecting && (e.target.classList.add("in"), io.unobserve(e.target))),
    { rootMargin: "0px 0px -8% 0px" }
  );
  $$(".rv").forEach((el) => io.observe(el));

  /* ---------- landing: dot field you can draw into */
  const cv = $(".field");
  if (cv) {
    const stage = cv.parentElement;
    const ctx = cv.getContext("2d");
    const GLYPHS = {
      4: ["00010", "00110", "01010", "10010", "11111", "00010", "00010"],
      9: ["01110", "10001", "10001", "01111", "00001", "00010", "01100"],
    };
    let C, cols, rows, heat, ink, glyph, order, shown, raf, dpr;
    const hint = $(".stage__hint");

    const setup = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const { width: w, height: h } = stage.getBoundingClientRect();
      C = w < 720 ? 12 : 14;
      cv.width = w * dpr;
      cv.height = h * dpr;
      cols = Math.ceil(w / C);
      rows = Math.ceil(h / C);
      heat = new Float32Array(cols * rows);
      ink = new Uint8Array(cols * rows);
      glyph = new Uint8Array(cols * rows);
      const k = Math.max(2, Math.min(5, Math.floor((rows * 0.4) / 7)));
      const gw = 11 * k, gh = 7 * k;
      const c0 = Math.floor((w < 720 ? cols * 0.5 : cols * 0.66) - gw / 2);
      const r0 = Math.max(2, Math.floor(rows * (w < 720 ? 0.3 : 0.4) - gh / 2));
      order = [];
      ["4", "9"].forEach((d, di) =>
        GLYPHS[d].forEach((line, y) =>
          [...line].forEach((b, x) => {
            if (b !== "1") return;
            for (let i = 0; i < k; i++)
              for (let j = 0; j < k; j++) {
                const c = c0 + (di * 6 + x) * k + i, r = r0 + y * k + j;
                if (c >= 0 && c < cols && r < rows) order.push(r * cols + c);
              }
          })
        )
      );
      order.sort(() => Math.random() - 0.5);
      shown = reduce ? order.length : 0;
      order.slice(0, shown).forEach((i) => (glyph[i] = 1));
      kick();
    };

    const draw = () => {
      raf = 0;
      if (shown < order.length) {
        for (let n = 0; n < 6 && shown < order.length; n++) glyph[order[shown++]] = 1;
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      let live = shown < order.length;
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c, x = c * C, y = r * C;
          if (ink[i] || glyph[i]) {
            ctx.fillStyle = "#0b0b0c";
            ctx.fillRect(x + 1, y + 1, C - 2, C - 2);
          } else if (heat[i] > 0.02) {
            const s = (C - 2) * heat[i];
            ctx.fillStyle = `rgba(11,11,12,${0.15 + heat[i] * 0.7})`;
            ctx.fillRect(x + C / 2 - s / 2, y + C / 2 - s / 2, s, s);
            heat[i] *= 0.93;
            live = true;
          } else {
            heat[i] = 0;
            ctx.fillStyle = "rgba(11,11,12,0.2)";
            ctx.fillRect(x + C / 2 - 1, y + C / 2 - 1, 2, 2);
          }
        }
      if (live) kick();
    };
    const kick = () => (raf ||= requestAnimationFrame(draw));

    let down = false, last = null;
    const paint = (x, y) => {
      const c = Math.floor(x / C), r = Math.floor(y / C);
      for (let dr = -1; dr <= 1; dr++)
        for (let dc = -1; dc <= 1; dc++) {
          const cc = c + dc, rr = r + dr;
          if (cc < 0 || rr < 0 || cc >= cols || rr >= rows) continue;
          const i = rr * cols + cc;
          if (down && !dr && !dc) ink[i] = 1;
          heat[i] = Math.max(heat[i], dr || dc ? 0.5 : 1);
        }
    };
    const move = (e) => {
      const b = cv.getBoundingClientRect();
      const p = { x: e.clientX - b.left, y: e.clientY - b.top };
      const steps = last ? Math.ceil(Math.hypot(p.x - last.x, p.y - last.y) / (C / 2)) : 1;
      for (let s = 1; s <= steps; s++)
        paint(last ? last.x + ((p.x - last.x) * s) / steps : p.x, last ? last.y + ((p.y - last.y) * s) / steps : p.y);
      last = p;
      kick();
    };
    cv.addEventListener("pointerdown", (e) => {
      down = true;
      last = null;
      cv.setPointerCapture(e.pointerId);
      stage.classList.add("drawn");
      move(e);
    });
    cv.addEventListener("pointermove", move);
    addEventListener("pointerup", () => (down = false));
    cv.addEventListener("pointerleave", () => (last = null));
    cv.addEventListener("dblclick", () => {
      ink.fill(0);
      kick();
    });

    let rt;
    addEventListener("resize", () => {
      clearTimeout(rt);
      rt = setTimeout(setup, 150);
    });
    setup();
  }

  /* ---------- services accordion */
  $$(".svc").forEach((svc) => {
    const btn = $(".svc__row", svc);
    btn.addEventListener("click", () => {
      const open = !svc.classList.contains("open");
      svc.classList.toggle("open", open);
      btn.setAttribute("aria-expanded", open);
    });
  });

  /* ---------- team: name roll on home */
  const roll = $("[data-roll]");
  if (roll) {
    roll.innerHTML = S.people
      .map((p) => `<a href="team.html">${p.name}</a>`)
      .join('<span class="sl">/</span>');
  }
  $$("[data-count]").forEach((el) => (el.textContent = String(S.people.length).padStart(2, "0")));

  /* ---------- team page */
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("").toUpperCase();

  const cards = $("[data-board]");
  if (cards) {
    cards.innerHTML = S.people
      .filter((p) => p.exec)
      .map(
        (p, i) => `
        <article class="card rv">
          <div class="card__tile">
            <span class="label">${(p.teams[0] && S.teams[p.teams[0]]?.name) || "Studio"}</span>
            <span class="no">${String(i + 1).padStart(2, "0")}</span>
            <span class="pixel">${initials(p.name)}</span>
          </div>
          <div class="card__name">${p.name}</div>
          <div class="card__role">${p.role}</div>
        </article>`
      )
      .join("");
    $$(".rv", cards).forEach((el) => io.observe(el));
  }

  const dir = $("[data-dir]");
  if (dir) {
    const body = $("tbody", dir);
    const input = $("[data-search]");
    const chips = $("[data-chips]");
    const empty = $(".dir-empty");
    let filter = "all";

    chips.innerHTML =
      `<button class="chip" aria-pressed="true" data-t="all">All</button>` +
      Object.entries(S.teams)
        .map(([k, t]) => `<button class="chip" aria-pressed="false" data-t="${k}"><span class="glyph">${t.glyph}</span>${t.name}</button>`)
        .join("");

    const render = () => {
      const q = input.value.trim().toLowerCase();
      const rows = S.people.filter(
        (p) => (filter === "all" || p.teams.includes(filter)) && (!q || `${p.name} ${p.role}`.toLowerCase().includes(q))
      );
      body.innerHTML = rows
        .map(
          (p, i) => `
          <tr>
            <td><span class="idx">${String(i + 1).padStart(2, "0")}</span>${p.name}</td>
            <td><div class="teams">${
              p.teams.length
                ? p.teams.map((k) => `<span class="chip"><span class="glyph">${S.teams[k].glyph}</span>${S.teams[k].name}</span>`).join("")
                : `<span class="label">Studio-wide</span>`
            }</div></td>
            <td>${p.role}</td>
          </tr>`
        )
        .join("");
      empty.style.display = rows.length ? "none" : "block";
    };
    chips.addEventListener("click", (e) => {
      const b = e.target.closest(".chip");
      if (!b) return;
      filter = b.dataset.t;
      $$(".chip", chips).forEach((c) => c.setAttribute("aria-pressed", c === b));
      render();
    });
    input.addEventListener("input", render);
    $("[data-clear]").addEventListener("click", () => {
      input.value = "";
      render();
      input.focus();
    });
    render();
  }

  /* ---------- tabs (team page: Board / Directory) */
  $$("[data-tabs]").forEach((tabs) => {
    const btns = $$("button", tabs);
    btns.forEach((b) =>
      b.addEventListener("click", () => {
        btns.forEach((x) => {
          x.setAttribute("aria-selected", x === b);
          $(`#${x.getAttribute("aria-controls")}`).hidden = x !== b;
        });
      })
    );
  });

  /* ---------- work-with-us form */
  const form = $("[data-form]");
  if (form) {
    const status = $("[data-form-status]");
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      if (!form.reportValidity()) return;
      const fd = new FormData(form);
      if (fd.get("_gotcha")) return;
      const types = fd.getAll("type").join(", ") || "—";
      const btn = $("button[type=submit]", form);

      if (S.formEndpoint) {
        btn.disabled = true;
        btn.firstChild.textContent = "Sending… ";
        try {
          const res = await fetch(S.formEndpoint, { method: "POST", body: fd, headers: { Accept: "application/json" } });
          if (!res.ok) throw new Error(res.status);
          form.classList.add("sent");
          scrollTo({ top: form.parentElement.offsetTop - 80, behavior: reduce ? "auto" : "smooth" });
        } catch {
          status.textContent = "That didn't go through. Try again in a moment.";
          btn.disabled = false;
          btn.firstChild.textContent = "Send inquiry ";
        }
        return;
      }

      if (S.email) {
        const lines = [
          `Name: ${fd.get("name")}`,
          `Email: ${fd.get("email")}`,
          `Organization: ${fd.get("org") || "—"}`,
          `Looking for: ${types}`,
          `Timeline: ${fd.get("timeline") || "—"}`,
          `Budget: ${fd.get("budget") || "—"}`,
          "",
          fd.get("message"),
        ];
        location.href = `mailto:${S.email}?subject=${encodeURIComponent(`Project inquiry — ${fd.get("org") || fd.get("name")}`)}&body=${encodeURIComponent(lines.join("\n"))}`;
        return;
      }

      status.textContent = "The inbox isn't connected yet. Check back soon.";
    });
  }
})();
