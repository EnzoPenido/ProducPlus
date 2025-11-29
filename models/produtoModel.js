import db from "../config/dataBase.js";

const Produto = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Produto");
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query("SELECT * FROM Produto WHERE idProduto = ?", [id]);
        return rows[0];
    },

    async getByCategoria(idCategoria) {
        const [rows] = await db.query("SELECT * FROM Produto WHERE idCategoria = ?", [idCategoria]);
        return rows;
    },

    async getBySeccao(secao) {
        const [rows] = await db.query("SELECT * FROM Produto WHERE secao = ?", [secao]);
        return rows;
    },

    async create(data) {
        const idCategoria = (data.idCategoria !== undefined && data.idCategoria !== null) ? data.idCategoria : 1;
        const [r] = await db.query(
            `INSERT INTO Produto (cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque, secao)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
            [data.cnpjFornecedor || null, idCategoria, data.nome, data.descricao, data.url_imagem || null, data.preco_unitario, data.quantidadeEstoque, data.secao]
        );
        return r.insertId;
    },

    async update(id, data) {
        const fields = []; const vals = [];
        ["cnpjFornecedor", "idCategoria", "nome", "descricao", "url_imagem", "preco_unitario", "quantidadeEstoque", "secao", "estoqueMinimo", "estoqueCritico"].forEach(k => {
            if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); }
        });
        if (!fields.length) return;
        vals.push(id);
        await db.query(`UPDATE Produto SET ${fields.join(", ")} WHERE idProduto = ?`, vals);
    },

    async delete(id) {
        await db.query("DELETE FROM Produto WHERE idProduto = ?", [id]);
    },

    // --- DAR BAIXA NO ESTOQUE ---
    async baixarEstoque(itensCarrinho) {
        for (const item of itensCarrinho) {
            await db.query(
                "UPDATE Produto SET quantidadeEstoque = quantidadeEstoque - ? WHERE idProduto = ?",
                [item.quantity, item.id]
            );
        }
    },
    async atualizarEstoque(id, novaQuantidade) {
        await db.query(
            "UPDATE Produto SET quantidadeEstoque = ? WHERE idProduto = ?",
            [novaQuantidade, id]
        );
    },
    async update(id, data) {
        const fields = []; const vals = [];
        ["cnpjFornecedor", "idCategoria", "nome", "descricao", "url_imagem", "preco_unitario", "quantidadeEstoque", "secao", "estoqueMinimo", "estoqueCritico"].forEach(k => {
            if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); }
        });
        if (!fields.length) return;
        vals.push(id);
        await db.query(`UPDATE Produto SET ${fields.join(", ")} WHERE idProduto = ?`, vals);
    }
};

export default Produto;