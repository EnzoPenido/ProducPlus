import Categoria from "../models/categoriaModel.js";

export const listarCategorias = async (req, res) => {
    try {
        const cats = await Categoria.getAll();
        res.json(cats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const buscarCategoria = async (req, res) => {
    try {
        const cat = await Categoria.getById(req.params.id);
        if (!cat) return res.status(404).json({ message: "Categoria não encontrada" });
        res.json(cat);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const criarCategoria = async (req, res) => {
    try {
        const id = await Categoria.create(req.body);
        res.status(201).json({ message: "Categoria criada", idCategoria: id });
    } catch (err) {   
        res.status(500).json({ error: err.message });
    }
};

export const atualizarCategoria = async (req, res) => {
    try {
        await Categoria.update(req.params.id, req.body);
        res.json({ message: "Categoria atualizada" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};

export const excluirCategoria = async (req, res) => {
    try {
        await Categoria.delete(req.params.id);
        res.json({ message: "Categoria excluída" });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
};