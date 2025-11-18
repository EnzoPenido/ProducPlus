import bcrypt from "bcrypt";
import Cliente from "../models/clienteModel.js";
import { gerarToken } from "../config/jwt.js";

export const registrarCliente = async (req, res) => {
    try {
        const { cnpjCliente, nome, email, senha, telefone, endereco } = req.body;
        if (!cnpjCliente || !nome || !email || !senha || !telefone || !endereco) return res.status(400).json({ message: "Campos obrigatórios ausentes" });

        const existe = await Cliente.getByCnpj(cnpjCliente);
        if (existe) return res.status(409).json({ message: "Cliente já cadastrado" });

        const senhaHash = await bcrypt.hash(senha, 10);
        await Cliente.create({ cnpjCliente, nome, email, senha: senhaHash, telefone, endereco });
        res.status(201).json({ message: "Cliente registrado" });
    } catch (err) {
        // se violação de unique email
        if (err && err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email já cadastrado" });
        res.status(500).json({ error: err.message });
    }
};

export const loginCliente = async (req, res) => {
    try {
        const { cnpjCliente, senha } = req.body;
        if (!cnpjCliente || !senha) return res.status(400).json({ message: "cnpjCliente e senha são obrigatórios" });

        const cliente = await Cliente.getByCnpj(cnpjCliente);
        if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });

        const ok = await bcrypt.compare(senha, cliente.senha);
        if (!ok) return res.status(401).json({ message: "Senha inválida" });

        const token = gerarToken({
            tipo: "CLIENTE",
            cnpjCliente: cliente.cnpjCliente,
            nome: cliente.nome,
            email: cliente.email
        });

        res.json({ message: "Login realizado", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};