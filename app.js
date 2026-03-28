// ==========================
// 🔑 CONFIG SUPABASE
// ==========================
const SUPABASE_URL = "https://aonrjcohmvxaleziockz.supabase.co";
const SUPABASE_KEY = "sb_publishable_gNWkwWCmotp1zRvXZtY6lg_XW3NzPVx";

// ==========================
// 📥 ID DESDE URL
// ==========================
const params = new URLSearchParams(window.location.search);
const userId = params.get("id");

if (!userId) {
  alert("ID inválido");
  throw new Error("Sin ID");
}

// ==========================
// 🎨 TEMAS
// ==========================
const temas = {
  negro: {
    front: "front-black.png",
    back: "back-black.png",
    color: "#D4AF37"
  },
  dorada: {
    front: "front-gold.png",
    back: "back-gold.png",
    color: "#1a1a1a"
  },
  gris: {
    front: "front-silver.png",
    back: "back-silver.png",
    color: "#111"
  }
};

// ==========================
// 🔎 CONSULTAR SUPABASE
// ==========================
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

// ==========================
// 🧠 DETECTAR TIPO
// ==========================
function detectarTipoPromo(texto) {
  if (!texto) return null;

  const t = texto.toLowerCase();

  if (t.includes("negra") || t.includes("negro")) return "negro";
  if (t.includes("dorada") || t.includes("dorado")) return "dorada";
  if (t.includes("gris")) return "gris";

  return null;
}

// ==========================
// 🎯 APLICAR TEMA
// ==========================
function aplicarTema(tipo) {
  const t = temas[tipo];

  if (!t) {
    console.error("Tema no encontrado:", tipo);
    return;
  }

  document.getElementById("frontImg").src = t.front;
  document.getElementById("backImg").src = t.back;
  document.getElementById("cardNumber").style.color = t.color;
}


// ==========================
// 📱 QR CON ESPACIO CENTRAL
// ==========================
function generarQR(id, tipo) {

  const url = `https://consultapromo.vercel.app/?id=${id}`;

  let colorQR = "#1a1a1a";

  if (tipo === "negro") colorQR = "#888888";
  if (tipo === "dorada") colorQR = "#1a1a1a";
  if (tipo === "gris") colorQR = "#000000";

  const canvas = document.getElementById("qr");

  // 🔥 tamaño dinámico según contenedor
  const size = canvas.parentElement.offsetWidth;

  QRCode.toCanvas(canvas, url, {
    width: size,
    margin: 0,
    errorCorrectionLevel: "H",
    color: {
      dark: colorQR,
      light: "#0000"
    }
  }, () => crearEspacioLogo());
}

// ==========================
// 🧱 ESPACIO NEGRO CENTRAL
// ==========================
function crearEspacioLogo() {

  const canvas = document.getElementById("qr");
  const ctx = canvas.getContext("2d");

  const size = canvas.width * 0.38;

  const x = canvas.width / 2 - size / 2;
  const y = canvas.height / 2 - size / 2;

  ctx.fillStyle = "#000000";
  ctx.fillRect(x, y, size, size);

  dibujarLogo(size);
}

// ==========================
// ⭐ LOGO LIMPIO
// ==========================
function dibujarLogo(size) {

  const canvas = document.getElementById("qr");
  const ctx = canvas.getContext("2d");

  const logo = new Image();
  logo.src = "logo.png"; // PNG transparente

  logo.onload = () => {

    const logoSize = size * 0.75;

    ctx.drawImage(
      logo,
      canvas.width / 2 - logoSize / 2,
      canvas.height / 2 - logoSize / 2,
      logoSize,
      logoSize
    );
  };
}

// ==========================
// 🔁 FLIP
// ==========================
const card = document.getElementById("card");

card.addEventListener("click", () => {
  card.classList.toggle("flip");
});

// ==========================
// 🚀 INIT
// ==========================
(async () => {

  const promo = await obtenerPromo(userId);

  if (!promo) {
    alert("No existe registro");
    return;
  }

  const tipo = detectarTipoPromo(promo.promocion);

  if (!tipo) {
    alert("Tipo no reconocido");
    return;
  }

  aplicarTema(tipo);
  generarQR(userId, tipo);


})();