-- Migration: Criar tabelas Cliente, Fornecedor, Categoria, Produto, Compra e ItensCompra
-- Data: 13 de novembro de 2025
-- Descrição: Criação das tabelas para o sistema ProducPlus

-- Observação: As tabelas precisam ser criadas nessa ordem para respeitar suas propriedades de chave primária e estrangeira

-- Criação da tabela 'Cliente'

create table Cliente(
    cnpjCliente varchar(14) not null,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    senha varchar(255) not null,
    telefone varchar(15) not null,
    endereco varchar(255) not null,
    
    primary key(cnpjCliente)
);

-- Criação da tabela 'Fornecedor'

create table Fornecedor(
    cnpjFornecedor varchar(14) not null,
    nome varchar(255) not null,
    email varchar(255) not null unique,
    telefone varchar(15) not null,
    endereco varchar(255) not null,
    
    primary key(cnpjFornecedor)
);

-- Criação da tabela 'Categoria'

create table Categoria(
	idCategoria int not null auto_increment,
    nome varchar(255) not null,
    
    primary key(idCategoria)
);

-- Criação da tabela 'Produto'

create table Produto(
    idProduto int not null auto_increment,
    cnpjFornecedor varchar(14) not null,
    idCategoria int not null,
    nome varchar(255) not null,
    descricao text,
    url_imagem varchar(255),
    preco_unitario decimal(10,2) not null,
    quantidadeEstoque int not null,
    
    primary key(idProduto),
    foreign key(cnpjFornecedor) references Fornecedor(cnpjFornecedor),
    foreign key(idCategoria) references Categoria(idCategoria)
);

-- Criação da tabela 'Compra'

create table Compra(
    idCompra int not null auto_increment,
    cnpjCliente varchar(14) not null,
    dataCompra datetime default current_timestamp,
    valorTotal decimal(10,2) not null,
    statusCompra varchar(20) default 'AGUARDANDO',
    
    primary key(idCompra),
    foreign key(cnpjCliente) references Cliente(cnpjCliente)
);

-- Criação da tabela 'ItensCompra'

create table ItensCompra(
    idCompra int not null,
    idProduto int not null,
    quantidade int not null,
    preco_momento decimal(10,2) not null,
    
    primary key(idCompra, idProduto),
    foreign key(idCompra) references Compra(idCompra),
    foreign key(idProduto) references Produto(idProduto)
);