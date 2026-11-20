
import os

from flask import Flask, jsonify
from flask_cors import CORS
from flask_session import Session
from dotenv import load_dotenv

from routes.auth import auth_bp
from routes.formacion import formacion_bp
from routes.contacto import contacto_bp


# Cargar las variables del archivo .env
load_dotenv()

app = Flask(__name__)


# --------------------------------------------------
# CONFIGURACIÓN DE SEGURIDAD
# --------------------------------------------------

app.config["SECRET_KEY"] = os.getenv("STACKFOLIO_SECRET_KEY")

if not app.config["SECRET_KEY"]:
    raise RuntimeError(
        "No se encontró STACKFOLIO_SECRET_KEY en el archivo .env"
    )


# --------------------------------------------------
# CONFIGURACIÓN DE SESIONES
# --------------------------------------------------

app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_PERMANENT"] = True
app.config["SESSION_USE_SIGNER"] = True
app.config["SESSION_KEY_PREFIX"] = "stackfolio:"
app.config["SESSION_FILE_DIR"] = os.path.join(
    os.path.dirname(os.path.abspath(__file__)),
    "flask_session"
)
app.config["SESSION_FILE_THRESHOLD"] = 500
app.config["PERMANENT_SESSION_LIFETIME"] = 60 * 60 * 8

# Configuración de cookies
app.config["SESSION_COOKIE_HTTPONLY"] = True
app.config["SESSION_COOKIE_SECURE"] = False  # Desarrollo local con HTTP
app.config["SESSION_COOKIE_SAMESITE"] = "Lax"


# Inicializar Flask-Session
Session(app)


# --------------------------------------------------
# CONFIGURACIÓN CORS
# --------------------------------------------------

CORS(
    app,
    resources={
        r"/api/*": {
            "origins": ["http://localhost:5173", "http://localhost:5174", "http://localhost:5175"],
            "origins": ["http://localhost:5173"],
            "methods": ["GET", "POST", "PUT", "OPTIONS"],
            "allow_headers": ["Content-Type", "X-CSRF-Token"],
            "supports_credentials": True
        }
    }
)


# --------------------------------------------------
# REGISTRAR BLUEPRINTS
# --------------------------------------------------

app.register_blueprint(auth_bp)
app.register_blueprint(formacion_bp)
app.register_blueprint(contacto_bp)

# --------------------------------------------------
# RUTAS GENERALES
# --------------------------------------------------

@app.route("/", methods=["GET"])
def inicio():
    return jsonify({
        "estado": "ok",
        "mensaje": "API de Stackfolio funcionando correctamente"
    })


@app.route("/api/health", methods=["GET"])
def health():
    return jsonify({
        "estado": "ok",
        "mensaje": "Backend funcionando correctamente"
    })


# --------------------------------------------------
# INICIAR SERVIDOR
# --------------------------------------------------

if __name__ == "__main__":
    app.run(
        debug=True,
        host="127.0.0.1",
        port=5000
    )
