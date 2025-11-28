import express from "express";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";
import {
    listarCategorias,
    buscarCategoria,
    criarCategoria,
    atualizarCategoria,
    excluirCategoria,
    excluirCategoriaComProdutos
} from "../controllers/categoriaController.js";

const router = express.Router();

router.get("/", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), listarCategorias);
router.get("/:id", autenticarJWT, permitirRoles("ADMIN", "CLIENTE"), buscarCategoria);
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarCategoria);
router.put("/:id", autenticarJWT, permitirRoles("ADMIN"), atualizarCategoria);
router.delete("/:id", autenticarJWT, permitirRoles("ADMIN"), excluirCategoria);
router.delete("/:id/force", autenticarJWT, permitirRoles("ADMIN"), excluirCategoriaComProdutos);

export default router;