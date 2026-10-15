// Studio 49 seal — an engraved gold disc. seal({ sheen: true }) returns SVG markup.
// Every line is drawn three times (shadow, highlight, face) to read as engraved metal.
window.seal = (o = {}) => {
  const k = "s" + Math.random().toString(36).slice(2, 8);
  const C = 200;
  const pt = (r, deg) => {
    const a = (deg * Math.PI) / 180;
    return `${(C + r * Math.sin(a)).toFixed(2)} ${(C - r * Math.cos(a)).toFixed(2)}`;
  };
  const ticks = Array.from({ length: 72 }, (_, i) => `M${pt(i % 6 ? 175 : 168, i * 5)}L${pt(181, i * 5)}`).join("");
  const cross = [0, 90, 180, 270].map((d) => `M${pt(62, d)}L${pt(120, d)}`).join("");
  const diag = [45, 135, 225, 315].map((d) => `M${pt(70, d)}L${pt(90, d)}`).join("");
  const ring = "M200,50 a150,150 0 1,1 -0.01,0";
  const words = o.text || "STUDIO 49 · DESIGN AND DEVELOPMENT STUDIO · FORTY—NINE · ";

  const lines = `
    <circle cx="200" cy="200" r="186"/><circle cx="200" cy="200" r="181"/>
    <circle cx="200" cy="200" r="120"/><circle cx="200" cy="200" r="62"/>
    <circle cx="200" cy="200" r="96" stroke-dasharray="1 6"/>
    <path d="${ticks}${cross}${diag}"/>`;
  const type = `
    <text x="200" y="204" text-anchor="middle" dominant-baseline="central" font-size="70" font-weight="700" letter-spacing="-2" style="font-stretch:125%">49</text>
    <text font-size="11.5" font-weight="500" letter-spacing="0" style="font-stretch:125%"><textPath href="#${k}r" textLength="930" lengthAdjust="spacing">${words}</textPath></text>`;

  return `<svg class="seal" viewBox="0 0 400 400" role="img" aria-label="Studio 49 seal" font-family="Archivo, sans-serif">
  <defs>
    <linearGradient id="${k}g" data-sheen gradientUnits="userSpaceOnUse" x1="0" y1="0" x2="400" y2="400" gradientTransform="rotate(${o.angle ?? 0} 200 200)">
      <stop offset="0" stop-color="#6f5320"/><stop offset=".18" stop-color="#c9a24f"/>
      <stop offset=".33" stop-color="#f6e6b5"/><stop offset=".46" stop-color="#b8913f"/>
      <stop offset=".6" stop-color="#7a5c25"/><stop offset=".75" stop-color="#d9bb6c"/>
      <stop offset=".88" stop-color="#f2dfa2"/><stop offset="1" stop-color="#8b6a2c"/>
    </linearGradient>
    <radialGradient id="${k}v" cx="200" cy="200" r="196" gradientUnits="userSpaceOnUse">
      <stop offset=".72" stop-color="#2a1d06" stop-opacity="0"/><stop offset="1" stop-color="#2a1d06" stop-opacity=".45"/>
    </radialGradient>
    <filter id="${k}n" x="0" y="0" width="100%" height="100%">
      <feTurbulence type="fractalNoise" baseFrequency="0.6 0.012" numOctaves="2" seed="49"/>
      <feColorMatrix values="0 0 0 0 .2  0 0 0 0 .14  0 0 0 0 .04  0 0 0 .5 0"/>
    </filter>
    <clipPath id="${k}c"><circle cx="200" cy="200" r="196"/></clipPath>
    <path id="${k}r" d="${ring}"/>
    <g id="${k}l" fill="none">${lines}</g>
    <g id="${k}t">${type}</g>
  </defs>
  <circle cx="200" cy="200" r="196" fill="url(#${k}g)"/>
  <rect width="400" height="400" filter="url(#${k}n)" clip-path="url(#${k}c)" opacity=".55"/>
  <circle cx="200" cy="200" r="196" fill="url(#${k}v)"/>
  <use href="#${k}l" stroke="#fff3cf" stroke-opacity=".55" stroke-width="1.1" transform="translate(.7 .7)"/>
  <use href="#${k}l" stroke="#3d2c0e" stroke-opacity=".6" stroke-width="1"/>
  <use href="#${k}t" fill="#fff3cf" fill-opacity=".5" transform="translate(.8 .8)"/>
  <use href="#${k}t" fill="#4a3612" fill-opacity=".72"/>
</svg>`;
};

// Gold catches the light: rotate every live seal's gradient toward the pointer.
(() => {
  let raf = 0, ang = 0, target = 0;
  const step = () => {
    ang += (target - ang) * 0.08;
    document.querySelectorAll(".seal [data-sheen]").forEach((g) => g.setAttribute("gradientTransform", `rotate(${ang.toFixed(2)} 200 200)`));
    raf = Math.abs(target - ang) > 0.1 ? requestAnimationFrame(step) : 0;
  };
  addEventListener("pointermove", (e) => {
    target = ((e.clientX / innerWidth) - 0.5) * 70 + ((e.clientY / innerHeight) - 0.5) * 40;
    raf ||= requestAnimationFrame(step);
  }, { passive: true });
})();
