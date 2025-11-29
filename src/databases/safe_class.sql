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

CREATE TABLE Escola (
	idEscola INT PRIMARY KEY AUTO_INCREMENT,
    idSlack VARCHAR(45),
    fkEndereco INT,
    nome VARCHAR(45),
    email VARCHAR(45),
	telefone CHAR(11),
    codigoInep VARCHAR(45),
    FOREIGN KEY (fkEndereco)
    REFERENCES Endereco(idEndereco)
);

CREATE TABLE CodigoAtivacao (
	idCodigo INT PRIMARY KEY AUTO_INCREMENT,
    fkEscola INT,
    codigo VARCHAR(45),
    validade DATE,
    qtdUsos INT,
    FOREIGN KEY (fkEscola)
    REFERENCES Escola(idEscola)
);

CREATE TABLE Sala (
	idSala INT PRIMARY KEY AUTO_INCREMENT,
    fkEscola INT,
    nome VARCHAR(45),
    localizacao VARCHAR(45),
    FOREIGN KEY (fkEscola)
    REFERENCES Escola(idEscola)
);

CREATE TABLE Cargo (
	idCargo INT PRIMARY KEY AUTO_INCREMENT, 
	nome VARCHAR(45),
    permissao VARCHAR(100)
);

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
	last_login DATETIME,
    online BOOLEAN,
    PRIMARY KEY (idUsuario),
    FOREIGN KEY (fkCargo)
    REFERENCES Cargo(idCargo),
    FOREIGN KEY (fkEscola)
    REFERENCES Escola(idEscola),
    FOREIGN KEY (fkGestor) REFERENCES Usuario(idUsuario)
);

CREATE TABLE logins (
    id INT AUTO_INCREMENT PRIMARY KEY,
    idUsuario INT,
    dataHoraLogin DATETIME,
    FOREIGN KEY (idUsuario) REFERENCES usuario(idUsuario)
);

CREATE TABLE Maquina (
	idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    fkSala INT,
    ip VARCHAR(45),
    username VARCHAR(45),
    senha VARCHAR(45),
    sistemaOperacional VARCHAR(45),
    marca VARCHAR(45),
    macaddress VARCHAR(45),
    status VARCHAR(45),
    estado VARCHAR(45),
    FOREIGN KEY (fkSala)
    REFERENCES Sala(idSala)
);

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

CREATE TABLE Alerta (
	idAlerta INT AUTO_INCREMENT,
    fkParametro INT,
    fkCaptura INT,
    mensagem VARCHAR(80),
    enviado TINYINT(1),
    PRIMARY KEY (idAlerta, fkParametro),
    FOREIGN KEY (fkParametro)
    REFERENCES Parametro(idParametro),
    FOREIGN KEY (fkCaptura)
    REFERENCES Captura(idCaptura)
);

-- -----------------------INSERTS TABELAS -----------------------------------------------------------------------
INSERT INTO Endereco (logradouro, numero, cidade, bairro, uf) values
("Avenida Paulista", 290, "São Paulo", "Bela vista", "SP");

INSERT INTO Escola (idEscola, idSlack, fkEndereco, nome, email, telefone, codigoInep) VALUES
(default, "C09TJE2LB4P", 1, 'Escola Joaquim 3°', 'joaquimterceiro@gmail.com', '11910877887', 'ebsdiw');

INSERT INTO CodigoAtivacao (fkEscola, codigo, validade, qtdUsos) VALUES 
(1, "00j12", "2025-09-11", 10);

INSERT INTO Sala (nome, fkEscola, localizacao) VALUES
("Sala 1", 1, "2° andar, lado esquerdo"),
("Sala 2", 1, "1° andar, lado direito"),
("Sala 3", 1, "2° andar, lado direito"),
("Sala 4", 1, "1° andar, lado esquerdo"),
("Sala 5", 1, "2° andar, lado direito"),
("Sala 6", 1, "1° andar, lado esquerdo");

INSERT INTO Cargo (nome, permissao) VALUES
("Gestor", "Visualizar métricas, visualizar/editar/remover/inserir usuários e máquinas"),
("Técnico de T.I", "Visualizar métricas, visualizar/editar/remover/inserir máquinas"),
("Professor", "Visualizar métricas");

INSERT INTO Usuario (fkCargo, fkEscola, nome, email, senha, dtCadastro, status) VALUES 
(1, 1, "Rosa Campos", "rosacampos@gmail.com", "urubu100", "2025-09-10", "ativo"),
(2, 1, "Alberto Silva", "albertosilva@gmail.com", "urubu100", "2025-09-10", "ativo"),
(2, 1, "Ryan Patric", "ryanpatric@gmail.com", "urubu100", "2025-09-10", "ativo"),
(2, 1, "Marcia Lima", "marcialima@gmail.com", "urubu100", "2025-09-10", "ativo"),
(2, 1, "Beatriz Carvalho", "beatrizcarvalho@gmail.com", "urubu100", "2025-09-10", "ativo");

INSERT INTO Maquina (fkSala, ip, username, senha, sistemaOperacional, marca, macaddress, status, estado) VALUES
(1, '192.168.1.10', 'user01', 'pass01', 'Windows', 'Dell', 'A1:B2:C3:D4:E5:01', 'Estável', 'Ligada'),
(1, '192.168.1.11', 'user02', 'pass02', 'Linux', 'HP', 'A1:B2:C3:D4:E5:02', 'Estável', 'Ligada'),
(1, '192.168.1.12', 'user03', 'pass03', 'Windows', 'Lenovo', 'A1:B2:C3:D4:E5:03', 'Estável', 'Ligada'),
(1, '192.168.1.13', 'user04', 'pass04', 'Linux', 'Acer', 'A1:B2:C3:D4:E5:04', 'Estável', 'Ligada'),
(1, '192.168.1.14', 'user05', 'pass05', 'Windows', 'Asus', 'A1:B2:C3:D4:E5:05', 'Estável', 'Ligada'),
(1, '192.168.1.15', 'user06', 'pass06', 'Linux', 'Dell', 'A1:B2:C3:D4:E5:06', 'Estável', 'Ligada'),
(1, '192.168.1.16', 'user07', 'pass07', 'Windows', 'HP', 'A1:B2:C3:D4:E5:07', 'Estável', 'Ligada'),
(1, '192.168.1.17', 'user08', 'pass08', 'Linux', 'Lenovo', 'A1:B2:C3:D4:E5:08', 'Estável', 'Ligada'),
(2, '192.168.2.10', 'user09', 'pass09', 'Windows', 'Dell', 'A2:B3:C4:D5:E6:01', 'Estável', 'Ligada'),
(2, '192.168.2.11', 'user10', 'pass10', 'Linux', 'HP', 'A2:B3:C4:D5:E6:02', 'Estável', 'Ligada'),
(2, '192.168.2.12', 'user11', 'pass11', 'Windows', 'Lenovo', 'A2:B3:C4:D5:E6:03', 'Estável', 'Ligada'),
(2, '192.168.2.13', 'user12', 'pass12', 'Linux', 'Acer', 'A2:B3:C4:D5:E6:04', 'Estável', 'Ligada'),
(2, '192.168.2.14', 'user13', 'pass13', 'Windows', 'Asus', 'A2:B3:C4:D5:E6:05', 'Estável', 'Ligada'),
(2, '192.168.2.15', 'user14', 'pass14', 'Linux', 'Dell', 'A2:B3:C4:D5:E6:06', 'Estável', 'Ligada'),
(2, '192.168.2.16', 'user15', 'pass15', 'Windows', 'HP', 'A2:B3:C4:D5:E6:07', 'Estável', 'Ligada'),
(2, '192.168.2.17', 'user16', 'pass16', 'Linux', 'Lenovo', 'A2:B3:C4:D5:E6:08', 'Estável', 'Ligada'),
(3, '192.168.3.10', 'user17', 'pass17', 'Windows', 'Acer', 'A3:B4:C5:D6:E7:01', 'Estável', 'Ligada'),
(3, '192.168.3.11', 'user18', 'pass18', 'Linux', 'Asus', 'A3:B4:C5:D6:E7:02', 'Estável', 'Ligada'),
(3, '192.168.3.12', 'user19', 'pass19', 'Windows', 'Dell', 'A3:B4:C5:D6:E7:03', 'Estável', 'Ligada'),
(3, '192.168.3.13', 'user20', 'pass20', 'Linux', 'HP', 'A3:B4:C5:D6:E7:04', 'Estável', 'Ligada'),
(3, '192.168.3.14', 'user21', 'pass21', 'Windows', 'Lenovo', 'A3:B4:C5:D6:E7:05', 'Estável', 'Ligada'),
(3, '192.168.3.15', 'user22', 'pass22', 'Linux', 'Acer', 'A3:B4:C5:D6:E7:06', 'Estável', 'Ligada'),
(3, '192.168.3.16', 'user23', 'pass23', 'Windows', 'Asus', 'A3:B4:C5:D6:E7:07', 'Estável', 'Ligada'),
(3, '192.168.3.17', 'user24', 'pass24', 'Linux', 'Dell', 'A3:B4:C5:D6:E7:08', 'Estável', 'Ligada'),
(4, '192.168.4.10', 'user25', 'pass25', 'Windows', 'HP', 'A4:B5:C6:D7:E8:01', 'Estável', 'Ligada'),
(4, '192.168.4.11', 'user26', 'pass26', 'Linux', 'Lenovo', 'A4:B5:C6:D7:E8:02', 'Estável', 'Ligada'),
(4, '192.168.4.12', 'user27', 'pass27', 'Windows', 'Acer', 'A4:B5:C6:D7:E8:03', 'Estável', 'Ligada'),
(4, '192.168.4.13', 'user28', 'pass28', 'Linux', 'Asus', 'A4:B5:C6:D7:E8:04', 'Estável', 'Ligada'),
(4, '192.168.4.14', 'user29', 'pass29', 'Windows', 'Dell', 'A4:B5:C6:D7:E8:05', 'Estável', 'Ligada'),
(4, '192.168.4.15', 'user30', 'pass30', 'Linux', 'HP', 'A4:B5:C6:D7:E8:06', 'Estável', 'Ligada'),
(4, '192.168.4.16', 'user31', 'pass31', 'Windows', 'Lenovo', 'A4:B5:C6:D7:E8:07', 'Estável', 'Ligada'),
(4, '192.168.4.17', 'user32', 'pass32', 'Linux', 'Acer', 'A4:B5:C6:D7:E8:08', 'Estável', 'Ligada'),
(5, '192.168.5.10', 'user33', 'pass33', 'Windows', 'Dell', 'A5:B6:C7:D8:E9:01', 'Estável', 'Ligada'),
(5, '192.168.5.11', 'user34', 'pass34', 'Linux', 'HP', 'A5:B6:C7:D8:E9:02', 'Estável', 'Ligada'),
(5, '192.168.5.12', 'user35', 'pass35', 'Windows', 'Lenovo', 'A5:B6:C7:D8:E9:03', 'Estável', 'Ligada'),
(5, '192.168.5.13', 'user36', 'pass36', 'Linux', 'Acer', 'A5:B6:C7:D8:E9:04', 'Estável', 'Ligada'),
(5, '192.168.5.14', 'user37', 'pass37', 'Windows', 'Asus', 'A5:B6:C7:D8:E9:05', 'Estável', 'Ligada'),
(5, '192.168.5.15', 'user38', 'pass38', 'Linux', 'Dell', 'A5:B6:C7:D8:E9:06', 'Estável', 'Ligada'),
(5, '192.168.5.16', 'user39', 'pass39', 'Windows', 'HP', 'A5:B6:C7:D8:E9:07', 'Estável', 'Ligada'),
(5, '192.168.5.17', 'user40', 'pass40', 'Linux', 'Lenovo', 'A5:B6:C7:D8:E9:08', 'Estável', 'Ligada'),
(6, '192.168.6.10', 'user41', 'pass41', 'Windows', 'Acer', 'A6:B7:C8:D9:E0:01', 'Estável', 'Ligada'),
(6, '192.168.6.11', 'user42', 'pass42', 'Linux', 'Asus', 'A6:B7:C8:D9:E0:02', 'Estável', 'Ligada'),
(6, '192.168.6.12', 'user43', 'pass43', 'Windows', 'Dell', 'A6:B7:C8:D9:E0:03', 'Estável', 'Ligada'),
(6, '192.168.6.13', 'user44', 'pass44', 'Linux', 'HP', 'A6:B7:C8:D9:E0:04', 'Estável', 'Ligada'),
(6, '192.168.6.14', 'user45', 'pass45', 'Windows', 'Lenovo', 'A6:B7:C8:D9:E0:05', 'Estável', 'Ligada'),
(6, '192.168.6.15', 'user46', 'pass46', 'Linux', 'Acer', 'A6:B7:C8:D9:E0:06', 'Estável', 'Ligada'),
(6, '192.168.6.16', 'user47', 'pass47', 'Windows', 'Asus', 'A6:B7:C8:D9:E0:07', 'Estável', 'Ligada'),
(6, '192.168.6.17', 'user48', 'pass48', 'Linux', 'Dell', 'A6:B7:C8:D9:E0:08', 'Estável', 'Ligada');

INSERT INTO Componente (idComponente, fkMaquina, nome, formatacao, capacidade) VALUES 
(default, 1, 'RAM', 'gb', '16GB DDR4'), 
(default, 1, 'Disco', 'gb', '1TB'),
(default, 1, 'CPU', '%', 'Intel i7'),
(default, 1, 'Upload', 'Mbps', '1000 Mbps'),
(default, 1, 'Download', 'Mbps', '1000 Mbps'),
(default, 1, 'Ping', 'Ms', ''),
(default, 2, 'RAM', 'gb', '16GB DDR4'), 
(default, 2, 'Disco', 'gb', '1TB'),
(default, 2, 'CPU', '%', 'Intel i7'),
(default, 2, 'Upload', 'Mbps', '1000 Mbps'),
(default, 2, 'Download', 'Mbps', '1000 Mbps'),
(default, 2, 'Ping', 'Ms', ''),
(default, 3, 'RAM', 'gb', '16GB DDR4'), 
(default, 3, 'Disco', 'gb', '1TB'),
(default, 3, 'CPU', '%', 'Intel i7'),
(default, 3, 'Upload', 'Mbps', '1000 Mbps'),
(default, 3, 'Download', 'Mbps', '1000 Mbps'),
(default, 3, 'Ping', 'Ms', ''),
(default, 4, 'RAM', 'gb', '16GB DDR4'), 
(default, 4, 'Disco', 'gb', '1TB'),
(default, 4, 'CPU', '%', 'Intel i7'),
(default, 4, 'Upload', 'Mbps', '1000 Mbps'),
(default, 4, 'Download', 'Mbps', '1000 Mbps'),
(default, 4, 'Ping', 'Ms', '');

INSERT INTO Parametro VALUES
(default, 1, "Crítico", 14.2, 16),
(default, 1, "Atenção", 12, 14.1),
(default, 2, "Crítico", 421, 500),
(default, 2, "Atenção", 351, 420),
(default, 3, "Crítico", 85, 100),
(default, 3, "Atenção", 70, 84),
(default, 4, "Crítico", 10.0, 0.0),
(default, 4, "Atenção", 20.0, 10.01),
(default, 5, "Crítico", 30.0, 0.0),
(default, 5, "Atenção", 65.0, 30.01);

INSERT INTO Parametro VALUES
(default, 7, "Crítico", 14.2, 16),
(default, 7, "Atenção", 12, 14.1),
(default, 8, "Crítico", 421, 500),
(default, 8, "Atenção", 351, 420),
(default, 9, "Crítico", 85, 100),
(default, 9, "Atenção", 70, 84),
(default, 10, "Crítico", 10.0, 0.0),
(default, 10, "Atenção", 20.0, 10.01),
(default, 11, "Crítico", 30.0, 0.0),
(default, 11, "Atenção", 65.0, 30.01);

INSERT INTO Parametro VALUES
(default, 13, "Crítico", 14.2, 16),
(default, 13, "Atenção", 12, 14.1),
(default, 14, "Crítico", 421, 500),
(default, 14, "Atenção", 351, 420),
(default, 15, "Crítico", 85, 100),
(default, 15, "Atenção", 70, 84),
(default, 16, "Crítico", 10.0, 0.0),
(default, 16, "Atenção", 20.0, 10.01),
(default, 17, "Crítico", 30.0, 0.0),
(default, 17, "Atenção", 65.0, 30.01);

INSERT INTO Parametro VALUES
(default, 19, "Crítico", 14.2, 16), 
(default, 19, "Atenção", 12, 14.1),
(default, 20, "Crítico", 421, 500),
(default, 20, "Atenção", 351, 420),
(default, 21, "Crítico", 85, 100), 
(default, 21, "Atenção", 70, 84),
(default, 22, "Crítico", 10.0, 0.0),  
(default, 22, "Atenção", 20.0, 10.01),
(default, 23, "Crítico", 30.0, 0.0), 
(default, 23, "Atenção", 65.0, 30.01);

-- ------- INSERTS NECESSÁRIOS DASH INDIVIDUAL: RYAN -----------------------
-- Segunda
INSERT INTO Captura (fkComponente, registro, dtCaptura) VALUES
(6, 800, '2025-11-24 10:00:00'),
(6, 800, '2025-11-24 12:00:00'),
(6, 800, '2025-11-24 13:00:00'),
(6, 800, '2025-11-24 14:00:00'),
(6, 800, '2025-11-24 15:00:00'),
(6, 800, '2025-11-24 16:00:00');

-- Terça Feira
INSERT INTO Captura (fkComponente, registro, dtCaptura) VALUES
(6, 800, '2025-11-25 10:00:00'),
(6, 800, '2025-11-25 12:00:00'),
(6, 800, '2025-11-25 13:00:00'),
(6, 800, '2025-11-25 14:00:00'),
(6, 800, '2025-11-25 15:00:00'),
(6, 800, '2025-11-25 16:00:00'),
(6, 800, '2025-11-25 17:00:00'),
(6, 800, '2025-11-25 18:00:00'),
(6, 800, '2025-11-25 19:00:00'),
(6, 800, '2025-11-25 20:00:00');

-- Quarta Feira
INSERT INTO Captura (fkComponente, registro, dtCaptura) VALUES
(6, 800, '2025-11-26 10:00:00'),
(6, 800, '2025-11-26 12:00:00'),
(6, 800, '2025-11-26 13:00:00'),
(6, 800, '2025-11-26 14:00:00');

-- Quinta Feira
INSERT INTO Captura (fkComponente, registro, dtCaptura) VALUES
(6, 800, '2025-11-27 10:00:00'),
(6, 800, '2025-11-27 12:00:00'),
(6, 800, '2025-11-27 14:00:00');

-- Sexta Feira
INSERT INTO Captura (fkComponente, registro, dtCaptura) VALUES
(6, 800, '2025-11-28 10:00:00'),
(6, 800, '2025-11-28 12:00:00'),
(6, 800, '2025-11-28 14:00:00'),
(6, 800, '2025-11-28 15:00:00'),
(6, 800, '2025-11-28 16:00:00'),
(6, 800, '2025-11-28 17:00:00'),
(6, 800, '2025-11-28 18:00:00');
