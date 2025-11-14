import Cliente from "../models/clienteModel.js";

export const listarClientes = async (req, res) => {
    try {
        const clientes = await Cliente.getAll();
        res.json(clientes);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarCliente = async (req, res) => {
    try {
        const cliente = await Cliente.getByCnpj(req.params.cnpj);
        if (!cliente) return res.status(404).json({ message: "Cliente não encontrado" });
        res.json(cliente);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarCliente = async (req, res) => {
    try {
        await Cliente.create(req.body);
        res.status(201).json({ message: "Cliente criado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const atualizarCliente = async (req, res) => {
    try {
        await Cliente.update(req.params.cnpj, req.body);
        res.json({ message: "Cliente atualizado" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirCliente = async (req, res) => {
    try {
        await Cliente.delete(req.params.cnpj);
        res.json({ message: "Cliente excluído" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};