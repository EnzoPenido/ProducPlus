import db from "../config/dataBase.js";
const Categoria = {
    async getAll() { const [rows] = await db.query("SELECT * FROM Categoria"); return rows; },
    async getById(id) { const [rows] = await db.query("SELECT * FROM Categoria WHERE idCategoria = ?", [id]); return rows[0]; },
    async create({ nome }) { const [r] = await db.query("INSERT INTO Categoria (nome) VALUES (?)", [nome]); return r.insertId; },
    async update(id, { nome }) { await db.query("UPDATE Categoria SET nome=? WHERE idCategoria=?", [nome, id]); },
    async delete(id) { await db.query("DELETE FROM Categoria WHERE idCategoria = ?", [id]); },
    async getProductsByCategory(id) { return await db.query("SELECT idProduto, nome, preco_unitario FROM Produto WHERE idCategoria = ?", [id]); },
    async deleteProductsByCategory(id) { await db.query("DELETE FROM Produto WHERE idCategoria = ?", [id]); }
};
export default Categoria;