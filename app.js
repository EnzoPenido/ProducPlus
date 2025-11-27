import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// --- IMPORTAÇÃO DAS ROTAS ---
import authRoutes from "./routes/authRoutes.js";
import adminAuthRoutes from "./routes/adminAuthRoutes.js";
import adminRoutes from "./routes/adminRoutes.js";
import clienteRoutes from "./routes/clienteRoutes.js";
import fornecedorRoutes from "./routes/fornecedorRoutes.js";
import categoriaRoutes from "./routes/categoriasRoutes.js";
import produtoRoutes from "./routes/produtoRoutes.js";
import compraRoutes from "./routes/compraRoutes.js";
import itemCompraRoutes from "./routes/itemCompraRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";

dotenv.config();

const app = express();

// --- 1. CONFIGURAÇÃO DO CORS E OPTIONS ---
app.use(cors());
app.options(/.*/, cors());

app.use(express.json());

// --- CONFIGURAÇÃO DE CAMINHOS ---
const raizProjeto = process.cwd();

const pastaPublica = path.join(raizProjeto, 'public');
const pastaHtml = path.join(raizProjeto, 'public', 'html');
const pastaUploads = path.join(raizProjeto, 'uploads');

console.log("---------------------------------------------------");
console.log(`🌐 Servindo raiz (Assets): ${pastaPublica}`);
console.log(`📄 Servindo páginas (HTML): ${pastaHtml}`);
console.log(`📂 Servindo imagens:       ${pastaUploads}`);
console.log("---------------------------------------------------");

// --- SERVIR ARQUIVOS ---
app.use(express.static(pastaPublica));
app.use(express.static(pastaHtml));
app.use('/uploads', express.static(pastaUploads));

// --- ROTAS DA API ---
app.use("/auth", authRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin", adminRoutes);
app.use("/clientes", clienteRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/compras", compraRoutes);
app.use("/itenscompra", itemCompraRoutes);
app.use("/upload", uploadRoutes);

// --- ROTA PRINCIPAL (HOME) ---
app.get('/', (req, res) => {
    res.sendFile(path.join(pastaHtml, 'index.html'));
});

// Inicialização
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`🚀 Servidor rodando em: http://localhost:${PORT}`));

export default app;