	DROP DATABASE IF EXISTS safeclass;
	CREATE DATABASE safeclass;
	USE safeclass;


	CREATE TABLE Endereco (
		idEndereco INT PRIMARY KEY AUTO_INCREMENT,
		logradouro VARCHAR(45),
		numero VARCHAR(45),
		cidade VARCHAR(45),
		bairro VARCHAR(45),
		uf CHAR(2)
	);

	Insert into Endereco (logradouro, numero, cidade, bairro, uf) values
	("Avenida Paulista", 290, "São Paulo", "Bela vista", "SP");

	CREATE TABLE Escola (
		idEscola INT PRIMARY KEY AUTO_INCREMENT,
		fkEndereco INT,
		nome VARCHAR(45),
		email VARCHAR(45),
		telefone CHAR(11),
		codigoInep VARCHAR(45),
		FOREIGN KEY (fkEndereco)
		REFERENCES Endereco(idEndereco)
	);

	INSERT INTO Escola (idEscola, fkEndereco, nome, email, telefone, codigoInep) VALUES
	(1, 1, "Escola Esperança", "escolaesperanca@gmail.com", 11934891828, 'afs12');

	CREATE TABLE CodigoAtivacao (
		idCodigo INT PRIMARY KEY AUTO_INCREMENT,
		fkEscola INT,
		codigo VARCHAR(45),
		validade DATE,
		qtdUsos INT,
		FOREIGN KEY (fkEscola)
		REFERENCES Escola(idEscola)
	);

	INSERT INTO CodigoAtivacao (fkEscola, codigo, validade, qtdUsos) VALUES 
	(1, "00j12", "2025-09-11", 10);

	CREATE TABLE Sala (
		idSala INT PRIMARY KEY AUTO_INCREMENT,
		fkEscola INT,
		nome VARCHAR(45),
		localizacao VARCHAR(45),
		FOREIGN KEY (fkEscola)
		REFERENCES Escola(idEscola)
	);

	INSERT INTO Sala (nome, fkEscola, localizacao) VALUES
	("Sala 1", 1, "2° andar, lado esquerdo"),
	("Sala 2", 1, "1° andar, lado direito"),
	("Sala 3", 1, "2° andar, lado direito"),
	("Sala 4", 1, "1° andar, lado esquerdo"),
	("Sala 5", 1, "2° andar, lado direito"),
	("Sala 6", 1, "1° andar, lado esquerdo");
    
    INSERT INTO Sala (nome, fkEscola, localizacao) VALUES
	("Sala 7", 1, "2° andar, lado esquerdo");
	

	CREATE TABLE Cargo (
		idCargo INT PRIMARY KEY AUTO_INCREMENT, 
		nome VARCHAR(45),
		permissao VARCHAR(100)
	);

	INSERT INTO Cargo (nome, permissao) VALUES
	("Gestor", "Visualizar métricas, visualizar/editar/remover/inserir usuários e máquinas"),
	("Técnico de T.I", "Visualizar métricas, visualizar/editar/remover/inserir máquinas"),
	("Professor", "Visualizar métricas");

	CREATE TABLE Usuario (
		idUsuario INT AUTO_INCREMENT,
		fkCargo INT,
		fkEscola INT,
		fkGestor INT,
		nome VARCHAR(45),
		email VARCHAR(45),
		senha VARCHAR(45),
		senhaTemporaria DATETIME NULL,
		dtCadastro DATE,
		status VARCHAR(45),
		imagemPerfil VARCHAR(255),
		PRIMARY KEY (idUsuario),
		FOREIGN KEY (fkCargo)
		REFERENCES Cargo(idCargo),
		FOREIGN KEY (fkEscola)
		REFERENCES Escola(idEscola),
		FOREIGN KEY (fkGestor) REFERENCES Usuario(idUsuario)
	);

	INSERT INTO Usuario (fkCargo, fkEscola, nome, email, senha, dtCadastro, status) VALUES 
	(1, 1, "Ryan Patric", "ryanpina@gmail.com", "urubu100", "2025-09-10", "ativo"),
	(1, 1, "Felipe Ferraz", "felipegmail.com", "urubu100", "2025-09-10", "pendente");

	CREATE TABLE Maquina (
		idMaquina INT PRIMARY KEY AUTO_INCREMENT,
		fkSala INT,
		sistemaOperacional VARCHAR(45),
		marca VARCHAR(45),
		modelo VARCHAR(45),
		macaddress VARCHAR(45),
		status VARCHAR(45),
		estado VARCHAR(45),
		FOREIGN KEY (fkSala)
		REFERENCES Sala(idSala)
	);

	INSERT INTO Maquina (fkSala, sistemaOperacional, marca, modelo, macaddress, status, estado) VALUES
	(1, 'Linux', 'Dell', 'Inspiron 15', 'A4:C3:F0:9B:2D:67', 'Crítico', 'Ligada'),
	(1, 'Windows', 'HP', 'Pavilion 14', 'B3:F2:A1:8C:4D:12','Crítico', 'Ligada'),
	(2, 'Linux', 'Lenovo', 'ThinkPad E14', 'C1:D4:E5:F6:A7:10','Estável', 'Ligada'),
	(2, 'Windows', 'Acer', 'Aspire 5', 'D9:E8:F7:A6:B5:21','Estável', 'Ligada'),
	(3, 'Windows', 'Asus', 'VivoBook 15', 'E1:F2:A3:B4:C5:32','Estável', 'Ligada'),
	(3, 'Linux', 'Dell', 'Latitude 3500', 'F1:A2:B3:C4:D5:43','Estável', 'Ligada'),
	(4, 'Windows', 'HP', 'EliteBook 840', 'A2:B3:C4:D5:E6:54','Estável', 'Ligada'),
	(4, 'Linux', 'Lenovo', 'IdeaPad 3', 'B1:C2:D3:E4:F5:65','Estável', 'Ligada'),
	(5, 'Windows', 'Acer', 'Nitro 5', 'C3:D4:E5:F6:A7:76','Estável', 'Ligada'),
	(5, 'Linux', 'Dell', 'Vostro 3500', 'D1:E2:F3:A4:B5:87','Estável', 'Ligada'),
	(6, 'Windows', 'Asus', 'TUF Gaming', 'E2:F3:A4:B5:C6:98','Estável', 'Ligada'),
	(6, 'Linux', 'HP', 'ProBook 440', 'F3:A4:B5:C6:D7:09','Estável', 'Ligada'),
	(1, 'Windows', 'Lenovo', 'ThinkBook 15', 'A3:B4:C5:D6:E7:11','Estável', 'Ligada'),
	(1, 'Linux', 'Acer', 'Swift 3', 'B4:C5:D6:E7:F8:22','Estável', 'Ligada'),
	(2, 'Windows', 'Dell', 'G15', 'C5:D6:E7:F8:A9:33','Estável', 'Ligada'),
	(2, 'Linux', 'HP', 'Envy 13', 'D6:E7:F8:A9:B0:44','Estável', 'Ligada'),
	(3, 'Windows', 'Lenovo', 'Yoga Slim 7', 'E7:F8:A9:B0:C1:55','Estável', 'Ligada'),
	(3, 'Linux', 'Acer', 'Spin 5', 'F8:A9:B0:C1:D2:66','Estável', 'Ligada'),
	(4, 'Windows', 'Asus', 'ZenBook 14', 'A9:B0:C1:D2:E3:77','Estável', 'Ligada'),
	(4, 'Linux', 'Dell', 'Inspiron 14', 'B0:C1:D2:E3:F4:88','Estável', 'Ligada'),
	(5, 'Windows', 'HP', 'Spectre x360', 'C1:D2:E3:F4:A5:99','Estável', 'Ligada'),
	(5, 'Linux', 'Lenovo', 'ThinkPad L15', 'D2:E3:F4:A5:B6:AA','Estável', 'Ligada'),
	(6, 'Windows', 'Acer', 'Aspire 7', 'E3:F4:A5:B6:C7:BB','Estável', 'Ligada'),
	(6, 'Linux', 'Asus', 'ExpertBook', 'F4:A5:B6:C7:D8:CC','Estável', 'Ligada'),
	(6, 'Linux', 'Asus', 'ExpertBook', 'F4:A4:B6:C7:D7:CC','Estável', 'Ligada'),
	(1, 'Windows', 'Dell', 'XPS 13', 'A5:B6:C7:D8:E9:DD','Crítico', 'Ligada'),
	(1, 'Linux', 'HP', 'Elite x2', 'B6:C7:D8:E9:F0:EE','Estável', 'Ligada'),
	(2, 'Windows', 'Lenovo', 'Legion 5', 'C7:D8:E9:F0:A1:FF','Estável', 'Ligada'),
	(2, 'Linux', 'Acer', 'Chromebook 514', 'D8:E9:F0:A1:B2:10','Estável', 'Ligada'),
	(3, 'Windows', 'Asus', 'ROG Zephyrus', 'E9:F0:A1:B2:C3:21','Estável', 'Ligada'),
	(3, 'Linux', 'Dell', 'Precision 3550', 'F0:A1:B2:C3:D4:32','Estável', 'Ligada'),
	(4, 'Windows', 'HP', 'OMEN 16', 'A1:B2:C3:D4:E5:43','Estável', 'Ligada'),
	(4, 'Linux', 'Lenovo', 'IdeaPad 5', 'B2:C3:D4:E5:F6:54','Estável', 'Ligada'),
	(5, 'Windows', 'Acer', 'Predator Helios', 'C3:D4:E5:F6:A7:65','Estável', 'Ligada'),
	(5, 'Linux', 'Asus', 'Chromebook CX1', 'D4:E5:F6:A7:B8:76','Estável', 'Ligada'),
	(5, 'Windows', 'Dell', 'Latitude 7420', 'E5:F6:A7:B8:C9:87', 'Estável','Ligada'),
	(6, 'Linux', 'HP', 'ZBook Firefly', 'F6:A7:B8:C9:D0:98','Estável', 'Ligada'),
	(6, 'Windows', 'Lenovo', 'ThinkPad X1', 'A7:B8:C9:D0:E1:09', 'Atenção','Ligada'),
	(1, 'Linux', 'Acer', 'TravelMate P2', 'B8:C9:D0:E1:F2:10','Atenção', 'Ligada'),
	(1, 'Windows', 'Asus', 'Vivobook Go', 'C9:D0:E1:F2:A3:21', 'Atenção','Ligada'),
	(2, 'Linux', 'Dell', 'Optiplex 7090', 'D0:E1:F2:A3:B4:32', 'Atenção','Ligada'),
	-- 4 desligadas:
	(2, 'Linux', 'HP', 'ProDesk 400', 'E1:F2:A3:B4:C5:43', 'Estável','Desligada'),
	(3, 'Windows', 'Lenovo', 'V15', 'F2:A3:B4:C5:D6:54', 'Estável','Desligada'),
	(3, 'Linux', 'Acer', 'Veriton N', 'A3:B4:C5:D6:E7:65', 'Estável','Desligada'),
	(4, 'Windows', 'Asus', 'ExpertCenter D5', 'B4:C5:D6:E7:F8:76', 'Estável', 'Desligada');

	CREATE TABLE DesligamentoRemoto (
		idDesligamento INT,
		fkMaquina INT,
		fkUsuario INT,
		dtDesligamento DATETIME,
		PRIMARY KEY (idDesligamento, fkMaquina),
		FOREIGN KEY (fkMaquina)
		REFERENCES Maquina(idMaquina),
		FOREIGN KEY (fkUsuario)
		REFERENCES Usuario(idUsuario)
	);

	CREATE TABLE Componente (
		idComponente INT auto_increment,
		fkMaquina INT,
		nome VARCHAR(45),
		formatacao VARCHAR(45),
		capacidade VARCHAR(45),
		PRIMARY KEY (idComponente, fkMaquina),
		FOREIGN KEY (fkMaquina)
		REFERENCES Maquina(idMaquina)
	);

	INSERT INTO Componente (idComponente, fkMaquina, nome, formatacao, capacidade) VALUES 
	(default, 1, 'Memória RAM', 'gb', '16GB DDR4'), 
	(default, 1, 'Disco Rígido', '%', '1TB'),
	(default, 1, 'Processador', '%', 'Intel i7'),
	(default, 1, 'Upload', 'Mbps', '1000 Mbps'),
	(default, 1, 'Download', 'Mbps', '1000 Mbps');

	CREATE TABLE Captura (
		idCaptura INT AUTO_INCREMENT,
		fkComponente INT,
		registro FLOAT,
		dtCaptura TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
		PRIMARY KEY (idCaptura, fkComponente),
		FOREIGN KEY (fkComponente)
		REFERENCES Componente(idComponente)
	);

	CREATE TABLE Parametro (
		idParametro INT AUTO_INCREMENT,
		fkComponente INT, 
		nivel VARCHAR(45),
		minimo VARCHAR(45),
		maximo VARCHAR(45),
		PRIMARY KEY (idParametro, fkComponente),
		FOREIGN KEY (fkComponente)
		REFERENCES Componente(idComponente)
	);

	INSERT INTO Parametro VALUES
	(default, 1, "Crítico", 85.5, 100),
	(default, 1, "Atenção", 73.9, 85.49),
	(default, 2, "Crítico", 92.4, 100),
	(default, 2, "Atenção", 87.9, 92.39),
	(default, 3, "Crítico", 60.3, 100),
	(default, 3, "Atenção", 52.7, 60.29),
	(default, 4, "Crítico", 10.0, 0.0),
	(default, 4, "Atenção", 20.0, 10.01),
	(default, 5, "Crítico", 30.0, 0.0),
	(default, 5, "Atenção", 65.0, 30.01);

	CREATE TABLE Alerta (
		idAlerta INT AUTO_INCREMENT,
		fkParametro INT,
		fkCaptura INT,
		mensagem VARCHAR(80),
		PRIMARY KEY (idAlerta, fkParametro),
		FOREIGN KEY (fkParametro)
		REFERENCES Parametro(idParametro),
		FOREIGN KEY (fkCaptura)
		REFERENCES Captura(idCaptura)
	);


	-- --------------- SELECT´S PÁGINA: PÁGINA GERAL ----------------------------------------------------------------
	-- Contar quantas máquinas estão ligadas  
	SELECT SUM(CASE WHEN estado = 'Ligada' THEN 1 ELSE 0 END) AS maquinasLigadas,
	COUNT(idMaquina) AS totalMaquinas
	FROM Maquina;

	-- Taxa de Uptime do sistema diário
	SELECT COUNT(c.idCaptura) AS totalCapturas, COUNT(a.idAlerta) AS totalAlertas,
		ROUND(
			(1-(COUNT(a.idAlerta) / COUNT(c.idCaptura))) * 100,2) AS uptime_percentual
	FROM captura AS c
	LEFT JOIN alerta AS a
	ON a.fkCaptura = c.idCaptura
	WHERE DATE(c.dtCaptura) = CURDATE();

	-- Select máquina crítica
	SELECT CONCAT("Máquina", " ", m.idMaquina) AS maquina, COUNT(a.idAlerta) AS TotalAlertas, CONCAT("Sala", " ", m.fkSala) AS localizacao, CONCAT("Mac Address:", " ", m.macaddress) AS macaddress
	FROM Maquina AS m
	JOIN Componente AS c ON c.fkMaquina = m.idMaquina
	JOIN Captura AS ca ON ca.fkComponente = c.idComponente 
	JOIN Alerta AS a ON a.fkCaptura = ca.idCaptura
	GROUP BY m.idMaquina
	ORDER BY TotalAlertas DESC
	LIMIT 1;
		
	-- Contar quantidade de alerta do dia
	SELECT COUNT(a.idAlerta) AS qtdAlertas
	FROM alerta AS a
	JOIN captura AS c ON c.idCaptura = a.fkCaptura
	WHERE DATE(c.dtCaptura) = CURDATE();

	-- Select salas e máquinas 
	WITH maquina_status AS (
	  SELECT 
		m.fkSala,
		CASE 
		  WHEN m.status = 'Crítico' THEN 3
		  WHEN m.status = 'Atenção' THEN 2
		  WHEN m.status = 'Estável' THEN 1
		END AS valorStatus
	  FROM maquina AS m
	),
	ordered AS (
	  SELECT 
		fkSala,
		valorStatus,
		ROW_NUMBER() OVER (PARTITION BY fkSala ORDER BY valorStatus) AS rn,
		COUNT(*) OVER (PARTITION BY fkSala) AS total
	  FROM maquina_status
	)
	SELECT 
	  s.idSala,
	  s.nome,
	  o.total AS qtdMaquinas,
	  CASE o.valorStatus
		WHEN 3 THEN 'Crítico'
		WHEN 2 THEN 'Atenção'
		WHEN 1 THEN 'Estável'
	  END AS mediana
	FROM sala AS s
	JOIN ordered AS o 
	  ON o.fkSala = s.idSala
	WHERE o.rn IN (
	  FLOOR((o.total + 1) / 2),
	  CEIL((o.total + 1) / 2)
	)
	GROUP BY s.idSala, s.nome, o.valorStatus, o.total
	ORDER BY o.valorStatus DESC;
		
	-- Select máquinas da Sala
	SELECT CONCAT('Máquina ', m.idMaquina) AS identificacao, m.status, 
		CASE 
		WHEN m.status = 'Estável' THEN 'Funcionamento regular'
		ELSE ult.mensagem 
		END AS descricao
	FROM maquina AS m
	LEFT JOIN (
		SELECT 
			co2.fkMaquina,
			a2.mensagem
		FROM alerta a2
		JOIN captura c2 ON c2.idCaptura = a2.fkCaptura
		JOIN componente co2 ON co2.idComponente = c2.fkComponente
		JOIN (
			SELECT co3.fkMaquina, MAX(c3.dtCaptura) AS ultData
			FROM alerta a3
			JOIN captura c3 ON c3.idCaptura = a3.fkCaptura
			JOIN componente co3 ON co3.idComponente = c3.fkComponente
			GROUP BY co3.fkMaquina
		) AS sub ON sub.fkMaquina = co2.fkMaquina AND sub.ultData = c2.dtCaptura
	) AS ult ON ult.fkMaquina = m.idMaquina
	WHERE m.fkSala = 1
	ORDER BY 
		CASE 
			WHEN m.status = 'Crítico' THEN 1
			WHEN m.status = 'Atenção' THEN 2
			WHEN m.status = 'Estável' THEN 3
			ELSE 4
		END;

	-- Select últimos alertas
			SELECT CONCAT("Máquina"," ", m.idMaquina) AS identificacao, a.mensagem AS mensagem, p.nivel AS parametro, CONCAT("Sala"," ", m.fkSala) AS localizacao,  c.dtCaptura AS hora
			FROM maquina AS m
			JOIN componente AS co
			ON m.idMaquina = co.fkMaquina
			JOIN captura AS c
			ON c.fkComponente = co.idComponente
			JOIN alerta AS a
			ON a.fkCaptura = c.idCaptura
			JOIN parametro AS p
			ON p.idParametro = a.fkParametro
			ORDER BY c.dtCaptura DESC;

	-- --------------- SELECT´S PÁGINA: ANÁLISE ESPECÍFICA ----------------------------------------------------------------
	-- Capturas Memória Ram
	SELECT co.nome AS componente, ROUND(ca.registro,2) AS registro, TIME(dtcaptura) AS horacaptura 
	FROM captura AS ca
	JOIN componente AS co
	ON co.idcomponente = ca.fkcomponente
	WHERE co.idcomponente = 1
	ORDER BY dtcaptura DESC
	LIMIT 7;

	-- Capturas Disco
	SELECT co.nome AS componente, ROUND(ca.registro,2) AS registro, TIME(dtcaptura) AS horacaptura 
	FROM captura AS ca
	JOIN componente AS co
	ON co.idcomponente = ca.fkcomponente
	WHERE co.idcomponente = 2
	ORDER BY dtcaptura DESC
	LIMIT 7;

	-- Capturas CPU (Processador)
	SELECT co.nome AS componente, ROUND(ca.registro,2) AS registro, TIME(dtcaptura) AS horacaptura 
	FROM captura AS ca
	JOIN componente AS co
	ON co.idcomponente = ca.fkcomponente
	WHERE co.idcomponente = 3
	ORDER BY dtcaptura DESC
	LIMIT 8;

	-- Capturas Upload
	SELECT co.nome AS componente, ROUND(ca.registro,2) AS registro, TIME(dtcaptura) AS horacaptura 
	FROM captura AS ca
	JOIN componente AS co
	ON co.idcomponente = ca.fkcomponente
	WHERE co.idcomponente = 4
	ORDER BY dtcaptura desc 
	LIMIT 6;

	-- Capturas Download
	SELECT co.nome AS componente, ROUND(ca.registro,2) AS registro, TIME(dtcaptura) AS horacaptura 
	FROM captura AS ca
	JOIN componente AS co
	ON co.idcomponente = ca.fkcomponente
	WHERE co.idcomponente = 5
	ORDER BY dtcaptura DESC 
	LIMIT 6;

	-- --------------- SELECT´S PÁGINA: PÁGINAS USUÁRIOS ----------------------------------------------------------------
	-- Quantidade de solicitações de entrada
	SELECT count(status) FROM Usuario
	WHERE status LIKE 'pendente';



	-- -------------- INSERT MAQUINA TESTE DESLIGAMENTO (MAQUINA DO FELIPE e do RYAN) ------------

	-- ryan
	INSERT INTO Maquina (fkSala, sistemaOperacional, marca, modelo, macaddress, status, estado, ip, username, senha)
	VALUES (1, 'windows', 'Lenovo', 'INSPIRON', 'A5:B6:C7:D8:E9:DD', 'Crítico', 'Ligada',
			'10.18.32.18', 'sshuser', 'urubu100');
			
			
			
			
			
	-- felipe
	INSERT INTO Maquina (fkSala, sistemaOperacional, marca, modelo, macaddress, status, estado, ip, username, senha)
	VALUES (1, 'windows', 'Dell', 'INSPIRON', 'A5:B6:C7:D8:E9:DD', 'Crítico', 'Ligada',
			'192.168.56.1', 'Felipe', 'euamoajulia2025');

	select * from maquina;
	select * from sala;


	SET FOREIGN_KEY_CHECKS = 0;
	TRUNCATE TABLE maquina;
	SET FOREIGN_KEY_CHECKS = 1;


	SET FOREIGN_KEY_CHECKS = 1;
	TRUNCATE TABLE maquina;
	SET FOREIGN_KEY_CHECKS = 0;

	truncate table maquina;


	alter table maquina add column 
	ip VARCHAR(45),
	add column username VARCHAR(45),
	add column senha varchar(45);

	show tables;
	select * from componente;
	select * from maquina;
	select * from sala;

SET FOREIGN_KEY_CHECKS = 0;
TRUNCATE TABLE maquina;
SET FOREIGN_KEY_CHECKS = 1;





	select * from usuario;
	select * from maquina;
	show tables;