(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;
  const reduce = matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* rail */
  const links = [["index.html", "Home", "home"], ["about.html", "About", "about"], ["projects.html", "Projects", "projects"], ["team.html", "Team", "team"], ["contact.html", "Contact", "contact"], ["identity.html", "Identity", "identity"]];
  const rail = document.createElement("aside");
  rail.className = "rail";
  rail.innerHTML = `
    <a class="brand" href="index.html"><span data-seal></span><span class="wordmark">Studio 49</span></a>
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

  /* seals */
  $$("[data-seal]").forEach((el) => (el.innerHTML = window.seal()));

  /* home: the seal tilts toward the pointer like a plate under light */
  const live = $("[data-seal-live]");
  if (live) {
    live.innerHTML = window.seal();
    const svg = $("svg", live);
    if (!reduce)
      addEventListener("pointermove", (e) => {
        const x = e.clientX / innerWidth - 0.5, y = e.clientY / innerHeight - 0.5;
        svg.style.transform = `rotateY(${x * 18}deg) rotateX(${-y * 14}deg)`;
      }, { passive: true });
  }

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
