-- Migration: Adicionar colunas estoqueMinimo e estoqueCritico na tabela Produto
-- Data: 28 de novembro de 2025
-- Descrição: Esta migração adiciona as colunas estoqueMinimo e estoqueCritico na tabela Produto para melhor gerenciamento de inventário.

ALTER TABLE Produto ADD COLUMN estoqueMinimo INT DEFAULT 20;
ALTER TABLE Produto ADD COLUMN estoqueCritico INT DEFAULT 5;