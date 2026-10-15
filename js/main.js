(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const still = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const pad2 = (n) => String(n).padStart(2, "0");
  const LINKS = [["index.html", "Home", "home"], ["about.html", "About", "about"], ["projects.html", "Projects", "projects"], ["team.html", "Team", "team"], ["contact.html", "Contact", "contact"]];

  /* Commission-style pills: [logo] (live oval) [+] */
  const pills = document.createElement("header");
  pills.className = "pills";
  pills.innerHTML = `<a class="logo" href="index.html">STUDIO 49</a><span class="oval" aria-live="off"><span>--:--</span></span><button class="plus" aria-expanded="false" aria-controls="menu" aria-label="Menu"><span>+</span></button>`;
  document.body.prepend(pills);
  const ovalTxt = $(".oval span", pills);
  const clock = () => "CLT " + new Intl.DateTimeFormat("en-US", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "America/New_York" }).format(new Date());
  const facts = [clock, () => "Open for work", () => "No. 49"];
  let fi = 0;
  ovalTxt.textContent = clock();
  setInterval(() => {
    ovalTxt.classList.add("out");
    setTimeout(() => { fi = (fi + 1) % facts.length; ovalTxt.textContent = facts[fi](); ovalTxt.classList.remove("out"); }, 350);
  }, 3200);

  /* "+" opens the menu (Hex sidebar as an overlay) */
  const menu = document.createElement("div");
  menu.className = "menu";
  menu.id = "menu";
  menu.innerHTML = `
    <nav>${LINKS.map(([h, t, k], i) => `<a href="${h}"${k === page ? ' aria-current="page"' : ""}><small>${pad2(i + 1)}</small>${t}</a>`).join("")}</nav>
    <aside>
      <a class="touch" href="contact.html"><span class="mono">Get in touch</span><span class="serif">Start a project →</span></a>
      <p class="bio">Studio 49 is a student-run design and development studio. Websites, brands and products, from brief to launch.</p>
      ${S.email ? `<a class="go" href="mailto:${S.email}">${S.email}</a>` : ""}
    </aside>
    <div class="big">${[..."STUDIO 49"].map((c) => `<span>${c === " " ? "&nbsp;" : c}</span>`).join("")}</div>`;
  document.body.append(menu);
  /* menu open / close — Motion springs + staggers */
  const M = window.Motion;
  const plus = $(".plus", pills);
  const plusIcon = $("span", plus);
  let open = false;
  const EASE = [0.7, 0, 0.2, 1];
  const setMenu = async (want) => {
    if (want === open) return;
    open = want;
    document.body.classList.toggle("menu-open", open);
    plus.setAttribute("aria-expanded", open);
    const links = $$("nav a", menu), side = $$("aside > *", menu), letters = $$(".big span", menu);
    if (!M || still) {
      menu.style.visibility = open ? "visible" : "hidden";
      menu.style.clipPath = open ? "inset(0 0 0% 0 round 14px)" : "inset(0 0 100% 0 round 14px)";
      return;
    }
    M.animate(plusIcon, { rotate: open ? 135 : 0 }, { type: "spring", stiffness: 300, damping: 18 });
    if (open) {
      menu.style.visibility = "visible";
      M.animate(links, { y: 60, opacity: 0 }, { duration: 0 });
      M.animate(side, { y: 30, opacity: 0, scale: 0.96 }, { duration: 0 });
      M.animate(letters, { y: "110%", opacity: 1 }, { duration: 0 });
      M.animate(side, { opacity: 0 }, { duration: 0 });
      await Promise.all([
        M.animate(menu, { clipPath: "inset(0 0 0% 0 round 14px)" }, { duration: 0.75, ease: EASE }),
        M.animate(links, { y: 0, opacity: 1 }, { delay: M.stagger(0.06, { startDelay: 0.28 }), type: "spring", stiffness: 210, damping: 22 }),
        M.animate(side, { y: 0, opacity: 1, scale: 1 }, { delay: M.stagger(0.08, { startDelay: 0.45 }), type: "spring", stiffness: 200, damping: 24 }),
        M.animate(letters, { y: "0%" }, { delay: M.stagger(0.035, { startDelay: 0.4 }), type: "spring", stiffness: 260, damping: 24 }),
      ]);
    } else {
      M.animate(links, { y: -30, opacity: 0 }, { duration: 0.25, delay: M.stagger(0.03, { from: "last" }) });
      M.animate([...side, ...letters], { opacity: 0 }, { duration: 0.2 });
      await M.animate(menu, { clipPath: "inset(0 0 100% 0 round 14px)" }, { duration: 0.6, ease: EASE, delay: 0.12 });
      if (!open) { menu.style.visibility = "hidden"; M.animate(letters, { opacity: 1 }, { duration: 0 }); }
    }
  };
  plus.addEventListener("click", () => setMenu(!open));
  addEventListener("keydown", (e) => e.key === "Escape" && setMenu(false));
  // springy hover on the menu links
  if (M && !still)
    $$("nav a", menu).forEach((a) => {
      a.addEventListener("pointerenter", () => M.animate(a, { x: 14 }, { type: "spring", stiffness: 400, damping: 20 }));
      a.addEventListener("pointerleave", () => M.animate(a, { x: 0 }, { type: "spring", stiffness: 400, damping: 20 }));
    });

  /* footer: big dot-matrix sign-off */
  if (page !== "home") {
    const f = document.createElement("footer");
    f.className = "foot";
    f.innerHTML = `<div class="row mono"><span>© ${new Date().getFullYear()} Studio 49</span><span style="display:flex;gap:18px">${LINKS.slice(1).map(([h, t]) => `<a href="${h}">${t}</a>`).join("")}</span><a href="#">Back to top ↑</a></div><div class="big">STUDIO 49</div>`;
    document.body.append(f);
  }

  /* dot-matrix display: words drawn in lit dots, cursor lights the dots around it */
  const G = {
    B: "11110100011000111110100011000111110", D: "11110100011000110001100011000111110", E: "11111100001000011110100001000011111",
    G: "01110100011000010111100011000101111", H: "10001100011000111111100011000110001", I: "01110001000010000100001000010001110",
    L: "10000100001000010000100001000011111", N: "10001110011010110011100011000110001", O: "01110100011000110001100011000101110",
    P: "11110100011000111110100001000010000", R: "11110100011000111110101001001010001", S: "01111100001000001110000010000111110",
    T: "11111001000010000100001000010000100", U: "10001100011000110001100011000101110", Y: "10001100010101000100001000010000100",
    "?": "01110100010000100010001000000000100", 0: "01110100011001110101110011000101110", 1: "00100011000010000100001000010001110",
    2: "01110100010000100010001000100011111", 3: "11110000010000101110000010000111110", 4: "00010001100101010010111110001000010",
    9: "01110100011000101111000010001001100", " ": "00000000000000000000000000000000000",
  };
  $$("canvas[data-matrix]").forEach((cv) => {
    const ctx = cv.getContext("2d");
    const small = cv.hasAttribute("data-small");
    const words = cv.dataset.words.split("|");
    const label = $("[data-word]");
    let W, H, P, cols, rows, lvl, tgt, delay, wi = 0, t0 = 0, ptr = null, ripples = [], raf = 0, visible = true, dpr;

    const layout = () => {
      dpr = Math.min(devicePixelRatio || 1, 2);
      const b = cv.getBoundingClientRect();
      W = b.width; H = b.height;
      cv.width = W * dpr; cv.height = H * dpr;
      P = small ? Math.max(7, W / 64) : Math.max(9, Math.min(15, W / 92));
      cols = Math.floor(W / P); rows = Math.floor(H / P);
      lvl = new Float32Array(cols * rows); tgt = new Uint8Array(cols * rows); delay = new Float32Array(cols * rows);
      setWord(wi, true);
    };
    const setWord = (i, instant) => {
      wi = i;
      const w = words[i];
      const pw = w.length * 6 - 1;
      const s = Math.max(1, Math.min(small ? 3 : 4, Math.floor(Math.min((cols - 6) / pw, (rows - 6) / 7))));
      const c0 = Math.floor((cols - pw * s) / 2), r0 = Math.floor((rows - 7 * s) / 2);
      tgt.fill(0);
      [...w].forEach((ch, k) => {
        const g = G[ch] || G[" "];
        for (let y = 0; y < 7; y++) for (let x = 0; x < 5; x++) if (g[y * 5 + x] === "1")
          for (let a = 0; a < s; a++) for (let b = 0; b < s; b++) {
            const c = c0 + (k * 6 + x) * s + a, r = r0 + y * s + b;
            if (c >= 0 && c < cols && r >= 0 && r < rows) tgt[r * cols + c] = 1;
          }
      });
      t0 = performance.now();
      for (let j = 0; j < delay.length; j++) delay[j] = instant || still ? 0 : Math.random() * 700;
      if (instant) lvl.set(tgt);
      if (label && !small) label.textContent = `${pad2(i + 1)} / ${pad2(words.length)}`;
      kick();
    };
    const draw = (now) => {
      raf = 0;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, W, H);
      const el = now - t0, R = P * 7;
      let busy = false;
      ripples = ripples.filter((r) => (r.rad += P * 0.9) < Math.hypot(W, H));
      for (let r = 0; r < rows; r++) for (let c = 0; c < cols; c++) {
        const i = r * cols + c, x = c * P + P / 2, y = r * P + P / 2;
        if (el > delay[i]) {
          const d = tgt[i] - lvl[i];
          if (Math.abs(d) > 0.01) { lvl[i] += d * 0.18; busy = true; } else lvl[i] = tgt[i];
        } else busy = true;
        let g = 0;
        if (ptr) { const dd = Math.hypot(x - ptr.x, y - ptr.y); if (dd < R) g = (1 - dd / R) ** 2 * 0.9; }
        for (const rp of ripples) { const dd = Math.abs(Math.hypot(x - rp.x, y - rp.y) - rp.rad); if (dd < P * 1.5) g = Math.max(g, 0.7 * (1 - dd / (P * 1.5))); }
        const v = Math.min(1, lvl[i] + g);
        const rad = P * (0.11 + 0.3 * v);
        ctx.fillStyle = `rgba(242,242,240,${0.12 + 0.88 * v})`;
        ctx.beginPath(); ctx.arc(x, y, rad, 0, 6.2832); ctx.fill();
      }
      if (busy || ptr || ripples.length) kick();
    };
    const kick = () => { if (visible) raf ||= requestAnimationFrame(draw); };
    cv.addEventListener("pointermove", (e) => { const b = cv.getBoundingClientRect(); ptr = { x: e.clientX - b.left, y: e.clientY - b.top }; kick(); });
    cv.addEventListener("pointerleave", () => { ptr = null; kick(); });
    cv.addEventListener("pointerdown", (e) => { const b = cv.getBoundingClientRect(); ripples.push({ x: e.clientX - b.left, y: e.clientY - b.top, rad: 0 }); setWord((wi + 1) % words.length); });
    new IntersectionObserver(([en]) => { visible = en.isIntersecting; kick(); }).observe(cv);
    let rt;
    addEventListener("resize", () => { clearTimeout(rt); rt = setTimeout(layout, 150); });
    layout();
    if (!still) setInterval(() => { if (!ptr) setWord((wi + 1) % words.length); }, small ? 2600 : 3200);
  });

  /* team: a plain list with keyword chips */
  // each keyword: a color + a tiny 3×3 dot-matrix icon
  const TAG = {
    Leadership: ["#1f1f1f", "010111010"], Design: ["#e03131", "101010101"], Development: ["#3b5bdb", "110001110"],
    Clients: ["#d9480f", "111101111"], Comms: ["#2b8a3e", "100110111"], Product: ["#9c36b5", "111010010"],
    Recruiting: ["#e8590c", "010111101"], Operations: ["#0c8599", "101010111"],
  };
  const icon = (bits) => `<svg viewBox="0 0 11 11" aria-hidden="true">${[...bits].map((b, i) => (b === "1" ? `<circle cx="${1.5 + (i % 3) * 4}" cy="${1.5 + Math.floor(i / 3) * 4}" r="1.5"/>` : "")).join("")}</svg>`;
  const chip = (t) => { const [c, bits] = TAG[t] || ["#85857f", "000010000"]; return `<span class="tag" style="--c:${c}">${icon(bits)}${t}</span>`; };
  const people = $("[data-people]");
  if (people)
    people.innerHTML = S.people
      .map((p, i) => `<div><span class="n">${pad2(i + 1)}</span><span class="name">${p.name}</span><span class="tags">${(p.tags || []).map(chip).join("")}</span><span class="role mono grey">${p.role}</span></div>`)
      .join("");

  if (M && !still)
    $$(".tag").forEach((t) => {
      t.addEventListener("pointerenter", () => M.animate(t, { scale: 1.08 }, { type: "spring", stiffness: 500, damping: 15 }));
      t.addEventListener("pointerleave", () => M.animate(t, { scale: 1 }, { type: "spring", stiffness: 500, damping: 18 }));
    });

  /* entrances, scroll reveals and page transitions */
  if (M && !still) {
    const split = (el) => {
      el.innerHTML = el.textContent.trim().split(/\s+/).map((w) => `<span class="w"><span>${w}</span></span>`).join(" ");
      return $$(".w > span", el);
    };
    M.animate(".pills > *", { y: [-24, 0], opacity: [0, 1] }, { delay: M.stagger(0.07), type: "spring", stiffness: 260, damping: 20 });
    const h = $(".head h1, .under h1");
    if (h) M.animate(split(h), { y: ["105%", "0%"] }, { delay: M.stagger(0.05, { startDelay: page === "home" ? 0.35 : 0.1 }), type: "spring", stiffness: 160, damping: 22 });
    M.animate(".head p, .under .links", { y: [16, 0], opacity: [0, 1] }, { delay: 0.35, duration: 0.7, ease: [0.2, 0.7, 0.1, 1] });
    M.animate(".display", { scale: [0.96, 1], opacity: [0, 1] }, { type: "spring", stiffness: 120, damping: 20 });

    const groups = [".cards", ".laws", ".works", ".list", ".label", ".panel", ".foot"];
    groups.forEach((g) =>
      $$(g).forEach((box) => {
        const kids = [".label", ".panel", ".foot"].includes(g) ? [box] : [...box.children];
        M.animate(kids, { opacity: 0, y: 28 }, { duration: 0 });
        M.inView(box, () => { M.animate(kids, { opacity: 1, y: 0 }, { delay: M.stagger(0.05), type: "spring", stiffness: 170, damping: 24 }); }, { amount: 0.1 });
      })
    );

    // page transitions: fade the page out before following an internal link
    document.addEventListener("click", (e) => {
      const a = e.target.closest("a[href]");
      if (!a || a.target || e.metaKey || e.ctrlKey || e.shiftKey) return;
      const url = new URL(a.href, location.href);
      if (url.origin !== location.origin || url.pathname === location.pathname || a.getAttribute("href").startsWith("#")) return;
      e.preventDefault();
      M.animate("main, .foot", { opacity: 0, y: -12 }, { duration: 0.28, ease: [0.4, 0, 1, 1] }).then(() => (location.href = url.href));
    });
    addEventListener("pageshow", (e) => { if (e.persisted) M.animate("main, .foot", { opacity: 1, y: 0 }, { duration: 0 }); });
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
