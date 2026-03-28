const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const inner = document.getElementById("inner");

let rx = 0;
let ry = 0;

let tx = 0;
let ty = 0;

/* =========================
   MOVIMIENTO REAL 3D
========================= */
function animate() {
  rx += (tx - rx) * 0.08;
  ry += (ty - ry) * 0.08;

  inner.style.transform = `
    rotateX(${ry}deg)
    rotateY(${rx}deg)
  `;

  requestAnimationFrame(animate);
}
animate();

/* TOUCH + MOUSE */
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
   DATOS
========================= */
const formatted = userId.match(/.{1,4}/g).join(" ");
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = userId;

/* =========================
   QR
========================= */
function generarQR(id) {
  QRCode.toCanvas(document.getElementById("qr"),
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
