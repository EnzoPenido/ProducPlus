import db from "../config/dataBase.js";
const ItemCompra = {
    async getAll() { const [rows] = await db.query("SELECT * FROM ItensCompra"); return rows; },
    async getByCompra(idCompra) { const [rows] = await db.query("SELECT * FROM ItensCompra WHERE idCompra = ?", [idCompra]); return rows; },
    async create({ idCompra, idProduto, quantidade, preco_momento }) { await db.query("INSERT INTO ItensCompra (idCompra, idProduto, quantidade, preco_momento) VALUES (?, ?, ?, ?)", [idCompra, idProduto, quantidade, preco_momento]); },
    async update(idCompra, idProduto, data) { const fields = []; const vals = []; if (data.quantidade !== undefined) { fields.push("quantidade = ?"); vals.push(data.quantidade); } if (data.preco_momento !== undefined) { fields.push("preco_momento = ?"); vals.push(data.preco_momento); } if (!fields.length) return; vals.push(idCompra, idProduto); await db.query(`UPDATE ItensCompra SET ${fields.join(", ")} WHERE idCompra = ? AND idProduto = ?`, vals); },
    async delete(idCompra, idProduto) { await db.query("DELETE FROM ItensCompra WHERE idCompra = ? AND idProduto = ?", [idCompra, idProduto]); }
};
export default ItemCompra;