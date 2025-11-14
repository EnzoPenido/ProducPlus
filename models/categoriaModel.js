import db from "../config/dataBase.js";

const Categoria = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Categoria");
        return rows;
    },

    async getById(idCategoria) {
        const [rows] = await db.query("SELECT * FROM Categoria WHERE idCategoria = ?", [idCategoria]);
        return rows[0];
    },

    async create({ nome }) {
        const [result] = await db.query("INSERT INTO Categoria (nome) VALUES (?)", [nome]);
        return result.insertId;
    },

    async update(idCategoria, { nome }) {
        await db.query("UPDATE Categoria SET nome = ? WHERE idCategoria = ?", [nome, idCategoria]);
    },

    async delete(idCategoria) {
        await db.query("DELETE FROM Categoria WHERE idCategoria = ?", [idCategoria]);
    }
};

export default Categoria;