import db from "../config/dataBase.js";
const Compra = {
    async getAll() { const [rows] = await db.query("SELECT * FROM Compra"); return rows; },
    async getById(id) { const [rows] = await db.query("SELECT * FROM Compra WHERE idCompra = ?", [id]); return rows[0]; },
    async create({ cnpjCliente, dataCompra, valorTotal, statusCompra }) { const [r] = await db.query("INSERT INTO Compra (cnpjCliente, dataCompra, valorTotal, statusCompra) VALUES (?, ?, ?, ?)", [cnpjCliente, dataCompra, valorTotal, statusCompra]); return r.insertId; },
    async update(id, data) {
        const fields = []; const vals = [];["cnpjCliente", "dataCompra", "valorTotal", "statusCompra"].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); } });
        if (!fields.length) return;
        vals.push(id);
        await db.query(`UPDATE Compra SET ${fields.join(", ")} WHERE idCompra = ?`, vals);
    },
    async delete(id) { await db.query("DELETE FROM Compra WHERE idCompra = ?", [id]); }
};
export default Compra;