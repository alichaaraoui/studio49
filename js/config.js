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

  // `role` shows on the card / directory. `exec: true` puts someone in the
  // board grid at the top of the Team page.
  people: [
    { name: "Ali Chaaraoui", role: "Leadership", teams: ["leadership"], exec: true },
    { name: "Yasmine Chiboub", role: "Leadership", teams: ["leadership"], exec: true },
    { name: "Imani", role: "Product Manager", teams: [], exec: true },
    { name: "Lea Ahmad", role: "Secretary", teams: ["clients"], exec: true },
    { name: "Mallek Bara", role: "Head of Recruitment", teams: [], exec: true },
    { name: "Joseph Diku", role: "Operations", teams: ["operations"], exec: true },
    { name: "Tejuan Carter", role: "Designer", teams: ["design"] },
    { name: "Amaya Clark", role: "Designer", teams: ["design"] },
    { name: "Antoanelle Darko", role: "Designer", teams: ["design"] },
    { name: "Mihir Joshi", role: "Engineer", teams: ["engineering"] },
    { name: "Saanvi Kundu", role: "Engineer", teams: ["engineering"] },
    { name: "Sindu Rachakonda", role: "Engineer", teams: ["engineering"] },
    { name: "Bayan Ammar", role: "Clients & Comms", teams: ["clients"] },
    { name: "Mohamad Amer", role: "Clients & Comms", teams: ["clients"] },
    { name: "Maya Hanbali", role: "Operations", teams: ["operations"] },
    { name: "Shreya Dey", role: "Operations", teams: ["operations"] },
  ],
};
