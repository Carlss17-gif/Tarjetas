const inner = document.getElementById("inner");
const card = document.getElementById("card");

let rx = 0, ry = 0;
let tx = 0, ty = 0;

let active = false;

/* =========================
   ANIMACIÓN SUAVE
========================= */
function animate() {
  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform = `
    rotateX(${ry}deg)
    rotateY(${rx}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* =========================
   INPUT (MOUSE + TOUCH + PEN)
========================= */
function updateFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  // normalizamos dentro de la tarjeta (-0.5 a 0.5)
  const nx = (x / rect.width) - 0.5;
  const ny = (y / rect.height) - 0.5;

  // 🔥 sensibilidad (subida para móvil)
  const sens = 35;

  tx = nx * sens;
  ty = -ny * sens;
}

card.addEventListener("pointerdown", (e) => {
  active = true;
  card.setPointerCapture(e.pointerId);
});

card.addEventListener("pointermove", (e) => {
  if (!active) return;
  updateFromPointer(e);
});

card.addEventListener("pointerup", () => {
  active = false;
});

card.addEventListener("pointercancel", () => {
  active = false;
});

/* =========================
   DATOS
========================= */
const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

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
