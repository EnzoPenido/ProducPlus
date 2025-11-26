import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import db from '../config/dataBase.js';

const router = express.Router();

// Configuração do Multer
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const { tipo, id, email } = req.body;
        let uploadPath = '';

        // 1. Define o caminho da pasta baseado no tipo
        if (tipo === 'ADMIN') {
            // Pasta: uploads/adms/123
            uploadPath = path.join('uploads', 'adms', id.toString());
        } else {
            // Pasta: uploads/users/joao@email.com
            // (Clientes usam o email como nome da pasta)
            uploadPath = path.join('uploads', 'users', email);
        }

        // 2. LÓGICA DE LIMPEZA (Deletar foto anterior)
        // Se a pasta já existe, apagamos ela inteira e tudo que tem dentro
        if (fs.existsSync(uploadPath)) {
            fs.rmSync(uploadPath, { recursive: true, force: true });
        }

        // 3. Cria a pasta novamente (agora vazia)
        fs.mkdirSync(uploadPath, { recursive: true });

        cb(null, uploadPath);
    },
    filename: (req, file, cb) => {
        // Nome do arquivo: foto-perfil.jpg (podemos manter um nome fixo ou usar timestamp)
        // Usando timestamp para evitar cache do navegador
        const uniqueSuffix = Date.now();
        cb(null, `perfil-${uniqueSuffix}${path.extname(file.originalname)}`);
    }
});

const upload = multer({ storage: storage });

// ROTA DE UPLOAD
router.post('/', upload.single('foto'), async (req, res) => {
    try {
        const { id, tipo, email } = req.body;

        if (!req.file) {
            return res.status(400).json({ message: "Nenhuma imagem enviada." });
        }

        // O caminho relativo para salvar no banco (ex: /uploads/users/email/foto.jpg)
        // Precisamos normalizar as barras para funcionarem em qualquer sistema (Windows/Linux)
        const caminhoRelativo = req.file.path.replace(/\\/g, "/");
        const caminhoParaBanco = `/${caminhoRelativo}`;

        // Atualiza no Banco de Dados
        if (tipo === 'ADMIN') {
            await db.query("UPDATE Admin SET foto_perfil = ? WHERE idAdmin = ?", [caminhoParaBanco, id]);
        } else {
            // Se o ID do cliente for o CNPJ ou outro campo, ajuste aqui
            await db.query("UPDATE Cliente SET foto_perfil = ? WHERE cnpjCliente = ?", [caminhoParaBanco, id]);
        }

        res.json({
            message: "Foto atualizada!",
            url: `http://localhost:3000${caminhoParaBanco}`
        });

    } catch (error) {
        console.error("Erro no upload:", error);
        res.status(500).json({ message: "Erro ao salvar imagem." });
    }
});

export default router;