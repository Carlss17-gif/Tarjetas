const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const card = document.getElementById("card");
const front = document.getElementById("cardFront");

let rx = 0, ry = 0;
let tx = 0, ty = 0;
let flipped = false;

/* =========================
   MOVIMIENTO FÍSICO SUAVE
========================= */
function animate() {
  rx += (tx - rx) * 0.08;
  ry += (ty - ry) * 0.08;

  card.style.transform = `
    rotateX(${ry}deg)
    rotateY(${rx + (flipped ? 180 : 0)}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* =========================
   CONTROL TOUCH / MOUSE
========================= */
function move(e) {
  let x = e.touches ? e.touches[0].clientX : e.clientX;
  let y = e.touches ? e.touches[0].clientY : e.clientY;

  tx = (x - window.innerWidth / 2) / 22;
  ty = -(y - window.innerHeight / 2) / 22;
}

document.addEventListener("mousemove", move);
document.addEventListener("touchmove", move);

/* FLIP */
card.addEventListener("click", () => {
  flipped = !flipped;
});

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
   TEMA DINÁMICO
========================= */
function aplicarTema(texto) {
  const t = texto?.toLowerCase() || "";

  front.classList.remove("negro","dorado","gris");

  if (t.includes("dorado")) front.classList.add("dorado");
  else if (t.includes("gris")) front.classList.add("gris");
  else front.classList.add("negro");
}

/* =========================
   QR DINÁMICO
========================= */
function generarQR(id, tipo) {
  const canvas = document.getElementById("qr");

  const color =
    tipo === "dorado" ? "#1a1a1a" :
    tipo === "gris" ? "#333" :
    "#888";

  QRCode.toCanvas(canvas,
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 160,
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
})();
