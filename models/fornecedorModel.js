import db from "../config/dataBase.js";

const Fornecedor = {
    async getAll() {
        const [rows] = await db.query("SELECT * FROM Fornecedor");
        return rows;
    },

    async getByCnpj(cnpjFornecedor) {
        const [rows] = await db.query("SELECT * FROM Fornecedor WHERE cnpjFornecedor = ?", [cnpjFornecedor]);
        return rows[0];
    },

    async create({ cnpjFornecedor, nome, email, telefone, endereco }) {
        await db.query(
            `INSERT INTO Fornecedor (cnpjFornecedor, nome, email, telefone, endereco)
       VALUES (?, ?, ?, ?, ?)`,
            [cnpjFornecedor, nome, email, telefone, endereco]
        );
    },

    async update(cnpjFornecedor, { nome, email, telefone, endereco }) {
        await db.query(
            `UPDATE Fornecedor SET nome = ?, email = ?, telefone = ?, endereco = ? WHERE cnpjFornecedor = ?`,
            [nome, email, telefone, endereco, cnpjFornecedor]
        );
    },

    async delete(cnpjFornecedor) {
        await db.query("DELETE FROM Fornecedor WHERE cnpjFornecedor = ?", [cnpjFornecedor]);
    }
};

export default Fornecedor;