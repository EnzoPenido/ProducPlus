import db from "../config/dataBase.js";

const Admin = {
    async getAll() { const [rows] = await db.query("SELECT idAdmin, username, nome, email FROM Admin"); return rows; },
    async getById(idAdmin) { const [rows] = await db.query("SELECT * FROM Admin WHERE idAdmin = ?", [idAdmin]); return rows[0]; },
    async getByUsername(username) { const [rows] = await db.query("SELECT * FROM Admin WHERE username = ?", [username]); return rows[0]; },
    async create({ username, nome, email, senha }) {
        const [r] = await db.query("INSERT INTO Admin (username, nome, email, senha) VALUES (?, ?, ?, ?)", [username, nome, email, senha]);
        return r.insertId;
    },
    async update(idAdmin, data) {
        const fields = []; const vals = [];
        ["username", "nome", "email", "senha"].forEach(k => { if (data[k] !== undefined) { fields.push(`${k} = ?`); vals.push(data[k]); } });
        if (!fields.length) return;
        vals.push(idAdmin);
        await db.query(`UPDATE Admin SET ${fields.join(", ")} WHERE idAdmin = ?`, vals);
    },
    async delete(idAdmin) { await db.query("DELETE FROM Admin WHERE idAdmin = ?", [idAdmin]); }
};

export default Admin;