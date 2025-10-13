#!/bin/bash

# Criar usuário 
sudo adduser analista

# Colocando usuário no grupo sudo
sudo usermod -aG sudo analista

clear 

# Atualizar pacotes
sudo apt update -y
clear
sudo apt upgrade -y
clear

# Verificando versão Java
java -version

if [ $? = 0 ];
	then #então 
		echo "java instalado"
	else #se não
		echo "java não instalado"
		echo "gostaria de instalar o Java [s/n]?"

		read get # Variável da resposta do usuário

	if [ \"$get\" == \"s\" ];
		then #então
			sudo apt install openjdk-17-jre -y # Executa a instalação do Java
	fi # Fecha o 2° if
fi # Fecha o 1° if

clear

# Verificando versão Python
python -version

if [ $? = 0 ];
	then #então
		echo "python instalado"
	else #se não
		echo "python não instalado"
		echo "gostaria de instalar o Python [s/n]?"

		read get # Variável da resposta do usuário
	if [ \"$get\" == \"s\" ];
		then #então
			sudo apt install python3 python3-pip -y # Executa a instalação do Python
	fi # Fecha o 2° if
fi # Fecha o 2° if

clear

# Instalar Docker
sudo apt install docker.io

clear

# Ativar o serviço do docker no S.O
sudo systemctl start docker

# Habilitandoo serviço do docker no S.O
sudo systemctl enable docker

# Criando rede para as aplicações 
sudo docker network create rede-instancia

# Criando imagem node e crinado container
sudo docker build -t imagem-node -f Dockerfile.node .

clear

sudo docker run -d \
  --name container-site \
  -p 3333:3333 \
  -e APP_PORT=3333 \
  -e APP_HOST=0.0.0.0 \
  -e AMBIENTE_PROCESSO=producao \
  imagem-node

# Rodando imagem mysql e criando container
sudo docker pull mysql:8

clear

sudo docker run -d --name container-bd --network rede-instancia -p 3306:3306 -e "MYSQL_ROOT_PASSWORD=urubu100" -v $PWD/init.sql:/docker-entrypoint-initdb.d/init.sql mysql:8

# Rodando imagem python e criando container
sudo docker build -t imagem-python -f Dockerfile.python .

clear

sudo docker run -d --name container-python --network rede-instancia imagem-python
