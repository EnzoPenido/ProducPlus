-- Migration: Criação da tabela Admin
-- Data: 18 de novembro de 2025
-- Descrição: Criação das tabela Admin para o sistema ProducPlus

create table if not exists Admin(
  idAdmin int not null auto_increment primary key,
  username varchar(100) not null unique,
  nome varchar(255),
  email varchar(255) unique,
  senha varchar(255) not null
);