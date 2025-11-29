import db from "../config/dataBase.js";

const Compra = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Compra");
        return rows;
    },

    async getByCliente(cnpj) {
        const [rows] = await db.query(
            "SELECT * FROM Compra WHERE cnpjCliente = ? ORDER BY dataCompra DESC",
            [cnpj]
        );
        return rows;
    },

    async getById(id) {
        const [rows] = await db.query("SELECT * FROM Compra WHERE idCompra = ?", [id]);
        return rows[0];
    },

    async delete(id) { await db.query("DELETE FROM Compra WHERE idCompra = ?", [id]); }
};

export default Compra;