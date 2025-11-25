-- Migration: Criação da tabela descricaoProduto
-- Data: 25 de novembro de 2025
-- Descrição: Criação das tabela descricaoProduto para que haja descrições na página product.html

create table if not exists descricaoProduto (
    idProduto int not null, 
    comprimento decimal(10,2),
    largura decimal(10,2),
    altura decimal(10,2),
    peso decimal(10,3),
    composicao varchar(255),
    acabamento varchar(255),
    resistencia varchar(255),
    potencia varchar(100),
    voltagem varchar(50),
    frequencia varchar(50),
    normaISO varchar(100),
    garantia varchar(100),
    aprovacao varchar(255),

	primary key (idProduto),
    foreign key (idProduto) references Produto(idProduto) on delete cascade -- Se apagar o produto, apaga a descrição junto
);