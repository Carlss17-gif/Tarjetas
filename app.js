const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

const card = document.getElementById("card");

let isFlipped = false;
let startX = 0;

// 👉 GESTO PARA VOLTEAR
card.addEventListener("touchstart", (e) => {
  startX = e.touches[0].clientX;
});

card.addEventListener("touchend", (e) => {
  const endX = e.changedTouches[0].clientX;

  if (endX - startX > 50) {
    isFlipped = true;
  } else if (startX - endX > 50) {
    isFlipped = false;
  }

  card.style.transform = isFlipped ? "rotateY(180deg)" : "rotateY(0deg)";
});

// FORMATO
const formatted = userId.match(/.{1,4}/g).join(" ");
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = "ID: " + userId;

// SUPABASE
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

// QR
function generarQR(id) {
  QRCode.toCanvas(document.getElementById("qr"),
    `https://consultapromo.vercel.app/?id=${id}`,
    { width: 150 }
  );
}

// INIT
(async () => {
  const promo = await obtenerPromo(userId);

  if (!promo) return;

  document.getElementById("promoText").innerText = promo.promocion;

  generarQR(userId);
})();;
