import db from "../config/dataBase.js";

const ItemCompra = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM ItensCompra");
        return rows;
    },

    async getByCompra(idCompra) {
        const [rows] = await db.query("SELECT * FROM ItensCompra WHERE idCompra = ?", [idCompra]);
        return rows;
    },

    async create({ idCompra, idProduto, quantidade }) {
        await db.query(
            `INSERT INTO ItensCompra (idCompra, idProduto, quantidade)
       VALUES (?, ?, ?)`,
            [idCompra, idProduto, quantidade]
        );
    },

    async update(idCompra, idProduto, quantidade) {
        await db.query(
            `UPDATE ItensCompra
       SET quantidade = ?
       WHERE idCompra = ? AND idProduto = ?`,
            [quantidade, idCompra, idProduto]
        );
    },

    async delete(idCompra, idProduto) {
        await db.query("DELETE FROM ItensCompra WHERE idCompra = ? AND idProduto = ?", [
            idCompra,
            idProduto,
        ]);
    },
};

export default ItemCompra;