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

    async create({ idCompra, idProduto, quantidade, preco_momento }) {
        await db.query(
            `INSERT INTO ItensCompra (idCompra, idProduto, quantidade, preco_momento)
       VALUES (?, ?, ?, ?)`,
            [idCompra, idProduto, quantidade, preco_momento]
        );
    },

    async update(idCompra, idProduto, { quantidade, preco_momento }) {
        await db.query(
            `UPDATE ItensCompra SET quantidade = ?, preco_momento = ? WHERE idCompra = ? AND idProduto = ?`,
            [quantidade, preco_momento, idCompra, idProduto]
        );
    },

    async delete(idCompra, idProduto) {
        await db.query("DELETE FROM ItensCompra WHERE idCompra = ? AND idProduto = ?", [idCompra, idProduto]);
    }
};

export default ItemCompra;