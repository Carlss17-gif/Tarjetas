const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");

const cardType = document.getElementById("cardType");
const cardNumber = document.getElementById("cardNumber");
const promoText = document.getElementById("promoText");

let rx = 0, ry = 0;
let tx = 0, ty = 0;
let dragging = false;
let flipped = false;

/* ANIM */
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
function move(e) {
  const r = card.getBoundingClientRect();
  tx = ((e.clientX - r.left) / r.width - 0.5) * 40;
  ty = -((e.clientY - r.top) / r.height - 0.5) * 40;
}

/* DRAG */
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

  if (Math.abs(x - startX) > 5 || Math.abs(y - startY) > 5) moved = true;

  move(e);
});

card.addEventListener("pointerup", () => {
  dragging = false;
  if (!moved) flipped = !flipped;
});

/* QR */
function qr(id) {
  QRCode.toCanvas(document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 110,
      margin: 0,
      color: {
        dark: "#fff",
        light: "transparent"
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
    document.querySelector(".front").style.background = "linear-gradient(145deg,#3a2f00,#ffcc66)";
  }

  else if (promo.includes("gris")) {
    theme = "silver";
    label = "PLATINUM";
    document.querySelector(".front").style.background = "linear-gradient(145deg,#1a1a1a,#c0c0c0)";
  }

  else {
    document.querySelector(".front").style.background = "linear-gradient(145deg,#111,#222)";
  }

  cardType.innerText = label;

  const short = userId.slice(0, 4);
  cardNumber.innerText = `C4RI JR06 00AX ${short}`;

  qr(userId);
}

window.addEventListener("load", load);
