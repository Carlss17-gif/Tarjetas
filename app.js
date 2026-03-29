const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");
const front = document.querySelector(".front");

const cardType = document.getElementById("cardType");
const cardNumber = document.getElementById("cardNumber");
const promoText = document.getElementById("promoText");

let rx = 0, ry = 0;
let tx = 0, ty = 0;
let dragging = false;
let flipped = false;

function animate() {
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;
  }

  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform =
    `rotateX(${ry}deg) rotateY(${rx + (flipped ? 180 : 0)}deg)`;

  requestAnimationFrame(animate);
}
animate();

function updateLight(e) {
  const r = card.getBoundingClientRect();

  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  const nx = x / r.width;
  const ny = y / r.height;

  tx = (nx - 0.5) * 40;
  ty = -(ny - 0.5) * 40;

  document.documentElement.style.setProperty("--lx", `${nx * 100}%`);
  document.documentElement.style.setProperty("--ly", `${ny * 100}%`);
}

let startX = 0, startY = 0, moved = false;

card.addEventListener("pointerdown", e => {
  dragging = true;
  moved = false;
  card.setPointerCapture(e.pointerId);

  const r = card.getBoundingClientRect();
  startX = e.clientX - r.left;
  startY = e.clientY - r.top;
});

card.addEventListener("pointermove", e => {
  if (!dragging) return;

  const r = card.getBoundingClientRect();
  const x = e.clientX - r.left;
  const y = e.clientY - r.top;

  if (Math.abs(x - startX) > 6 || Math.abs(y - startY) > 6) moved = true;

  updateLight(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;
  if (!moved) flipped = !flipped;
  tx *= 0.3;
  ty *= 0.3;
});

function qr(id) {
  QRCode.toCanvas(document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 100,
      margin: 1,
      color: {
        dark: "#fff",
        light: "transparent"
      }
    }
  );
}

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
  const promo = data?.[0]?.promocion?.toLowerCase() || "";

  let bg = "#000";
  let label = "PREMIUM";

  if (promo.includes("dorada")) {
    bg = "#3a2f00";
    label = "GOLD";
  } else if (promo.includes("gris")) {
    bg = "#1a1a1a";
    label = "PLATINUM";
  }

  document.documentElement.style.setProperty("--bg1", bg);

  cardType.innerText = label;

  const short = userId.slice(0, 4);
  cardNumber.innerText = `C4RI JR06 00AX ${short}`;

  qr(userId);
}

window.addEventListener("load", load);
