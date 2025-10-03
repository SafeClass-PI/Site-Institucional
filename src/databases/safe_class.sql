-- CREATE DATABASE safeclass;
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

CREATE TABLE TipoUsuario (
      idTipo INT PRIMARY KEY AUTO_INCREMENT, 
    tipo VARCHAR(45),
    permissao VARCHAR(100)
);

INSERT INTO TipoUsuario (tipo, permissao) VALUES
("Administrador", "Ler, escrever, executar e gerenciar usuários e permissões");

CREATE TABLE Usuario (
      idUsuario INT AUTO_INCREMENT,
    fkTipo INT,
    fkEscola INT,
    nome VARCHAR(45),
    email VARCHAR(45),
    senha VARCHAR(45),
    PRIMARY KEY (idUsuario, fkTipo),
    FOREIGN KEY (fkTipo)
    REFERENCES TipoUsuario(idTipo),
    FOREIGN KEY (fkEscola)
    REFERENCES Escola(idEscola)
);

INSERT INTO Usuario (fkTipo, fkEscola, nome, email, senha) VALUES 
(1, 1, "Ryan Patric", "ryanpina@gmail.com", "urubu100");

CREATE TABLE Maquina (
      idMaquina INT PRIMARY KEY AUTO_INCREMENT,
    fkEscola INT,
    sistemaOperacional VARCHAR(45),
    marca VARCHAR(45),
    modelo VARCHAR(45),
    hostname VARCHAR(45),
    FOREIGN KEY (fkEscola)
    REFERENCES Escola(idEscola)
);

Insert into Maquina (fkEscola, sistemaOperacional, marca, modelo, hostname) values
(1, "Linux", "Dell", "Inspiron 15", "ryanpina");

CREATE TABLE Componente (
      idComponente INT auto_increment,
    fkMaquina INT,
    nome VARCHAR(45),
    tipo VARCHAR(45),
    capacidade VARCHAR(45),
    PRIMARY KEY (idComponente, fkMaquina),
    FOREIGN KEY (fkMaquina)
    REFERENCES Maquina(idMaquina)
);

INSERT INTO Componente (idComponente, fkMaquina, nome, tipo, capacidade) VALUES 
(default, 1, 'Memória RAM', 'Hardware', '16GB DDR4'), 
(default, 1, 'Disco Rígido', 'Hardware', '1TB'),
(default, 1, 'Processador', 'Hardware', 'Intel i7');

CREATE TABLE Captura (
    idCaptura INT AUTO_INCREMENT,
      fkComponente INT,
    gbLivre FLOAT,
    gbEmUso FLOAT,
    porcentagemDeUso FLOAT,
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
    status VARCHAR(45),
    dtEmissao TIMESTAMP,
    PRIMARY KEY (idAlerta, fkParametro),
    FOREIGN KEY (fkParametro)
    REFERENCES Parametro(idParametro),
    FOREIGN KEY (fkCaptura)
    REFERENCES Captura(idCaptura)
);

select * from componente;