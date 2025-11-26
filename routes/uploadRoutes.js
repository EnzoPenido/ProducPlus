import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import db from '../config/dataBase.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const UPLOADS_FOLDER = path.join(__dirname, '../uploads');

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        // 1. Logs para Debug (Olhe no seu terminal quando enviar!)
        console.log("--- INICIANDO UPLOAD ---");
        console.log("Dados recebidos:", req.body);

        // Se o body vier vazio, usamos valores padrão para não quebrar
        const tipo = req.body.tipo || 'UNKNOWN';
        const id = req.body.id || 'sem-id';
        const email = req.body.email || 'sem-email';

        let uploadPath = '';

        // Garante a pasta raiz
        if (!fs.existsSync(UPLOADS_FOLDER)) fs.mkdirSync(UPLOADS_FOLDER, { recursive: true });

        if (tipo === 'ADMIN') {
            uploadPath = path.join(UPLOADS_FOLDER, 'adms', id.toString());
        } else {
            uploadPath = path.join(UPLOADS_FOLDER, 'users', email);
        }

        console.log("Tentando salvar em:", uploadPath);

        try {
            // Lógica de limpeza segura
            if (fs.existsSync(uploadPath)) {
                // Em vez de apagar a pasta, vamos apagar os arquivos dentro dela
                const arquivos = fs.readdirSync(uploadPath);
                for (const arquivo of arquivos) {
                    fs.unlinkSync(path.join(uploadPath, arquivo));
                }
            } else {
                fs.mkdirSync(uploadPath, { recursive: true });
            }
        } catch (err) {
            console.error("Erro ao criar/limpar pasta:", err);
            // Se der erro, salva na raiz de uploads para não perder o arquivo
            uploadPath = UPLOADS_FOLDER;
        }

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        const uniqueSuffix = Date.now();
        // Remove espaços do nome do arquivo para evitar bugs em URLs
        const nomeLimpo = file.originalname.replace(/\s+/g, '-');
        cb(null, `perfil-${uniqueSuffix}-${nomeLimpo}`);
    }
});

const upload = multer({ storage: storage });

router.post('/', upload.single('foto'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: "Nenhuma imagem enviada." });

        const { id, tipo } = req.body;

        // Caminho absoluto do arquivo salvo
        const fullPath = req.file.path;

        // Encontra onde começa 'uploads' e normaliza as barras
        const uploadsIndex = fullPath.lastIndexOf('uploads');
        const caminhoRelativo = fullPath.substring(uploadsIndex).replace(/\\/g, "/");
        const caminhoParaBanco = `/${caminhoRelativo}`;

        console.log("Salvando no Banco:", caminhoParaBanco);

        if (tipo === 'ADMIN') {
            await db.query("UPDATE Admin SET foto_perfil = ? WHERE idAdmin = ?", [caminhoParaBanco, id]);
        } else {
            // Verifica se o ID do cliente está chegando corretamente
            await db.query("UPDATE Cliente SET foto_perfil = ? WHERE cnpjCliente = ?", [caminhoParaBanco, id]);
        }

        res.json({ message: "Sucesso", url: `http://localhost:3000${caminhoParaBanco}` });

    } catch (error) {
        console.error("Erro CRÍTICO no upload:", error);
        res.status(500).json({ message: "Erro interno ao salvar." });
    }
});

export default router;