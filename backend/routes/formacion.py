
from flask import Blueprint, request, jsonify, session
from database import conectar_bd
from routes.auth import validar_csrf, error_csrf


formacion_bp = Blueprint(
    'formacion',
    __name__,
    url_prefix='/api/formacion'
)


# --------------------------------------------------
# CONSULTAR FORMACIÓN ACADÉMICA
# --------------------------------------------------

@formacion_bp.route('', methods=['GET'])
def obtener_formacion():

    id_usuario = session.get('user_id')
    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        if id_usuario:
            # Usuario autenticado: mostrar solamente sus registros.
            cursor.execute(
                """
                SELECT id_formacion, titulo, institucion,
                       estado, competencias
                FROM formacion_academica
                WHERE id_usuario = ?
                ORDER BY id_formacion
                """,
                (id_usuario,)
            )

        else:
            # Visitante: mostrar la primera cuenta que tenga
            # formación académica cargada.
            cursor.execute(
                """
                SELECT id_formacion, titulo, institucion,
                       estado, competencias
                FROM formacion_academica
                WHERE id_usuario = (
                    SELECT TOP 1 id_usuario
                    FROM formacion_academica
                    ORDER BY id_usuario ASC
                )
                ORDER BY id_formacion
                """
            )

        registros = cursor.fetchall()

        formaciones = [
            {
                "id_formacion": registro.id_formacion,
                "titulo": registro.titulo,
                "institucion": registro.institucion,
                "estado": registro.estado,
                "competencias": registro.competencias or ""
            }
            for registro in registros
        ]

        return jsonify({
            "formaciones": formaciones
        }), 200

    except Exception as error:
        print("Error al obtener la formación académica:", error)

        return jsonify({
            "error": "No se pudo obtener la formación académica."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# AGREGAR FORMACIÓN ACADÉMICA
# --------------------------------------------------

@formacion_bp.route('', methods=['POST'])
def agregar_formacion():

    id_usuario = session.get('user_id')

    if not id_usuario:
        return jsonify({
            "error": "Debés iniciar sesión para agregar una formación."
        }), 401

    if not validar_csrf():
        return error_csrf()

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    titulo = datos.get('titulo', '')
    institucion = datos.get('institucion', '')
    estado = datos.get('estado', '')
    competencias = datos.get('competencias', '')

    if not all(
        isinstance(valor, str)
        for valor in [titulo, institucion, estado, competencias]
    ):
        return jsonify({
            "error": "Los campos deben contener texto."
        }), 400

    titulo = titulo.strip()
    institucion = institucion.strip()
    estado = estado.strip()
    competencias = competencias.strip()

    if not titulo or not institucion or not estado:
        return jsonify({
            "error": "Título, institución y estado son obligatorios."
        }), 400

    if len(titulo) > 150 or len(institucion) > 150:
        return jsonify({
            "error": "El título y la institución no pueden superar los 150 caracteres."
        }), 400

    if len(estado) > 100:
        return jsonify({
            "error": "El estado no puede superar los 100 caracteres."
        }), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        cursor.execute(
            """
            INSERT INTO formacion_academica
                (id_usuario, titulo, institucion, estado, competencias)
            OUTPUT INSERTED.id_formacion
            VALUES (?, ?, ?, ?, ?)
            """,
            (
                id_usuario,
                titulo,
                institucion,
                estado,
                competencias
            )
        )

        nuevo_registro = cursor.fetchone()
        conexion.commit()

        return jsonify({
            "mensaje": "Formación académica agregada correctamente.",
            "id_formacion": nuevo_registro.id_formacion
        }), 201

    except Exception as error:
        if conexion:
            conexion.rollback()

        print("Error al agregar formación académica:", error)

        return jsonify({
            "error": "No se pudo agregar la formación académica."
        }), 500

    finally:
        if conexion:
            conexion.close()


# --------------------------------------------------
# MODIFICAR FORMACIÓN ACADÉMICA
# --------------------------------------------------

@formacion_bp.route('/<int:id_formacion>', methods=['PUT'])
def modificar_formacion(id_formacion):

    id_usuario = session.get('user_id')

    if not id_usuario:
        return jsonify({
            "error": "Debés iniciar sesión para modificar una formación."
        }), 401

    if not validar_csrf():
        return error_csrf()

    datos = request.get_json()

    if not datos:
        return jsonify({
            "error": "No se recibieron datos."
        }), 400

    titulo = datos.get('titulo', '')
    institucion = datos.get('institucion', '')
    estado = datos.get('estado', '')
    competencias = datos.get('competencias', '')

    if not all(
        isinstance(valor, str)
        for valor in [titulo, institucion, estado, competencias]
    ):
        return jsonify({
            "error": "Los campos deben contener texto."
        }), 400

    titulo = titulo.strip()
    institucion = institucion.strip()
    estado = estado.strip()
    competencias = competencias.strip()

    if not titulo or not institucion or not estado:
        return jsonify({
            "error": "Título, institución y estado son obligatorios."
        }), 400

    if len(titulo) > 150 or len(institucion) > 150:
        return jsonify({
            "error": "El título y la institución no pueden superar los 150 caracteres."
        }), 400

    if len(estado) > 100:
        return jsonify({
            "error": "El estado no puede superar los 100 caracteres."
        }), 400

    conexion = None

    try:
        conexion = conectar_bd()
        cursor = conexion.cursor()

        # Solo permite modificar registros pertenecientes
        # al usuario autenticado.
        cursor.execute(
            """
            UPDATE formacion_academica
            SET titulo = ?,
                institucion = ?,
                estado = ?,
                competencias = ?
            WHERE id_formacion = ?
              AND id_usuario = ?
            """,
            (
                titulo,
                institucion,
                estado,
                competencias,
                id_formacion,
                id_usuario
            )
        )

        if cursor.rowcount == 0:
            conexion.rollback()

            return jsonify({
                "error": "La formación no existe o no tenés permiso para modificarla."
            }), 404

        conexion.commit()

        return jsonify({
            "mensaje": "Formación académica modificada correctamente."
        }), 200

    except Exception as error:
        if conexion:
            conexion.rollback()

        print("Error al modificar formación académica:", error)

        return jsonify({
            "error": "No se pudo modificar la formación académica."
        }), 500

    finally:
        if conexion:
            conexion.close()

