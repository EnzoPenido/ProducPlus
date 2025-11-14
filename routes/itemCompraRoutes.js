import express from "express";
import {
    listarItens,
    listarItensPorCompra,
    criarItem,
    atualizarItem,
    excluirItem
} from "../controllers/item-Compra-Controller.js";

const router = express.Router();

router.get("/", autenticarJWT, permitirRoles("ADMIN"), listarItens);
router.get("/:idCompra", autenticarJWT, permitirRoles("ADMIN"), listarItensPorCompra);
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarItem);
router.put("/", autenticarJWT, permitirRoles("ADMIN"), atualizarItem);
router.delete("/:idCompra/:idProduto", autenticarJWT, permitirRoles("ADMIN"), excluirItem);

export default router;