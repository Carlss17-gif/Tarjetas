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

function animate() {
  if (!dragging) {
    tx *= 0.92;
    ty *= 0.92;
  }

  rx += (tx - rx) * 0.12;
  ry += (ty - ry) * 0.12;

  inner.style.transform = `
    translate3d(0,0,0)
    rotateX(${ry}deg)
    rotateY(${rx + (flipped ? 180 : 0)}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* 🔥 LUZ RESTAURADA */
function updateFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const nx = x / rect.width;
  const ny = y / rect.height;

  const sens = 42;

  tx = (nx - 0.5) * sens;
  ty = -(ny - 0.5) * sens;

  document.documentElement.style.setProperty("--lx", `${nx * 100}%`);
  document.documentElement.style.setProperty("--ly", `${ny * 100}%`);
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
        light: "#0a0a0a"
      }
    }
  );
}

/* SUPABASE + TEMA */
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
  if (!data.length) return;

  const promo = data[0].promocion;
  document.getElementById("promoText").innerText = promo;

  const p = promo.toLowerCase();

  if (p.includes("dorada")) {
    document.documentElement.style.setProperty("--card-1", "#3a2f00");
    document.documentElement.style.setProperty("--card-2", "#f5d76e");
    document.documentElement.style.setProperty("--line", "rgba(245,215,110,0.35)");
  }
  else if (p.includes("gris") || p.includes("plata")) {
    document.documentElement.style.setProperty("--card-1", "#1a1a1a");
    document.documentElement.style.setProperty("--card-2", "#c0c0c0");
    document.documentElement.style.setProperty("--line", "rgba(192,192,192,0.35)");
  }
  else {
    document.documentElement.style.setProperty("--card-1", "#0a0a0a");
    document.documentElement.style.setProperty("--card-2", "#1a1a1a");
    document.documentElement.style.setProperty("--line", "rgba(255,255,255,0.15)");
  }
}

window.addEventListener("load", () => {
  generarQR(userId);
  cargarPromocion();
});
