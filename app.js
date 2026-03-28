const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const card = document.getElementById("card");
const front = document.getElementById("cardFront");

let rotateX = 0;
let rotateY = 0;

let targetX = 0;
let targetY = 0;

let flipped = false;

/* =========================
   CONTROL REAL CON DEDO
========================= */
function setTarget(e) {
  let x = e.touches ? e.touches[0].clientX : e.clientX;
  let y = e.touches ? e.touches[0].clientY : e.clientY;

  const centerX = window.innerWidth / 2;
  const centerY = window.innerHeight / 2;

  targetY = (x - centerX) / 18;
  targetX = -(y - centerY) / 18;
}

/* movimiento continuo suave */
function animate() {
  rotateX += (targetX - rotateX) * 0.12;
  rotateY += (targetY - rotateY) * 0.12;

  card.style.transform = `
    perspective(1200px)
    rotateX(${rotateX}deg)
    rotateY(${rotateY + (flipped ? 180 : 0)}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* EVENTS */
document.addEventListener("mousemove", setTarget);
document.addEventListener("touchmove", setTarget, { passive: true });

/* FLIP REAL */
card.addEventListener("click", () => {
  flipped = !flipped;
});

/* =========================
   FORMATO
========================= */
const formatted = userId.match(/.{1,4}/g).join(" ");
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = "ID: " + userId;

/* =========================
   SUPABASE
========================= */
async function obtenerPromo(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuarios_promocion?id_invitado_promocion=eq.${id}`,
    {
      headers: {
        apikey: SUPABASE_KEY,
        Authorization: `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  return data[0];
}

/* =========================
   TEMA
========================= */
function aplicarTema(texto) {
  const t = texto?.toLowerCase() || "";
  front.classList.remove("negro","dorado","gris");

  if (t.includes("dorado")) front.classList.add("dorado");
  else if (t.includes("gris")) front.classList.add("gris");
  else front.classList.add("negro");
}

/* =========================
   QR PEQUEÑO Y LIMPIO
========================= */
function generarQR(id, tipo) {
  const canvas = document.getElementById("qr");

  const color =
    tipo === "dorado" ? "#2a2a2a" :
    tipo === "gris" ? "#444" :
    "#777";

  QRCode.toCanvas(canvas,
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 120,   // 👈 MÁS PEQUEÑO
      margin: 1,
      color: {
        dark: color,
        light: "#0a0a0a"
      }
    }
  );
}

/* =========================
   INIT
========================= */
(async () => {
  const promo = await obtenerPromo(userId);
  if (!promo) return;

  document.getElementById("promoText").innerText = promo.promocion;

  const tipo =
    promo.promocion?.toLowerCase().includes("dorado") ? "dorado" :
    promo.promocion?.toLowerCase().includes("gris") ? "gris" :
    "negro";

  aplicarTema(promo.promocion);
  generarQR(userId, tipo);
})();;
