import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";
import { gerarToken } from "../config/jwt.js";

export const loginAdmin = async (req, res) => {
    try {
        const { email, senha } = req.body;

        if (!email || !senha) {
            return res.status(400).json({ message: "Email e senha são obrigatórios" });
        }

        const admin = await Admin.getByEmail(email);

        if (!admin) {
            return res.status(404).json({ message: "Administrador não encontrado com este e-mail." });
        }

        const senhaValida = await bcrypt.compare(senha, admin.senha);
        if (!senhaValida) {
            return res.status(401).json({ message: "Senha incorreta." });
        }

        const token = gerarToken({
            tipo: "ADMIN",
            idAdmin: admin.idAdmin,
            username: admin.username,
            nome: admin.nome,
            email: admin.email
        });

        const fotoUrl = admin.foto_perfil
            ? `http://localhost:${process.env.PORT || 3000}${admin.foto_perfil}`
            : null;

        res.json({
            message: "Login realizado!",
            token,
            foto: fotoUrl
        });

    } catch (err) {
        console.error("ERRO NO LOGIN ADMIN:", err);
        res.status(500).json({ error: "Erro interno no servidor." });
    }
};