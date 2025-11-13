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

    async create({ cnpjFornecedor, nome, categoria, precoUnitario, quantidadeEstoque }) {
        await db.query(
            `INSERT INTO Produto (cnpjFornecedor, nome, categoria, precoUnitario, quantidadeEstoque)
       VALUES (?, ?, ?, ?, ?)`,
            [cnpjFornecedor, nome, categoria, precoUnitario, quantidadeEstoque]
        );
    },

    async update(idProduto, { nome, categoria, precoUnitario, quantidadeEstoque }) {
        await db.query(
            `UPDATE Produto
       SET nome = ?, categoria = ?, precoUnitario = ?, quantidadeEstoque = ?
       WHERE idProduto = ?`,
            [nome, categoria, precoUnitario, quantidadeEstoque, idProduto]
        );
    },

    async delete(idProduto) {
        await db.query("DELETE FROM Produto WHERE idProduto = ?", [idProduto]);
    },
};

export default Produto;