import bcrypt from "bcrypt";
import Admin from "../models/adminModel.js";

export const criarAdmin = async (req, res) => {
    try {
        const { username, nome, email, senha } = req.body;
        if (!username || !senha) return res.status(400).json({ message: "username e senha obrigatórios" });
        const senhaHash = await bcrypt.hash(senha, 10);
        const id = await Admin.create({ username, nome, email, senha: senhaHash });
        res.status(201).json({ message: "Admin criado", idAdmin: id });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const listarAdmins = async (req, res) => {
    try { res.json(await Admin.getAll()); } catch (err) { res.status(500).json({ error: err.message }); }
};