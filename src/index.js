require("dotenv").config();
const express = require("express");
const cors = require("cors");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const rateLimit = require("express-rate-limit");

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const ADMIN_EMAIL = (process.env.ADMIN_EMAIL || "").toLowerCase();
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;
const ADMIN_NAME = process.env.ADMIN_NAME || "Administrador";
const CLIENT_URL = process.env.CLIENT_URL || "http://localhost:5173";

if (!JWT_SECRET || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
  console.error("Faltan variables en .env (JWT_SECRET, ADMIN_EMAIL, ADMIN_PASSWORD). Copia .env.example a .env");
  process.exit(1);
}

// El hash se calcula al iniciar; la contraseña en texto plano nunca se compara directamente.
const adminHash = bcrypt.hashSync(ADMIN_PASSWORD, 12);

const app = express();
app.use(cors({ origin: CLIENT_URL }));
app.use(express.json());

// Máximo 10 intentos de login cada 15 minutos por IP (frena fuerza bruta)
const loginLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 10,
  standardHeaders: true,
  legacyHeaders: false,
  message: { message: "Demasiados intentos. Intenta de nuevo en 15 minutos." },
});

function requireAdmin(req, res, next) {
  const header = req.headers.authorization || "";
  const token = header.startsWith("Bearer ") ? header.slice(7) : null;
  if (!token) return res.status(401).json({ message: "No autenticado" });
  try {
    const payload = jwt.verify(token, JWT_SECRET);
    if (payload.role !== "admin") return res.status(403).json({ message: "Acceso denegado" });
    req.user = payload;
    next();
  } catch {
    return res.status(401).json({ message: "Sesión inválida o expirada" });
  }
}

app.post("/api/auth/login", loginLimiter, async (req, res) => {
  const { email, password } = req.body || {};
  if (typeof email !== "string" || typeof password !== "string") {
    return res.status(400).json({ message: "Email y password son requeridos" });
  }

  const emailOk = email.trim().toLowerCase() === ADMIN_EMAIL;
  const passOk = await bcrypt.compare(password, adminHash);

  if (!emailOk || !passOk) {
    return res.status(401).json({ message: "Credenciales incorrectas" });
  }

  const token = jwt.sign({ email: ADMIN_EMAIL, name: ADMIN_NAME, role: "admin" }, JWT_SECRET, {
    expiresIn: "2h",
  });
  res.json({ token, user: { email: ADMIN_EMAIL, name: ADMIN_NAME, role: "admin" } });
});

// Ruta protegida de ejemplo
app.get("/api/admin/me", requireAdmin, (req, res) => {
  res.json({ user: { email: req.user.email, name: req.user.name, role: req.user.role } });
});

app.listen(PORT, () => console.log(`API lista en http://localhost:${PORT}`));
