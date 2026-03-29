const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id") || "00000000";

const inner = document.getElementById("inner");
const card = document.getElementById("card");
const front = document.querySelector(".front");
const premium = document.querySelector(".emboss");

let flipped = false;
let rx = 0, ry = 0;
let tx = 0, ty = 0;
let dragging = false;

let lightX = 50;
let lightY = 50;

let themeGlow = "default";

/* ANIMACIÓN */
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

/* BRILLO TOUCH */
function updateFromPointer(e) {
  const rect = card.getBoundingClientRect();

  const x = e.clientX - rect.left;
  const y = e.clientY - rect.top;

  const nx = (x / rect.width) - 0.5;
  const ny = (y / rect.height) - 0.5;

  tx = nx * 42;
  ty = -ny * 42;

  lightX = (x / rect.width) * 100;
  lightY = (y / rect.height) * 100;

  let glowColor = "rgba(255,255,255,0.12)";

  if (themeGlow === "gold") glowColor = "rgba(255, 215, 80, 0.25)";
  if (themeGlow === "platinum") glowColor = "rgba(200,200,220,0.22)";
  if (themeGlow === "black") glowColor = "rgba(255,255,255,0.10)";

  front.style.background = `
    radial-gradient(circle at ${lightX}% ${lightY}%,
    ${glowColor}, rgba(0,0,0,0.85) 55%, #000 100%),
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
  if (!moved) flipped = !flipped;
  tx *= 0.3;
  ty *= 0.3;
});

/* TEMA */
function aplicarTema(tipo) {
  const t = tipo.toLowerCase();

  if (t.includes("negra") || t.includes("black")) {
    themeGlow = "black";
    premium.innerText = "BLACK";
  }
  else if (t.includes("dorada") || t.includes("gold") || t.includes("oro")) {
    themeGlow = "gold";
    premium.innerText = "GOLD";
  }
  else if (t.includes("gris") || t.includes("platinum") || t.includes("plata")) {
    themeGlow = "platinum";
    premium.innerText = "PLATINUM";
  }
  else {
    themeGlow = "default";
    premium.innerText = "PREMIUM";
  }
}

/* QR */
function generarQR(id) {
  QRCode.toCanvas(
    document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 110,
      margin: 1,
      color: {
        dark: "#ffffff",
        light: "transparent"
      }
    }
  );
}

/* SUPABASE */
async function cargarPromocion() {
  try {
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

    if (data && data.length > 0) {
      const promo = data[0].promocion;
      document.getElementById("promoText").innerText = promo;

      aplicarTema(promo);
    }
  } catch (e) {
    console.error(e);
  }
}

/* INIT */
window.addEventListener("load", () => {
  generarQR(userId);
  cargarPromocion();
});
