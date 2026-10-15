// Site settings — edit these, nothing else needs to change.
window.S49 = {
  // Where "Work with us" submissions go. Paste a Formspree (or any form-POST)
  // endpoint here, e.g. "https://formspree.io/f/abcdwxyz".
  formEndpoint: "",
  // Fallback when formEndpoint is empty: the form opens the visitor's mail app
  // addressed to this inbox. Also shown in the footer.
  email: "",
  instagram: "",
  linkedin: "",

  teams: {
    leadership: { name: "Leadership" },
    design: { name: "Design" },
    engineering: { name: "Engineering" },
    clients: { name: "Clients & Comms" },
    operations: { name: "Operations" },
  },

  // `tags` are the little keyword chips next to each name on the Team page —
  // swap in real specialties (UI/UX, Web, Branding, Illustration…) anytime.
  // `role` shows on the card / directory. `exec: true` puts someone in the
  // board grid at the top of the Team page.
  people: [
    { name: "Ali Chaaraoui", role: "Leadership", tags: ["Leadership", "Design", "Development", "Clients"], teams: ["leadership"], exec: true },
    { name: "Yasmine Chiboub", role: "Leadership", tags: ["Leadership", "Design", "Development", "Clients"], teams: ["leadership"], exec: true },
    { name: "Imani", role: "Product Manager", tags: ["Product"], teams: [], exec: true },
    { name: "Lea Ahmad", role: "Secretary", tags: ["Clients", "Comms"], teams: ["clients"], exec: true },
    { name: "Mallek Bara", role: "Head of Recruitment", tags: ["Recruiting"], teams: [], exec: true },
    { name: "Joseph Diku", role: "Operations", tags: ["Operations"], teams: ["operations"], exec: true },
    { name: "Tejuan Carter", role: "Designer", tags: ["Design"], teams: ["design"] },
    { name: "Amaya Clark", role: "Designer", tags: ["Design"], teams: ["design"] },
    { name: "Antoanelle Darko", role: "Designer", tags: ["Design"], teams: ["design"] },
    { name: "Mihir Joshi", role: "Engineer", tags: ["Development"], teams: ["engineering"] },
    { name: "Saanvi Kundu", role: "Engineer", tags: ["Development"], teams: ["engineering"] },
    { name: "Sindu Rachakonda", role: "Engineer", tags: ["Development"], teams: ["engineering"] },
    { name: "Bayan Ammar", role: "Clients & Comms", tags: ["Clients", "Comms"], teams: ["clients"] },
    { name: "Mohamad Amer", role: "Clients & Comms", tags: ["Clients", "Comms"], teams: ["clients"] },
    { name: "Maya Hanbali", role: "Operations", tags: ["Operations"], teams: ["operations"] },
    { name: "Shreya Dey", role: "Operations", tags: ["Operations"], teams: ["operations"] },
  ],
};
