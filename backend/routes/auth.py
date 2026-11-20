from flask import Blueprint, request, jsonify, session, current_app
from werkzeug.security import generate_password_hash, check_password_hash
from database import conectar_bd
import re
import secrets
import hmac


# Blueprint de autenticación
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')


# --------------------------------------------------
# FUNCIONES AUXILIARES DE SEGURIDAD
# --------------------------------------------------

def generar_token_csrf():
    """Genera un token CSRF y lo guarda en la sesión."""
    token = secrets.token_urlsafe(32)
    session['csrf_token'] = token
    return token


def validar_csrf():
    """Comprueba que la solicitud incluya el token CSRF correcto."""
    token_sesion = session.get('csrf_token')
    token_recibido = request.headers.get('X-CSRF-Token')

    if not token_sesion or not token_recibido:
        return False

    return hmac.compare_digest(token_sesion, token_recibido)


def error_csrf():
    return jsonify({
        "error": "Token CSRF ausente o inválido."
    }), 403


# --------------------------------------------------
# OBTENER TOKEN CSRF
# --------------------------------------------------

@auth_bp.route('/csrf', methods=['GET'])
def obtener_csrf():

    if not session.get('csrf_token'):
        generar_token_csrf()

    return jsonify({
        "csrf_token": session['csrf_token']
    }), 200


# --------------------------------------------------
# REGISTRO
# --------------------------------------------------

@auth_bp.route('/registro', methods=['POST'])
def registro():

    # Validar token CSRF
    if not validar_csrf():
        return error_csrf()

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    nombre = datos.get('nombre', '').strip()
    email = datos.get('email', '').strip().lower()
    password = datos.get('password', '')

    # Validar campos obligatorios
    if not nombre or not email or not password:
        return jsonify({
            "error": "Todos los campos son obligatorios."
        }), 400

    # Validar longitud del nombre
    if len(nombre) > 100:
        return jsonify({
            "error": "El nombre no puede superar los 100 caracteres."
        }), 400

    # Validar longitud del email
    if len(email) > 100:
        return jsonify({
            "error": "El email no puede superar los 100 caracteres."
        }), 400

    # Validar formato del email
    email_regex = r'^[^\s@]+@[^\s@]+\.[^\s@]+$'

    if not re.match(email_regex, email):
        return jsonify({
            "error": "El formato del email no es válido."
        }), 400

    # Validar contraseña
    if len(password) < 8:
        return jsonify({
            "error": "La contraseña debe tener al menos 8 caracteres."
        }), 400

    if not re.search(r'[A-Z]', password):
        return jsonify({
            "error": "La contraseña debe contener al menos una mayúscula."
        }), 400

    if not re.search(r'[0-9]', password):
        return jsonify({
            "error": "La contraseña debe contener al menos un número."
        }), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        # Comprobar si el email ya existe
        cursor.execute(
            "SELECT id_usuario FROM usuarios WHERE email = ?",
            (email,)
        )

        if cursor.fetchone():
            return jsonify({
                "error": "El email ya se encuentra registrado."
            }), 409

        # Generar hash de contraseña
        password_hash = generate_password_hash(password)

        # Insertar usuario
        cursor.execute(
            """
            INSERT INTO usuarios (nombre, email, password_hash, rol)
            VALUES (?, ?, ?, ?)
            """,
            (nombre, email, password_hash, 'usuario')
        )

        conexion.commit()

        return jsonify({
            "mensaje": "Usuario registrado correctamente."
        }), 201

    except Exception as error:
        if conexion:
            conexion.rollback()

        print("Error en el registro:", error)

        return jsonify({
            "error": "Ocurrió un error al registrar el usuario."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# LOGIN
# --------------------------------------------------

@auth_bp.route('/login', methods=['POST'])
def login():

    # Validar token CSRF
    if not validar_csrf():
        return error_csrf()

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    email = datos.get('email', '').strip().lower()
    password = datos.get('password', '')

    if not email or not password:
        return jsonify({
            "error": "El email y la contraseña son obligatorios."
        }), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        cursor.execute(
            """
            SELECT id_usuario, nombre, email, password_hash, rol
            FROM usuarios
            WHERE email = ?
            """,
            (email,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            return jsonify({
                "error": "El email o la contraseña son incorrectos."
            }), 401

        if not check_password_hash(usuario.password_hash, password):
            return jsonify({
                "error": "El email o la contraseña son incorrectos."
            }), 401

        # Renovar el identificador de sesión para evitar
        # ataques de fijación de sesión.
        current_app.session_interface.regenerate(session)

        # Limpiar los datos anteriores de la sesión
        session.clear()

        # Guardar la identidad del usuario en el servidor
        session['user_id'] = usuario.id_usuario
        session.permanent = True

        # Renovar el token CSRF
        nuevo_token = generar_token_csrf()

        return jsonify({
            "mensaje": "Inicio de sesión exitoso.",
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol
            },
            "csrf_token": nuevo_token
        }), 200

    except Exception as error:
        print("Error en el login:", error)

        return jsonify({
            "error": "Ocurrió un error al iniciar sesión."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# CONSULTAR SESIÓN ACTUAL
# --------------------------------------------------

@auth_bp.route('/session', methods=['GET'])
def consultar_sesion():

    id_usuario = session.get('user_id')

    if not id_usuario:
        return jsonify({
            "autenticado": False,
            "error": "No hay una sesión activa."
        }), 401

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        cursor.execute(
            """
            SELECT id_usuario, nombre, email, rol
            FROM usuarios
            WHERE id_usuario = ?
            """,
            (id_usuario,)
        )

        usuario = cursor.fetchone()

        if not usuario:
            session.clear()

            return jsonify({
                "autenticado": False,
                "error": "El usuario ya no existe."
            }), 401

        return jsonify({
            "autenticado": True,
            "usuario": {
                "id_usuario": usuario.id_usuario,
                "nombre": usuario.nombre,
                "email": usuario.email,
                "rol": usuario.rol
            },
            "csrf_token": session.get('csrf_token')
        }), 200

    except Exception as error:
        print("Error al consultar la sesión:", error)

        return jsonify({
            "error": "Ocurrió un error al consultar la sesión."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# CERRAR SESIÓN
# --------------------------------------------------

@auth_bp.route('/logout', methods=['POST'])
def logout():

    # Validar token CSRF
    if not validar_csrf():
        return error_csrf()

    # Eliminar los datos de la sesión
    session.clear()

    return jsonify({
        "mensaje": "Sesión cerrada correctamente."
    }), 200