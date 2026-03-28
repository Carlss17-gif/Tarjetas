const inner = document.getElementById("inner");
const card = document.getElementById("card");

/* =========================
   ESTADO 3D
========================= */
let rx = 0, ry = 0;        // actual
let tx = 0, ty = 0;        // target

/* =========================
   INERCIA (VELOCIDAD)
========================= */
let vx = 0, vy = 0;

let lastX = 0, lastY = 0;
let dragging = false;

/* =========================
   ANIMACIÓN PRINCIPAL
========================= */
function animate() {
  // INERCIA → movimiento con "peso"
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;

    // SNAP AL CENTRO (cuando casi se detiene)
    if (Math.abs(tx) < 0.01) tx = 0;
    if (Math.abs(ty) < 0.01) ty = 0;
  }

  // suavizado (spring)
  rx += (tx - rx) * 0.10;
  ry += (ty - ry) * 0.10;

  inner.style.transform = `
    rotateX(${ry}deg)
    rotateY(${rx}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* =========================
   INPUT (TOUCH + MOUSE)
========================= */
function setFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const nx = (x / rect.width) - 0.5;
  const ny = (y / rect.height) - 0.5;

  const sens = 40;

  tx = nx * sens;
  ty = -ny * sens;

  // velocidad para inercia
  vx = x - lastX;
  vy = y - lastY;

  lastX = x;
  lastY = y;
}

/* =========================
   EVENTOS
========================= */
card.addEventListener("pointerdown", (e) => {
  dragging = true;
  card.setPointerCapture(e.pointerId);

  const rect = card.getBoundingClientRect();
  lastX = e.clientX - rect.left;
  lastY = e.clientY - rect.top;
});

card.addEventListener("pointermove", (e) => {
  if (!dragging) return;
  setFromPointer(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;

  // 🔥 INERCIA REAL (impulso al soltar)
  tx += vx * 0.15;
  ty -= vy * 0.15;

  vx = 0;
  vy = 0;
});

card.addEventListener("pointercancel", () => {
  dragging = false;
});
