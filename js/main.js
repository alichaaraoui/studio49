(() => {
  const S = window.S49;
  const $ = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const page = document.body.dataset.page;

  /* bar on inner pages: links mirrored around a centered logo */
  if (page !== "home") {
    const a = (h, t, k) => `<a class="caps" href="${h}"${k === page ? ' aria-current="page"' : ""}>${t}</a>`;
    const bar = document.createElement("header");
    bar.className = "bar";
    bar.innerHTML = `
      <nav class="l">${a("about.html", "About", "about")}${a("projects.html", "Projects", "projects")}</nav>
      <a class="logo caps" href="index.html"><span class="ring" style="--s:22px"></span>Studio 49</a>
      <nav class="r">${a("team.html", "Team", "team")}${a("contact.html", "Contact", "contact")}</nav>`;
    document.body.prepend(bar);
  }

  /* team */
  const people = $("[data-people]");
  if (people) {
    const filters = $("[data-filters]");
    let team = "all";
    filters.innerHTML =
      `<button aria-pressed="true" data-t="all">All</button>` +
      Object.entries(S.teams).map(([k, t]) => `<button aria-pressed="false" data-t="${k}">${t.name}</button>`).join("");
    const render = () => {
      people.innerHTML = S.people
        .filter((p) => team === "all" || p.teams.includes(team))
        .map((p, i) => `<div><span class="caps dim">${String(i + 1).padStart(2, "0")}</span><h3>${p.name}</h3><p>${p.role}</p></div>`)
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
