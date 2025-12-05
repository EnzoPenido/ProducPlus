import express from "express";
import multer from "multer";
import path from "path";
import fs from "fs";
import {
    listarProdutos,
    buscarProduto,
    criarProduto,
    atualizarProduto,
    excluirProduto,
    baixarEstoque,
    ajustarEstoque,
    buscarDescricaoProduto,
    criarDescricaoProduto,
    atualizarDescricaoProduto,
    excluirDescricaoProduto
} from "../controllers/produtoController.js";
import { autenticarJWT } from "../middlewares/authMiddleware.js";
import { permitirRoles } from "../middlewares/roleMiddleware.js";

const router = express.Router();

// --- CONFIGURAÇÃO DO MULTER PARA PRODUTOS ---
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // Pega o ID da URL (ex: /produtos/7)
        const id = req.params.id;
        const uploadPath = path.join(process.cwd(), 'uploads', 'produtos', id);

        // Cria a pasta se não existir
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true });
        } else {
            // SE A PASTA EXISTIR, APAGA A FOTO ANTIGA (Limpeza)
            // Isso evita acumular lixo no servidor
            const arquivos = fs.readdirSync(uploadPath);
            for (const arquivo of arquivos) {
                fs.unlinkSync(path.join(uploadPath, arquivo));
            }
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        const nomeLimpo = file.originalname.replace(/\s+/g, '-');
        cb(null, `perfil-${uniqueSuffix}-${nomeLimpo}`);
    }
});

const upload = multer({ storage: storage });


// --- ROTAS PÚBLICAS ---
router.get("/", listarProdutos);
router.get("/:id", buscarProduto);
router.get("/:id/descricao", buscarDescricaoProduto);
router.post("/:id/descricao", autenticarJWT, permitirRoles("ADMIN"), criarDescricaoProduto);
router.put("/:id/descricao", autenticarJWT, permitirRoles("ADMIN"), atualizarDescricaoProduto);
router.delete("/:id/descricao", autenticarJWT, permitirRoles("ADMIN"), excluirDescricaoProduto);

// --- ROTA DE COMPRA ---
router.put("/baixa-estoque", autenticarJWT, permitirRoles("CLIENTE", "ADMIN"), baixarEstoque);

// --- ROTAS DE ADMIN ---
router.post("/", autenticarJWT, permitirRoles("ADMIN"), criarProduto);

// ATENÇÃO: Adicionado upload.single('imagem') aqui 👇
router.put("/:id", autenticarJWT, permitirRoles("ADMIN"), upload.single('imagem'), atualizarProduto);

router.delete("/:id", autenticarJWT, permitirRoles("ADMIN"), excluirProduto);
router.patch("/:id/estoque", autenticarJWT, permitirRoles("ADMIN"), ajustarEstoque);

export default router;