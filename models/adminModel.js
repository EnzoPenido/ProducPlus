import db from "../config/dataBase.js";

const Admin = {
    async getByEmail(email) {
        const [rows] = await db.query("SELECT * FROM Admin WHERE email = ?", [email]);
        return rows[0];
    },
    async getById(idAdmin) { 
        const [rows] = await db.query("SELECT * FROM Admin WHERE idAdmin = ?", [idAdmin]); 
        return rows[0]; 
    }
};

export default Admin;