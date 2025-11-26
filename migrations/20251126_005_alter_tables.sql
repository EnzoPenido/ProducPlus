-- Migration: Atualização das tabelas Cliente e Admin
-- Data: 26 de novembro de 2025
-- Descrição: Adiciona a coluna foto_perfil para armazenar o caminho da foto de perfil dos usuários

ALTER TABLE Cliente ADD COLUMN foto_perfil VARCHAR(255) DEFAULT NULL;
ALTER TABLE Admin ADD COLUMN foto_perfil VARCHAR(255) DEFAULT NULL;