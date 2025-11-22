from flask import Flask, request, jsonify
from flask_cors import CORS
import paramiko
import mysql.connector

# conexão com o banco
def get_db_connection():
    return mysql.connector.connect(
        host="localhost",
        user="root",
        password="17342017",  
        database="safeclass"
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

        # Comando conforme o sistema
        if sistema.lower() == "windows":
            comando = "shutdown /s /t 0"
            ssh.exec_command(comando)
        else:
            comando = "sudo systemctl poweroff --force --no-wall"
            stdin, stdout, stderr = ssh.exec_command(comando)
            # captura erros do Linux
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
        return jsonify({"status": "erro", "mensagem": str(e)}), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
