import db from "../config/dataBase.js";

const Compra = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Compra");
        return rows;
    },

    async getById(idCompra) {
        const [rows] = await db.query("SELECT * FROM Compra WHERE idCompra = ?", [idCompra]);
        return rows[0];
    },

    async create({ cnpjCliente, dataCompra, valorTotal, statusCompra }) {
        const [result] = await db.query(
            `INSERT INTO Compra (cnpjCliente, dataCompra, valorTotal, statusCompra)
       VALUES (?, ?, ?, ?)`,
            [cnpjCliente, dataCompra, valorTotal, statusCompra]
        );
        return result.insertId;
    },

    async update(idCompra, { cnpjCliente, dataCompra, valorTotal, statusCompra }) {
        await db.query(
            `UPDATE Compra SET cnpjCliente = ?, dataCompra = ?, valorTotal = ?, statusCompra = ? WHERE idCompra = ?`,
            [cnpjCliente, dataCompra, valorTotal, statusCompra, idCompra]
        );
    },

    async delete(idCompra) {
        await db.query("DELETE FROM Compra WHERE idCompra = ?", [idCompra]);
    }
};

export default Compra;