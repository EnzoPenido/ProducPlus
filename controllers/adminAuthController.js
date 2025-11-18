import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { gerarToken } from "../config/jwt.js";

export const loginAdmin = async (req, res) => {
    try {
        const { username, senha } = req.body;
        if (!username || !senha) return res.status(400).json({ message: "username e senha obrigatórios" });

        const admin = await Admin.getByUsername(username);
        if (!admin) return res.status(404).json({ message: "Admin não encontrado" });

        const ok = await bcrypt.compare(senha, admin.senha);
        if (!ok) return res.status(401).json({ message: "Senha inválida" });

        const token = gerarToken({
            tipo: "ADMIN",
            idAdmin: admin.idAdmin,
            username: admin.username,
            nome: admin.nome,
            email: admin.email
        });

        res.json({ message: "Login admin realizado", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};