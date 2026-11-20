
from flask import Blueprint, request, jsonify, session
from database import conectar_bd
from routes.auth import validar_csrf, error_csrf
from datetime import datetime
import re

contacto_bp = Blueprint(
    "contacto",
    __name__,
    url_prefix="/api/contacto"
)


def obtener_administrador(cursor):
    """Comprueba el rol del usuario autenticado desde SQL Server."""
    id_usuario = session.get("user_id")

    if not id_usuario:
        return False

    cursor.execute(
        "SELECT rol FROM usuarios WHERE id_usuario = ?",
        (id_usuario,)
    )
    usuario = cursor.fetchone()

    return bool(usuario and usuario.rol == "admin")


def convertir_fecha(fecha):
    if isinstance(fecha, datetime):
        return fecha.strftime("%d/%m/%Y - %H:%M")
    return str(fecha) if fecha else ""


# --------------------------------------------------
# ENVIAR CONSULTA: VISITANTE O USUARIO REGISTRADO
# --------------------------------------------------

@contacto_bp.route("", methods=["POST"])
def enviar_consulta():

    if not validar_csrf():
        return error_csrf()

    datos = request.get_json(silent=True) or {}

    asunto = str(datos.get("asunto") or "").strip()
    mensaje = str(datos.get("mensaje") or "").strip()

    if not mensaje:
        return jsonify({"error": "El mensaje es obligatorio."}), 400

    if len(asunto) > 200:
        return jsonify({"error": "El asunto no puede superar los 200 caracteres."}), 400

    if len(mensaje) > 5000:
        return jsonify({"error": "El mensaje no puede superar los 5000 caracteres."}), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        # Si existe una sesión, los datos se obtienen de la cuenta.
        id_usuario = session.get("user_id")

        if id_usuario:
            cursor.execute(
                """
                SELECT nombre, email
                FROM usuarios
                WHERE id_usuario = ?
                """,
                (id_usuario,)
            )
            usuario = cursor.fetchone()

            if not usuario:
                session.clear()
                return jsonify({"error": "La sesión ya no es válida."}), 401

            nombre = usuario.nombre
            email = usuario.email

        else:
            # Los visitantes proporcionan sus propios datos.
            nombre = str(datos.get("nombre") or "").strip()
            email = str(datos.get("email") or "").strip().lower()

            if not nombre or not email:
                return jsonify({
                    "error": "El nombre y el correo electrónico son obligatorios."
                }), 400

            if len(nombre) > 100 or len(email) > 100:
                return jsonify({
                    "error": "El nombre o el correo superan la longitud permitida."
                }), 400

            if not re.match(r"^[^\s@]+@[^\s@]+\.[^\s@]+$", email):
                return jsonify({
                    "error": "El correo electrónico no tiene un formato válido."
                }), 400

        cursor.execute(
            """
            INSERT INTO contactos
                (nombre, email, asunto, mensaje, respondido)
            VALUES (?, ?, ?, ?, 0)
            """,
            (
                nombre,
                email,
                asunto or "Consulta general desde Stackfolio",
                mensaje
            )
        )

        conexion.commit()

        return jsonify({
            "mensaje": "Consulta enviada correctamente."
        }), 201

    except Exception as error:
        if conexion:
            conexion.rollback()

        print("Error al guardar la consulta:", error)

        return jsonify({
            "error": "No se pudo enviar la consulta."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# LISTAR CONSULTAS: SOLO ADMINISTRADOR
# --------------------------------------------------

@contacto_bp.route("", methods=["GET"])
def listar_consultas():

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        if not obtener_administrador(cursor):
            return jsonify({
                "error": "No tenés permisos para consultar esta bandeja."
            }), 403

        cursor.execute(
            """
            SELECT
                id_contacto,
                nombre,
                email,
                asunto,
                mensaje,
                respondido,
                fecha_envio
            FROM contactos
            ORDER BY fecha_envio DESC
            """
        )

        consultas = []

        for fila in cursor.fetchall():
            consultas.append({
                "id": fila.id_contacto,
                "nombre": fila.nombre,
                "email": fila.email,
                "asunto": fila.asunto or "Consulta general",
                "mensaje": fila.mensaje,
                "respondido": bool(fila.respondido),
                "fecha": convertir_fecha(fila.fecha_envio)
            })

        return jsonify({"consultas": consultas}), 200

    except Exception as error:
        print("Error al listar consultas:", error)

        return jsonify({
            "error": "No se pudieron obtener las consultas."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# ACTUALIZAR ESTADO: SOLO ADMINISTRADOR
# --------------------------------------------------

@contacto_bp.route("/<int:id_contacto>", methods=["PUT"])
def actualizar_consulta(id_contacto):

    if not validar_csrf():
        return error_csrf()

    datos = request.get_json(silent=True) or {}
    respondido = datos.get("respondido")

    if not isinstance(respondido, bool):
        return jsonify({
            "error": "El estado de respuesta no es válido."
        }), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        if not obtener_administrador(cursor):
            return jsonify({
                "error": "No tenés permisos para modificar consultas."
            }), 403

        cursor.execute(
            """
            UPDATE contactos
            SET respondido = ?
            WHERE id_contacto = ?
            """,
            (respondido, id_contacto)
        )

        if cursor.rowcount == 0:
            return jsonify({
                "error": "La consulta no existe."
            }), 404

        conexion.commit()

        return jsonify({
            "mensaje": "Estado de la consulta actualizado."
        }), 200

    except Exception as error:
        if conexion:
            conexion.rollback()

        print("Error al actualizar consulta:", error)

        return jsonify({
            "error": "No se pudo actualizar la consulta."
        }), 500

    finally:
        if conexion:
            conexion.close()
