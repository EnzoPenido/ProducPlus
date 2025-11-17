import db from "../config/dataBase.js";
const Fornecedor = {
    async getAll() { const [rows] = await db.query("SELECT * FROM Fornecedor"); return rows; },
    async getByCnpj(cnpj) { const [rows] = await db.query("SELECT * FROM Fornecedor WHERE cnpjFornecedor = ?", [cnpj]); return rows[0]; },
    async create(data) { await db.query("INSERT INTO Fornecedor (cnpjFornecedor, nome, email, telefone, endereco) VALUES (?, ?, ?, ?, ?)", [data.cnpjFornecedor, data.nome, data.email, data.telefone, data.endereco]); },
    async update(cnpj, data) { await db.query("UPDATE Fornecedor SET nome=?, email=?, telefone=?, endereco=? WHERE cnpjFornecedor=?", [data.nome, data.email, data.telefone, data.endereco, cnpj]); },
    async delete(cnpj) { await db.query("DELETE FROM Fornecedor WHERE cnpjFornecedor = ?", [cnpj]); }
};
export default Fornecedor;