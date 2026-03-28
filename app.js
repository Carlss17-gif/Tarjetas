const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");
const front = document.querySelector(".front");

let flipped = false;

let rx = 0, ry = 0;
let tx = 0, ty = 0;

let dragging = false;

let lightX = 50;
let lightY = 50;

/* ANIMACIÓN PRINCIPAL */
function animate() {
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;

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

/* EFECTO DE LUZ */
function updateFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const nx = (x / rect.width) - 0.5;
  const ny = (y / rect.height) - 0.5;

  const sens = 42;

  tx = nx * sens;
  ty = -ny * sens;

  lightX = (x / rect.width) * 100;
  lightY = (y / rect.height) * 100;

  front.style.background = `
    radial-gradient(
      circle at ${lightX}% ${lightY}%,
      rgba(255,255,255,0.14),
      rgba(0,0,0,0.85) 55%,
      #000 100%
    ),
    linear-gradient(145deg, #0a0a0a, #1a1a1a)
  `;
}

/* INTERACCIÓN */
let startX = 0, startY = 0;
let moved = false;

card.addEventListener("pointerdown", (e) => {
  dragging = true;
  moved = false;

  card.setPointerCapture(e.pointerId);

  const rect = card.getBoundingClientRect();
  startX = e.clientX - rect.left;
  startY = e.clientY - rect.top;
});

card.addEventListener("pointermove", (e) => {
  if (!dragging) return;

  const rect = card.getBoundingClientRect();
  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  if (Math.abs(x - startX) > 6 || Math.abs(y - startY) > 6) {
    moved = true;
  }

  updateFromPointer(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;

  /* TAP = FLIP */
  if (!moved) {
    flipped = !flipped;
  }

  tx *= 0.3;
  ty *= 0.3;
});

/* FORMATEO */
const formatted = userId.match(/.{1,4}/g)?.join(" ") || userId;

/* FRONT */
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = userId;

/* QR */
function generarQR(id) {
  QRCode.toCanvas(
    document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 100,
      margin: 1,
      color: {
        dark: "#aaaaaa",
        light: "#0a0a0a"
      }
    }
  );
}

window.addEventListener("load",()=>{generarQR(userId);});
