import bcrypt from "bcrypt";
import Cliente from "../models/clienteModel.js";

export const listarClientes = async (req, res) => {
    try { res.json(await Cliente.getAll()); } catch (err) { res.status(500).json({ error: err.message }); }
};

export const buscarCliente = async (req, res) => {
    try {
        const cnpj = req.params.cnpj;
        const cliente = await Cliente.getByCnpj(cnpj);
        if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });

        // se for cliente normal, só permitir ver próprio registro
        if (req.user.tipo !== "ADMIN" && req.user.tipo !== "CLIENTE") return res.status(403).json({ message: "Acesso negado" });
        if (req.user.tipo === "CLIENTE" && req.user.cnpjCliente !== cnpj) return res.status(403).json({ message: "Acesso negado" });

        res.json({ cnpjCliente: cliente.cnpjCliente, nome: cliente.nome, email: cliente.email, telefone: cliente.telefone, endereco: cliente.endereco });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const criarCliente = async (req, res) => {
    // ideal: use /auth/register; esta rota é para admin criar.
    try {
        const { cnpjCliente, nome, email, senha, telefone, endereco } = req.body;
        if (!cnpjCliente || !nome || !email || !senha || !telefone || !endereco) return res.status(400).json({ message: "Campos obrigatórios ausentes" });
        const senhaHash = await bcrypt.hash(senha, 10);
        await Cliente.create({ cnpjCliente, nome, email, senha: senhaHash, telefone, endereco });
        res.status(201).json({ message: "Cliente criado pelo admin" });
    } catch (err) {
        if (err && err.code === "ER_DUP_ENTRY") return res.status(409).json({ message: "Email ou CNPJ já cadastrado" });
        res.status(500).json({ error: err.message });
    }
};

export const atualizarCliente = async (req, res) => {
    try {
        const cnpj = req.params.cnpj;
        if (req.user.tipo !== "ADMIN" && !(req.user.tipo === "CLIENTE" && req.user.cnpjCliente === cnpj)) return res.status(403).json({ message: "Acesso negado" });
        const data = { ...req.body };
        if (data.senha) data.senha = await bcrypt.hash(data.senha, 10);
        await Cliente.update(cnpj, data);
        res.json({ message: "Cliente atualizado" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};

export const excluirCliente = async (req, res) => {
    try {
        if (req.user.tipo !== "ADMIN") return res.status(403).json({ message: "Apenas admin pode excluir" });
        await Cliente.delete(req.params.cnpj);
        res.json({ message: "Cliente excluído" });
    } catch (err) { res.status(500).json({ error: err.message }); }
};