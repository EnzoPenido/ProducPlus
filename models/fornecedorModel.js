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

    async create({ cnpjFornecedor, nome, email, telefoneFixo, endereco }) {
        await db.query(
            `INSERT INTO Fornecedor (cnpjFornecedor, nome, email, telefoneFixo, endereco)
       VALUES (?, ?, ?, ?, ?)`,
            [cnpjFornecedor, nome, email, telefoneFixo, endereco]
        );
    },

    async update(cnpjFornecedor, { nome, email, telefoneFixo, endereco }) {
        await db.query(
            `UPDATE Fornecedor
       SET nome = ?, email = ?, telefoneFixo = ?, endereco = ?
       WHERE cnpjFornecedor = ?`,
            [nome, email, telefoneFixo, endereco, cnpjFornecedor]
        );
    },

    async delete(cnpjFornecedor) {
        await db.query("DELETE FROM Fornecedor WHERE cnpjFornecedor = ?", [cnpjFornecedor]);
    },
};

export default Fornecedor;