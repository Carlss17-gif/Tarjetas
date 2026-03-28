const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");

/* =========================
   FLIP STATE
========================= */
let flipped = false;

/* =========================
   ROTACIÓN (3D)
========================= */
let rx = 0, ry = 0;
let tx = 0, ty = 0;

/* =========================
   INERCIA
========================= */
let dragging = false;
let lastX = 0, lastY = 0;

/* =========================
   ANIMACIÓN
========================= */
function animate() {
  if (!dragging) {
    tx *= 0.9;
    ty *= 0.9;

    if (Math.abs(tx) < 0.01) tx = 0;
    if (Math.abs(ty) < 0.01) ty = 0;
  }

  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform = `
    rotateX(${ry}deg)
    rotateY(${rx + (flipped ? 180 : 0)}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* =========================
   INPUT (DRAG)
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

  lastX = x;
  lastY = y;
}

/* =========================
   TAP vs DRAG DETECTOR
========================= */
let startX = 0, startY = 0;
let moved = false;

card.addEventListener("pointerdown", (e) => {
  dragging = true;
  moved = false;

  card.setPointerCapture(e.pointerId);

  const rect = card.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;

  lastX = startX;
  lastY = startY;
});

card.addEventListener("pointermove", (e) => {
  if (!dragging) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5) {
    moved = true;
  }

  setFromPointer(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;

  // 👉 SI NO SE MOVIÓ = TAP → FLIP
  if (!moved) {
    flipped = !flipped;
  }

  tx *= 0.3;
  ty *= 0.3;
});

/* =========================
   DATOS
========================= */
const formatted = userId.match(/.{1,4}/g)?.join(" ") || userId;

document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = userId;

/* =========================
   QR
========================= */
function generarQR(id) {
  QRCode.toCanvas(
    document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 100,
      color: {
        dark: "#888",
        light: "#0a0a0a"
      }
    }
  );
}

generarQR(userId);
