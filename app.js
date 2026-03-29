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

/* ANIMACIÓN */
function animate() {
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;
  }

  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform =
    `rotateX(${ry}deg)
     rotateY(${rx + (flipped ? 180 : 0)}deg)`;

  requestAnimationFrame(animate);
}
animate();

/* LUZ */
function updateFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const nx = (x / rect.width) - 0.5;
  const ny = (y / rect.height) - 0.5;

  tx = nx * 42;
  ty = -ny * 42;

  const lightX = (x / rect.width) * 100;
  const lightY = (y / rect.height) * 100;

  document.documentElement.style.setProperty("--lx", `${lightX}%`);
  document.documentElement.style.setProperty("--ly", `${lightY}%`);
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

  if (Math.abs(x - startX) > 6 || Math.abs(y - startY) > 6) moved = true;

  updateFromPointer(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;
  if (!moved) flipped = !flipped;
  tx *= 0.3;
  ty *= 0.3;
});

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
        light: "#00000000"
      }
    }
  );
}

/* SUPABASE */
async function cargarPromocion() {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuarios_promocion?id_invitado_promocion=eq.${userId}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();

  const promo = data?.[0]?.promocion || "Sin promoción";
  document.getElementById("promoText").innerText = promo;

  const short = userId.slice(0, 4);
  document.getElementById("cardNumber").innerText =
    `C4RI JR06 00AX ${short}`;

  generarQR(userId);
}

/* INIT */
window.addEventListener("load", cargarPromocion);;
