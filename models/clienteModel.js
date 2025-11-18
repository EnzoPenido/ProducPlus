import db from "../config/dataBase.js";

const Cliente = {
    async getAll() {
        const [rows] = await db.query("SELECT cnpjCliente, nome, email, telefone, endereco FROM Cliente");
        return rows;
    },

    async getByCnpj(cnpjCliente) {
        const [rows] = await db.query("SELECT * FROM Cliente WHERE cnpjCliente = ?", [cnpjCliente]);
        return rows[0];
    },

    async create({ cnpjCliente, nome, email, senha, telefone, endereco }) {
        await db.query(
            `INSERT INTO Cliente (cnpjCliente, nome, email, senha, telefone, endereco)
       VALUES (?, ?, ?, ?, ?, ?)`,
            [cnpjCliente, nome, email, senha, telefone, endereco]
        );
    },

    async update(cnpjCliente, data) {
        const fields = [];
        const vals = [];
        ["nome", "email", "senha", "telefone", "endereco"].forEach(k => {
            if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); }
        });
        if (!fields.length) return;
        vals.push(cnpjCliente);
        await db.query(`UPDATE Cliente SET ${fields.join(", ")} WHERE cnpjCliente = ?`, vals);
    },

    async delete(cnpjCliente) {
        await db.query("DELETE FROM Cliente WHERE cnpjCliente = ?", [cnpjCliente]);
    }
};

export default Cliente;