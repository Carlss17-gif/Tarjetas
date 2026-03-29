const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");

const cardType = document.getElementById("cardType");
const cardNumber = document.getElementById("cardNumber");
const promoText = document.getElementById("promoText");
const qrWrapper = document.getElementById("qrWrapper");

let rx = 0, ry = 0;
let tx = 0, ty = 0;
let dragging = false;
let flipped = false;

/* ANIMACIÓN */
function animate() {
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;
  }

  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform =
    `translate3d(0,0,0)
     rotateX(${ry}deg)
     rotateY(${rx + (flipped ? 180 : 0)}deg)`;

  requestAnimationFrame(animate);
}
animate();

/* LUZ */
function updateFromPointer(e) {
  const r = card.getBoundingClientRect();

  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  tx = (x / r.width - 0.5) * 42;
  ty = -(y / r.height - 0.5) * 42;
}

/* DRAG */
let startX = 0, startY = 0;
let moved = false;

card.addEventListener("pointerdown", (e) => {
  dragging = true;
  moved = false;
  card.setPointerCapture(e.pointerId);

  const r = card.getBoundingClientRect();
  startX = e.clientX - r.left;
  startY = e.clientY - r.top;
});

card.addEventListener("pointermove", (e) => {
  if (!dragging) return;

  const r = card.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

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
        dark: "#111",
        light: "#0a0a0a"
      }
    }
  );
}

/* SUPABASE */
async function load() {
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
  if (!data.length) return;

  const promo = data[0].promocion.toLowerCase();

  let theme = "black";
  let label = "BLACK";

  if (promo.includes("dorada")) {
    theme = "gold";
    label = "GOLD";
    document.documentElement.style.setProperty("--card-1", "#3a2f00");
    document.documentElement.style.setProperty("--card-2", "#ffcc66");
  }

  else if (promo.includes("gris") || promo.includes("plata")) {
    theme = "silver";
    label = "PLATINUM";
    document.documentElement.style.setProperty("--card-1", "#1a1a1a");
    document.documentElement.style.setProperty("--card-2", "#c0c0c0");
  }

  cardType.innerText = label;

  /* 🔥 FIX ID */
  const short = userId.slice(0, 4);
  cardNumber.innerText = `C4RI JR06 00AX ${short}`;

  /* 🔥 GOLD TEXT FIX */
  if (theme === "gold") {
    cardNumber.classList.add("gold-text");
    cardType.classList.add("gold-text");
  }

  generarQR(userId);
}

window.addEventListener("load", load);
