import db from "../config/dataBase.js";

const Cliente = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Cliente");
        return rows;
    },

    async getByCnpj(cnpjCliente) {
        const [rows] = await db.query("SELECT * FROM Cliente WHERE cnpjCliente = ?", [cnpjCliente]);
        return rows[0];
    },

    async create({ cnpjCliente, nome, email, telefoneFixo, endereco }) {
        await db.query(
            `INSERT INTO Cliente (cnpjCliente, nome, email, telefoneFixo, endereco)
       VALUES (?, ?, ?, ?, ?)`,
            [cnpjCliente, nome, email, telefoneFixo, endereco]
        );
    },

    async update(cnpjCliente, { nome, email, telefoneFixo, endereco }) {
        await db.query(
            `UPDATE Cliente
       SET nome = ?, email = ?, telefoneFixo = ?, endereco = ?
       WHERE cnpjCliente = ?`,
            [nome, email, telefoneFixo, endereco, cnpjCliente]
        );
    },

    async delete(cnpjCliente) {
        await db.query("DELETE FROM Cliente WHERE cnpjCliente = ?", [cnpjCliente]);
    },
};

export default Cliente;