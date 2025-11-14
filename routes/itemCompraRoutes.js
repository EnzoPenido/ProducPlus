import express from "express";
import {
    listarItens,
    listarItensPorCompra,
    criarItem,
    atualizarItem,
    excluirItem
} from "../controllers/item-Compra-Controller.js";

const router = express.Router();

router.get("/", listarItens);
router.get("/:idCompra", listarItensPorCompra);
router.post("/", criarItem);
router.put("/", atualizarItem);
router.delete("/:idCompra/:idProduto", excluirItem);

export default router;