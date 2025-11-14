import bcrypt from "bcrypt";
import Cliente from "../models/clienteModel.js";
import { gerarToken } from "../config/jwt.js";

export const registrarCliente = async (req, res) => {
    try {
        const { cnpjCliente, nome, email, senha, telefone, endereco } = req.body;

        // hash da senha
        const senhaHash = await bcrypt.hash(senha, 10);

        await Cliente.create({
            cnpjCliente,
            nome,
            email,
            senha: senhaHash,
            telefone,
            endereco
        });

        res.status(201).json({ message: "Cliente registrado com sucesso" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const loginCliente = async (req, res) => {
    try {
        const { cnpjCliente, senha } = req.body;

        const cliente = await Cliente.getByCnpj(cnpjCliente);
        if (!cliente)
            return res.status(404).json({ message: "Cliente não encontrado" });

        // verificar senha
        const senhaCorreta = await bcrypt.compare(senha, cliente.senha);
        if (!senhaCorreta)
            return res.status(401).json({ message: "Senha inválida" });

        // gerar token
        const token = gerarToken({
            cnpjCliente: cliente.cnpjCliente,
            nome: cliente.nome,
            email: cliente.email
        });

        res.json({ message: "Login realizado", token });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};