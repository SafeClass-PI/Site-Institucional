from flask import Flask, request, jsonify #framework para criação de apis,
#request usado para acessar dados que chegam via HTTP
#jsonify dicts = json
from flask_cors import CORS # requisições de diferentes origens, pois o front esta em outro dominio(porta)
import paramiko # biblioteca para conexao ssh e para executar comandos em outra maquina

app = Flask(__name__) #cria app flask
CORS(app) # permite que qualquer front end possa enviar requisições para essa API

@app.route('/desligar', methods=['POST']) #definir rota
def desligar():
    data = request.json # dados gerados do fetch do JS
    ip = data.get('ip')
    usuario = data.get('usuario')
    senha = data.get('senha') # get paraextrair informação
    sistema = data.get('sistema')

    try:
        # parte que ele abre o CLIENT SSH, conexão SSH
        ssh = paramiko.SSHClient()
        ssh.set_missing_host_key_policy(paramiko.AutoAddPolicy()) #ignora verificação de chaves SSH desconhecidas
        #(para não travar se a máquina não estiver na lista de hosts confiáveis).
        ssh.connect(ip, username=usuario, password=senha)

       # filtra por SO qual o comando certo para jogar naquele terminal
        comando = "shutdown /s /t 0" if sistema == "windows" else "sudo shutdown -h now"
        ssh.exec_command(comando) #executa o comando
        ssh.close() # fecha a conexão

        return jsonify({"status": "ok", "mensagem": f"{ip} desligada com sucesso!"})

    except Exception as e:
        return jsonify({"status": "erro", "mensagem": str(e)}), 500


# inicia a aplicação flask e define a porta
if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000)
