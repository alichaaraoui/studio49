(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  /* nav */
  const link = (h, t, k) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`;
  const nav = document.createElement("header");
  nav.className = "nav";
  nav.innerHTML =
    link("projects.html", "Projects", "projects") +
    link("about.html", "About", "about") +
    `<a class="logo" href="index.html">studio 49</a>` +
    link("team.html", "Team", "team") +
    link("contact.html", "Contact", "contact");
  (page === "home" ? $(".home") : document.body).prepend(nav);

  /* footer (inner pages only) */
  if (page !== "home") {
    const foot = document.createElement("footer");
    foot.className = "foot";
    foot.innerHTML = `<span>© ${new Date().getFullYear()} Studio 49</span><nav>${
      S.email ? `<a href="mailto:${S.email}">${S.email}</a>` : ""
    }${S.instagram ? `<a href="${S.instagram}" target="_blank" rel="noopener">Instagram</a>` : ""}${
      S.linkedin ? `<a href="${S.linkedin}" target="_blank" rel="noopener">LinkedIn</a>` : ""
    }<a href="contact.html">Work with us</a></nav>`;
    document.body.append(foot);
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

  /* landing: dot field you can draw on */
  const cv = $(".field-cv");
  if (cv) {
    const ctx = cv.getContext("2d");
    const C = 16;
    let cols, rows, ink, trail, dpr, raf = 0, down = false, last = null;

    const setup = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const { width, height } = cv.getBoundingClientRect();
      cv.width = width * dpr;
      cv.height = height * dpr;
      cols = Math.ceil(width / C);
      rows = Math.ceil(height / C);
      ink = new Uint8Array(cols * rows);
      trail = new Float32Array(cols * rows);
      kick();
    };
    const draw = () => {
      raf = 0;
      let live = false;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, cv.width, cv.height);
      for (let r = 0; r < rows; r++)
        for (let c = 0; c < cols; c++) {
          const i = r * cols + c, x = c * C + C / 2, y = r * C + C / 2;
          if (ink[i]) {
            ctx.fillStyle = "#111";
            ctx.fillRect(x - 6, y - 6, 12, 12);
          } else {
            const t = trail[i];
            const s = 2 + t * 6;
            ctx.fillStyle = `rgba(17,17,17,${0.16 + t * 0.4})`;
            ctx.fillRect(x - s / 2, y - s / 2, s, s);
            if (t > 0.01) { trail[i] = t * 0.92; live = true; } else trail[i] = 0;
          }
        }
      if (live) kick();
    };
    const kick = () => (raf ||= requestAnimationFrame(draw));
    const hit = (x, y) => {
      const c = Math.floor(x / C), r = Math.floor(y / C);
      if (c < 0 || r < 0 || c >= cols || r >= rows) return;
      const i = r * cols + c;
      if (down) ink[i] = 1;
      trail[i] = 1;
    };
    const move = (e) => {
      const b = cv.getBoundingClientRect();
      const p = { x: e.clientX - b.left, y: e.clientY - b.top };
      const n = last ? Math.ceil(Math.hypot(p.x - last.x, p.y - last.y) / (C / 2)) : 1;
      for (let s = 1; s <= n; s++)
        hit(last ? last.x + ((p.x - last.x) * s) / n : p.x, last ? last.y + ((p.y - last.y) * s) / n : p.y);
      last = p;
      kick();
    };
    cv.addEventListener("pointerdown", (e) => { down = true; last = null; cv.setPointerCapture(e.pointerId); move(e); });
    cv.addEventListener("pointermove", move);
    cv.addEventListener("pointerleave", () => (last = null));
    addEventListener("pointerup", () => (down = false));
    cv.addEventListener("dblclick", () => { ink.fill(0); kick(); });
    let t;
    addEventListener("resize", () => { clearTimeout(t); t = setTimeout(setup, 150); });
    setup();
  }

  /* team */
  const initials = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
  const board = $("[data-board]");
  if (board)
    board.innerHTML = S.people
      .filter((p) => p.exec)
      .map((p) => `<div class="card"><div class="tile">${initials(p.name)}</div><p>${p.name}</p><p class="grey">${p.role}</p></div>`)
      .join("");

  const dir = $("[data-dir]");
  if (dir) {
    const input = $("[data-search]");
    const filters = $("[data-filters]");
    const empty = $(".empty");
    let team = "all";
    filters.innerHTML =
      `<button class="pill" aria-pressed="true" data-t="all">All</button>` +
      Object.entries(S.teams).map(([k, t]) => `<button class="pill" aria-pressed="false" data-t="${k}">${t.name}</button>`).join("");
    const render = () => {
      const q = input.value.trim().toLowerCase();
      const rows = S.people.filter(
        (p) => (team === "all" || p.teams.includes(team)) && (!q || `${p.name} ${p.role}`.toLowerCase().includes(q))
      );
      dir.innerHTML = rows
        .map((p) => `<tr><td>${p.name}</td><td class="grey">${p.teams.map((k) => S.teams[k].name).join(", ") || "—"}</td><td>${p.role}</td></tr>`)
        .join("");
      empty.hidden = rows.length > 0;
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest(".pill");
      if (!b) return;
      team = b.dataset.t;
      $$(".pill", filters).forEach((x) => x.setAttribute("aria-pressed", x === b));
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
        const body = [
          `Name: ${fd.get("name")}`, `Email: ${fd.get("email")}`, `Organization: ${fd.get("org") || "—"}`,
          `Needs: ${fd.getAll("type").join(", ") || "—"}`, `Timeline: ${fd.get("timeline") || "—"}`,
          `Budget: ${fd.get("budget") || "—"}`, "", fd.get("message"),
        ].join("\n");
        location.href = `mailto:${S.email}?subject=${encodeURIComponent("Project inquiry")}&body=${encodeURIComponent(body)}`;
      } else {
        status.textContent = "Our inbox isn't connected yet. Check back soon.";
      }
    });
  }
})();
