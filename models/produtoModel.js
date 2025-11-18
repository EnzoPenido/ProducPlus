import db from "../config/dataBase.js";
const Produto = {
    async getAll() { const [rows] = await db.query("SELECT * FROM Produto"); return rows; },
    async getById(id) { const [rows] = await db.query("SELECT * FROM Produto WHERE idProduto = ?", [id]); return rows[0]; },
    async create(data) {
        const [r] = await db.query(
            `INSERT INTO Produto (cnpjFornecedor, idCategoria, nome, descricao, url_imagem, preco_unitario, quantidadeEstoque)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [data.cnpjFornecedor, data.idCategoria, data.nome, data.descricao, data.url_imagem, data.preco_unitario, data.quantidadeEstoque]
        ); return r.insertId;
    },
    async update(id, data) {
        const fields = []; const vals = [];
        ["cnpjFornecedor", "idCategoria", "nome", "descricao", "url_imagem", "preco_unitario", "quantidadeEstoque"].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); } });
        if (!fields.length) return;
        vals.push(id);
        await db.query(`UPDATE Produto SET ${fields.join(", ")} WHERE idProduto = ?`, vals);
    },
    async delete(id) { await db.query("DELETE FROM Produto WHERE idProduto = ?", [id]); },
    async changeStock(idProduto, delta) { await db.query("UPDATE Produto SET quantidadeEstoque = quantidadeEstoque + ? WHERE idProduto = ?", [delta, idProduto]); }
};
export default Produto;