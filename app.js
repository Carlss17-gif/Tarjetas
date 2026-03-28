const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

if (!userId) {
  alert("ID inválido");
  throw new Error("Sin ID");
}

// FORMATO TARJETA
const formatted = userId.match(/.{1,4}/g).join(" ");
document.getElementById("cardNumber").innerText = formatted;
document.getElementById("clienteId").innerText = "ID: " + userId;

// DETECTAR TIPO
function detectarTipoPromo(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase();

  if (t.includes("negro") || t.includes("black")) return "negro";
  if (t.includes("dorado") || t.includes("gold")) return "dorada";
  if (t.includes("gris") || t.includes("silver")) return "gris";

  return "negro";
}

// APLICAR TEMA
function aplicarTema(tipo) {
  const front = document.getElementById("cardFront");
  front.classList.remove("negro", "dorada", "gris");
  front.classList.add(tipo);
}

// SUPABASE
async function obtenerPromo(id) {
  const res = await fetch(
    `${SUPABASE_URL}/rest/v1/usuarios_promocion?id_invitado_promocion=eq.${id}`,
    {
      headers: {
        "apikey": SUPABASE_KEY,
        "Authorization": `Bearer ${SUPABASE_KEY}`
      }
    }
  );

  const data = await res.json();
  return data[0];
}

// QR
function generarQR(id) {
  const canvas = document.getElementById("qr");

  QRCode.toCanvas(canvas, `https://consultapromo.vercel.app/?id=${id}`, {
    width: 200,
    margin: 1,
    errorCorrectionLevel: "H"
  }, () => insertarLogo());
}

function insertarLogo() {
  const canvas = document.getElementById("qr");
  const ctx = canvas.getContext("2d");

  const size = canvas.width * 0.35;

  const x = canvas.width / 2 - size / 2;
  const y = canvas.height / 2 - size / 2;

  ctx.fillStyle = "#000";
  ctx.fillRect(x, y, size, size);

  const img = new Image();
  img.src = "logo.png";

  img.onload = () => {
    const logoSize = size * 0.8;

    ctx.drawImage(
      img,
      canvas.width / 2 - logoSize / 2,
      canvas.height / 2 - logoSize / 2,
      logoSize,
      logoSize
    );
  };
}

// MOVIMIENTO
const card = document.getElementById("card");

document.addEventListener("mousemove", (e) => {
  const x = (window.innerWidth / 2 - e.clientX) / 25;
  const y = (window.innerHeight / 2 - e.clientY) / 25;
  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

document.addEventListener("touchmove", (e) => {
  const t = e.touches[0];
  const x = (window.innerWidth / 2 - t.clientX) / 25;
  const y = (window.innerHeight / 2 - t.clientY) / 25;
  card.style.transform = `rotateY(${x}deg) rotateX(${y}deg)`;
});

// FLIP
card.addEventListener("click", () => {
  card.classList.toggle("flip");
});

// INIT
(async () => {
  const promo = await obtenerPromo(userId);

  if (!promo) {
    alert("No existe registro");
    return;
  }

  const tipo = detectarTipoPromo(promo.promocion);

  aplicarTema(tipo);
  generarQR(userId);
})();
