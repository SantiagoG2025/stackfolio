import pyodbc

SERVER = "Santiago"
DATABASE = "stackfolio_db"
DRIVER = "ODBC Driver 17 for SQL Server"

# Función para conectarse a SQL Server
def conectar_bd():
    conexion = pyodbc.connect(
        f"DRIVER={{{DRIVER}}};"
        f"SERVER={SERVER};"
        f"DATABASE={DATABASE};"
        "Trusted_Connection=yes;"
        "TrustServerCertificate=yes;"
    )
    return conexion