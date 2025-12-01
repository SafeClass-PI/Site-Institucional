from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko
import mysql.connector
from dotenv import load_dotenv
import os

# Carrega as variáveis do .env.dev
load_dotenv(".env.dev")

# Variáveis do banco vindas do .env.dev
DB_HOST = os.getenv("DB_HOST")
DB_USER = os.getenv("DB_USER")
DB_PASSWORD = os.getenv("DB_PASSWORD")
DB_NAME = os.getenv("DB_DATABASE")  # Seu env usa DB_DATABASE, não DB_NAME
DB_PORT = os.getenv("DB_PORT")

# conexão com o banco
def get_db_connection():
    return mysql.connector.connect(
        host=DB_HOST,
        user=DB_USER,
        password=DB_PASSWORD,
        database=DB_NAME,
        port=DB_PORT
    )

app = Flask(__name__)
CORS(app)

# rota para desligar máquina
@app.route('/desligar', methods=['POST'])
def desligar():
    data = request.json
    id_maquina = data.get('idMaquina')

    conexao = get_db_connection()
    cursor = conexao.cursor(dictionary=True)
    cursor.execute("SELECT ip, username, senha, sistemaOperacional FROM Maquina WHERE idMaquina = %s", (id_maquina,))
    maquina = cursor.fetchone()
    cursor.close()
    conexao.close()

    if not maquina:
        return jsonify({"status": "erro", "mensagem": "Máquina não encontrada"}), 404

    ip = maquina['ip']
    usuario = maquina['username']
    senha = maquina['senha']
    sistema = maquina['sistemaOperacional']

    try:
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy())
        ssh.connect(ip, username=usuario, password=senha)

        if sistema.lower() == "windows":
            ssh.exec_command("shutdown /s /t 0")
        else:
            stdin, stdout, stderr = ssh.exec_command("sudo systemctl poweroff --force --no-wall")
            erro = stderr.read().decode()
            if erro:
                ssh.close()
                return jsonify({"status": "erro", "mensagem": erro}), 500

        ssh.close()

        # Atualiza status no banco
        conexao = get_db_connection()
        cursor = conexao.cursor()
        cursor.execute("UPDATE Maquina SET estado = %s WHERE idMaquina = %s", ("desligada", id_maquina))
        conexao.commit()
        cursor.close()
        conexao.close()

        return jsonify({"status": "ok", "mensagem": f"{ip} desligada com sucesso!"})

    except Exception as e:
        print("\n================= ERRO NO DESLIGAMENTO =================")
        print(e)
        print("=========================================================\n")
        return jsonify({"status": "erro", "mensagem": str(e)}), 500


if __name__ == '__main__':
    app.run(
        host=os.getenv("APP_HOST", "0.0.0.0"), 
        port=int(os.getenv("APP_PORT_PYTHON", 5000)),  
        debug=True
    )
