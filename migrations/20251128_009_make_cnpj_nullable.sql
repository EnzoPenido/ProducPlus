-- Migration: Allow Produto.cnpjFornecedor to be NULL (admin-created products)
ALTER TABLE Produto MODIFY cnpjFornecedor VARCHAR(14) NULL;