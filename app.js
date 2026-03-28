const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const card = document.getElementById("card");

/* =========================
   ROTACIÓN REAL 360° (NO FLIP)
========================= */

let rx = 0;
let ry = 0;
let tx = 0;
let ty = 0;

function animate() {
  rx += (tx - rx) * 0.1;
  ry += (ty - ry) * 0.1;

  card.style.transform = `
    perspective(1200px)
    rotateX(${ry}deg)
    rotateY(${rx}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* TOUCH / MOUSE */
function move(e) {
  let x = e.touches ? e.touches[0].clientX : e.clientX;
  let y = e.touches ? e.touches[0].clientY : e.clientY;

  const cx = window.innerWidth / 2;
  const cy = window.innerHeight / 2;

  tx = (x - cx) / 20;
  ty = -(y - cy) / 20;
}

document.addEventListener("mousemove", move);
document.addEventListener("touchmove", move, { passive: true });

/* =========================
   FORMATO
========================= */
const formatted = userId.match(/.{1,4}/g).join(" ");
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = userId;

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
   QR
========================= */
function generarQR(id) {
  const canvas = document.getElementById("qr");

  QRCode.toCanvas(canvas,
    `https://consultapromo.vercel.app/?id=${id}`,
    {
      width: 100,
      margin: 1,
      color: {
        dark: "#888",
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

  generarQR(userId);
})();;;
