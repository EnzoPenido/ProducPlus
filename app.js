import express from "express";
import dotenv from "dotenv";
import cors from "cors";
import path from "path";
import { fileURLToPath } from 'url';

// Configuração do ambiente
dotenv.config();

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

const app = express();

// Middlewares Globais
app.use(cors());
app.use(express.json());

// Configuração de Caminhos (Para ES Modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// 2. CONFIGURAÇÃO DA PASTA DE IMAGENS
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// --- DEFINIÇÃO DAS ROTAS ---
app.use("/auth", authRoutes);
app.use("/admin/auth", adminAuthRoutes);
app.use("/admin", adminRoutes);
app.use("/clientes", clienteRoutes);
app.use("/fornecedores", fornecedorRoutes);
app.use("/categorias", categoriaRoutes);
app.use("/produtos", produtoRoutes);
app.use("/compras", compraRoutes);
app.use("/itenscompra", itemCompraRoutes);
app.use('/uploads', express.static(path.join(process.cwd(), 'uploads')));

// Inicia o servidor
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Servidor rodando em: http://localhost:${PORT}`));

export default app;