import db from "../config/dataBase.js";
const Produto = {
    async getAll() { const [rows] = await db.query("SELECT * FROM Produto"); return rows; },
    async getById(id) { const [rows] = await db.query("SELECT * FROM Produto WHERE idProduto = ?", [id]); return rows[0]; },
    async getByCategoria(idCategoria) { const [rows] = await db.query("SELECT * FROM Produto WHERE idCategoria = ?", [idCategoria]); return rows; },
    async getBySeccao(secao) { const [rows] = await db.query("SELECT * FROM Produto WHERE secao = ?", [secao]); return rows; },
    async create(data) {
        // idCategoria is required by the DB schema. If frontend didn't provide one,
        // default to 1 (first category) so admin-created products still insert.
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
        ["cnpjFornecedor", "idCategoria", "nome", "descricao", "url_imagem", "preco_unitario", "quantidadeEstoque", "secao"].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); } });
        if (!fields.length) return;
        vals.push(id);
        await db.query(`UPDATE Produto SET ${fields.join(", ")} WHERE idProduto = ?`, vals);
    },
    async delete(id) { await db.query("DELETE FROM Produto WHERE idProduto = ?", [id]); },
    async changeStock(idProduto, delta) { await db.query("UPDATE Produto SET quantidadeEstoque = quantidadeEstoque + ? WHERE idProduto = ?", [delta, idProduto]); }
};
export default Produto;