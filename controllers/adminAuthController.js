import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { gerarToken } from "../config/jwt.js";

export const loginAdmin = async (req, res) => {
    try {
        // 1. MUDANÇA: Agora pegamos 'email', não 'username'
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        // 2. MUDANÇA: Buscamos pelo método getByEmail
        // (Certifique-se de ter criado esse método no adminModel.js!)
        const admin = await Admin.getByEmail(email);

        if (!admin) {
            // Esse é o erro 404 que pode estar aparecendo (Admin não encontrado)
            return res.status(404).json({ message: "Admin não encontrado com este email" });
        }

        const ok = await bcrypt.compare(senha, admin.senha);
        if (!ok) {
            return res.status(401).json({ message: "Senha inválida" });
        }

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