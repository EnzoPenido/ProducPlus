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

    async create({ cnpjCliente, data, valorTotal }) {
        const [result] = await db.query(
            `INSERT INTO Compra (cnpjCliente, data, valorTotal)
       VALUES (?, ?, ?)`,
            [cnpjCliente, data, valorTotal]
        );
        return result.insertId; // retorna o ID da nova compra
    },

    async update(idCompra, { cnpjCliente, data, valorTotal }) {
        await db.query(
            `UPDATE Compra
       SET cnpjCliente = ?, data = ?, valorTotal = ?
       WHERE idCompra = ?`,
            [cnpjCliente, data, valorTotal, idCompra]
        );
    },

    async delete(idCompra) {
        await db.query("DELETE FROM Compra WHERE idCompra = ?", [idCompra]);
    },
};

export default Compra;