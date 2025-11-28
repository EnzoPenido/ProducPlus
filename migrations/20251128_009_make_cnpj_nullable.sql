-- Migration: Alterar coluna cnpjFornecedor para permitir valores nulos e produto adicionar coluna secao
-- Data: 28 de novembro de 2025
-- Descrição: Esta migração altera a coluna cnpjFornecedor na tabela Produto para permitir valores nulos e adiciona uma nova coluna secao na tabela de produtos.

ALTER TABLE Produto MODIFY cnpjFornecedor VARCHAR(14) NULL;
ALTER TABLE Produto ADD secao VARCHAR(255) NULL;