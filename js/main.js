(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  const MARK = `<span class="br">&lt;/</span>STUDIO&nbsp;49<span class="br">&gt;</span>`;
  const LINKS = [
    ["index.html", "Studio", "home"],
    ["projects.html", "Projects", "projects"],
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

  /* ---------- corner ticks */
  const ticks = document.createElement("div");
  ticks.className = "ticks";
  ticks.innerHTML = "<i></i><i></i><i></i><i></i>";
  document.body.append(ticks);

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
    <div class="foot__base label"><span>© ${new Date().getFullYear()} Studio 49</span><span>Built in-house<span class="cursor" style="height:9px;width:5px"></span></span><a href="#top">Back to top ↑</a></div>`;
  frame.append(foot);

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

  /* ---------- hero cells */
  const cells = $(".cells");
  if (cells) {
    // [col, row, text, vertical, horizontal]; cursor blocks: "■" ink, "▪" pop
    const desk = {
      cols: 8, rows: 3,
      words: [
        [1, 1, "Designers<br>and"], [3, 1, "developers"], [6, 1, "who", "b", "r"], [8, 1, "▪", "t", "r"],
        [2, 1, "■", "b"], [2, 2, "build", "t", "r"],
        [7, 2, "things<br>people", "b"], [8, 2, "remember.", "b"],
        [1, 3, "Good is not<br>where we stop."], [3, 3, "▪", "b"],
        [5, 3, "It's where<br>we begin.", "b"], [7, 3, "■", "b", "r"], [8, 3, "S49 — '26", "b", "r"],
      ],
    };
    const mob = {
      cols: 4, rows: 5,
      words: [
        [1, 1, "Designers<br>and"], [3, 1, "developers"], [4, 2, "▪", "t", "r"],
        [1, 2, "who build", "b"], [3, 4, "things people<br>remember.", "b"],
        [1, 5, "Good is where<br>we begin.", "b"], [4, 5, "S49", "b", "r"], [2, 4, "■", "b"],
      ],
    };
    const build = () => {
      const L = innerWidth < 720 ? mob : desk;
      cells.style.setProperty("--cols", L.cols);
      cells.style.setProperty("--rows", L.rows);
      const map = {};
      L.words.forEach(([c, r, t, v, h]) => (map[`${c},${r}`] = { t, v, h }));
      let html = "";
      for (let r = 1; r <= L.rows; r++)
        for (let c = 1; c <= L.cols; c++) {
          const w = map[`${c},${r}`];
          let inner = w ? w.t : "";
          if (inner === "■") inner = '<span class="blk"></span>';
          if (inner === "▪") inner = '<span class="blk p"></span>';
          const delay = reduce ? 0 : ((r - 1) * L.cols + c) * 28;
          html += `<div class="cell"${w?.v ? ` data-v="${w.v}"` : ""}${w?.h ? ` data-h="${w.h}"` : ""} style="animation-delay:${delay}ms">${inner}</div>`;
        }
      cells.innerHTML = html;
    };
    build();
    let lastW = innerWidth;
    addEventListener("resize", () => {
      if ((innerWidth < 720) !== (lastW < 720)) build();
      lastW = innerWidth;
    });
    if (!reduce) {
      setInterval(() => {
        const all = $$(".cell", cells).filter((c) => !c.textContent.trim() && !c.children.length);
        const el = all[Math.floor(Math.random() * all.length)];
        if (!el) return;
        el.classList.add("flash");
        setTimeout(() => el.classList.remove("flash"), 140);
      }, 1900);
    }
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
