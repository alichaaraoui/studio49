(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const BG = "#f4f2ec", INK = "#111";

  /* rail */
  const links = [["index.html", "Home", "home"], ["about.html", "About", "about"], ["projects.html", "Projects", "projects"], ["team.html", "Team", "team"], ["contact.html", "Contact", "contact"]];
  const rail = document.createElement("aside");
  rail.className = "rail";
  rail.innerHTML = `
    <a class="brand" href="index.html">studio <br>49</a>
    <p class="brand-sub">A student-run design &amp; development studio.</p>
    <button class="burger" aria-expanded="false">Menu</button>
    <nav class="menu">${links.map(([h, t, k]) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`).join("")}</nav>
    <div class="rail-foot">
      ${S.email ? `<a href="mailto:${S.email}">${S.email}</a>` : ""}
      ${S.instagram ? `<a href="${S.instagram}" target="_blank" rel="noopener">Instagram</a>` : ""}
      <a href="contact.html">Start a project →</a>
      <span>© ${new Date().getFullYear()} Studio 49</span>
    </div>`;
  document.body.prepend(rail);
  $(".burger", rail).addEventListener("click", (e) => {
    const open = rail.classList.toggle("open");
    e.currentTarget.setAttribute("aria-expanded", open);
    e.currentTarget.textContent = open ? "Close" : "Menu";
  });

  /* moiré: concentric rings from each source; overlaps make the pattern */
  const rings = (ctx, w, h, sources, step) => {
    ctx.fillStyle = BG;
    ctx.fillRect(0, 0, w, h);
    ctx.strokeStyle = INK;
    ctx.lineWidth = 1;
    const max = Math.hypot(w, h);
    for (const s of sources) {
      ctx.beginPath();
      for (let r = step; r < max; r += step) {
        ctx.moveTo(s.x + r, s.y);
        ctx.arc(s.x, s.y, r, 0, Math.PI * 2);
      }
      ctx.stroke();
    }
  };
  const fit = (cv) => {
    const dpr = Math.min(devicePixelRatio || 1, 2);
    const { width, height } = cv.getBoundingClientRect();
    cv.width = width * dpr;
    cv.height = height * dpr;
    const ctx = cv.getContext("2d");
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    return { ctx, w: width, h: height };
  };

  const art = $(".art");
  if (art) {
    let g, sources = [], grabbed = null, raf = 0, t0 = performance.now();
    const STEP = 9;
    const seed = () => {
      sources = [
        { x: g.w * 0.38, y: g.h * 0.46, auto: true, p: 0 },
        { x: g.w * 0.62, y: g.h * 0.54, auto: true, p: 2.1 },
      ];
      sources.forEach((s) => ((s.ox = s.x), (s.oy = s.y)));
    };
    const frame = (now) => {
      raf = 0;
      const t = (now - t0) / 1000;
      let moving = false;
      for (const s of sources)
        if (s.auto && !reduce) {
          s.x = s.ox + Math.cos(t * 0.25 + s.p) * 40;
          s.y = s.oy + Math.sin(t * 0.18 + s.p) * 28;
          moving = true;
        }
      rings(g.ctx, g.w, g.h, sources, STEP);
      if (moving) kick();
    };
    const kick = () => (raf ||= requestAnimationFrame(frame));
    const setup = () => { g = fit(art); if (!sources.length) seed(); kick(); };

    const at = (e) => { const b = art.getBoundingClientRect(); return { x: e.clientX - b.left, y: e.clientY - b.top }; };
    art.addEventListener("pointerdown", (e) => {
      const p = at(e);
      grabbed = sources.find((s) => Math.hypot(s.x - p.x, s.y - p.y) < 40);
      if (!grabbed) {
        grabbed = { x: p.x, y: p.y };
        sources.push(grabbed);
        if (sources.length > 6) sources.shift();
      }
      grabbed.auto = false;
      art.setPointerCapture(e.pointerId);
      art.classList.add("grab");
      kick();
    });
    art.addEventListener("pointermove", (e) => {
      if (!grabbed) return;
      Object.assign(grabbed, at(e));
      kick();
    });
    addEventListener("pointerup", () => { grabbed = null; art.classList.remove("grab"); });
    $("[data-clear]").addEventListener("click", () => { sources = []; kick(); });
    $("[data-save]").addEventListener("click", () => {
      art.toBlob((b) => {
        const a = document.createElement("a");
        a.href = URL.createObjectURL(b);
        a.download = "studio49-moire.png";
        a.click();
        setTimeout(() => URL.revokeObjectURL(a.href), 1000);
      });
    });
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(setup, 150); });
    setup();
  }

  /* project thumbnails: a fixed moiré per project */
  $$("canvas[data-seed]").forEach((cv) => {
    const draw = () => {
      const { ctx, w, h } = fit(cv);
      let n = +cv.dataset.seed;
      const rnd = () => ((n = (n * 9301 + 49297) % 233280) / 233280);
      const src = Array.from({ length: 2 }, () => ({ x: w * (0.2 + rnd() * 0.6), y: h * (0.2 + rnd() * 0.6) }));
      rings(ctx, w, h, src, 11);
    };
    draw();
    addEventListener("resize", draw);
  });

  /* team */
  const people = $("[data-people]");
  if (people) {
    const filters = $("[data-filters]");
    const ini = (n) => n.split(/\s+/).map((w) => w[0]).slice(0, 2).join("");
    let team = "all";
    filters.innerHTML =
      `<button aria-pressed="true" data-t="all">Everyone (${S.people.length})</button>` +
      Object.entries(S.teams).map(([k, t]) => `<button aria-pressed="false" data-t="${k}">${t.name}</button>`).join("");
    const render = () => {
      people.innerHTML = S.people
        .filter((p) => team === "all" || p.teams.includes(team))
        .map((p) => `<div class="person"><p class="cell-k"><span>${p.teams.map((k) => S.teams[k].name)[0] || "Studio"}</span></p><span class="ini">${ini(p.name)}</span><p>${p.name}</p><p class="grey">${p.role}</p></div>`)
        .join("");
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button");
      if (!b) return;
      team = b.dataset.t;
      $$("button", filters).forEach((x) => x.setAttribute("aria-pressed", x === b));
      render();
    });
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
          btn.textContent = "Send →";
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
