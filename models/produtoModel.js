import db from "../config/dataBase.js";

const Produto = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Produto");
        return rows;
    },

    async getById(idProduto) {
        const [rows] = await db.query("SELECT * FROM Produto WHERE idProduto = ?", [idProduto]);
        return rows[0];
    },

    async create({ cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque }) {
        const [result] = await db.query(
            `INSERT INTO Produto (cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque]
        );
        return result.insertId;
    },

    async update(idProduto, { cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque }) {
        await db.query(
            `UPDATE Produto SET cnpjFornecedor = ?, idCategoria = ?, nome = ?, descricao = ?, url_imagem = ?, preco_unitario = ?, quantidadeEstoque = ?
       WHERE idProduto = ?`,
            [cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque, idProduto]
        );
    },

    async delete(idProduto) {
        await db.query("DELETE FROM Produto WHERE idProduto = ?", [idProduto]);
    },

    // método utilitário para atualizar estoque (incremento negativo para retirada)
    async changeStock(idProduto, delta) {
        await db.query("UPDATE Produto SET quantidadeEstoque = quantidadeEstoque + ? WHERE idProduto = ?", [delta, idProduto]);
    }
};

export default Produto;