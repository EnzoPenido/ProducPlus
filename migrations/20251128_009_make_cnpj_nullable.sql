-- Migration: Alterar coluna cnpjFornecedor para permitir valores nulos
-- Data: 28 de novembro de 2025
-- Descrição: Esta migração altera a coluna cnpjFornecedor na tabela Produto para permitir valores nulos.

ALTER TABLE Produto MODIFY cnpjFornecedor VARCHAR(14) NULL;