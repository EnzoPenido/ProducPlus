import express from "express";
import {
    listarCategorias,
    buscarCategoria,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria
} from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", listarCategorias);
router.get("/:id", buscarCategoria);
router.post("/", criarCategoria);
router.put("/:id", atualizarCategoria);
router.delete("/:id", excluirCategoria);

export default router;