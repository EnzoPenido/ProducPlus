import db from "../config/dataBase.js";

const DescricaoProduto = {
    async getByProdutoId(idProduto) {
        const [rows] = await db.query(
            "SELECT * FROM descricaoProduto WHERE idProduto = ?",
            [idProduto]
        );
        return rows[0];
    },

    async create(data) {
        const {
            idProduto, comprimento, largura, altura, peso,
            composicao, acabamento, resistencia, potencia,
            voltagem, frequencia, normaISO, garantia, aprovacao
        } = data;

        await db.query(
            `INSERT INTO descricaoProduto (
                idProduto, comprimento, largura, altura, peso,
                composicao, acabamento, resistencia, potencia,
                voltagem, frequencia, normaISO, garantia, aprovacao
            ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
            [
                idProduto,
                comprimento || null, largura || null,
                altura || null, peso || null,
                composicao || null, acabamento || null,
                resistencia || null, potencia || null,
                voltagem || null, frequencia || null,
                normaISO || null, garantia || null,
                aprovacao || null
            ]
        );
    },

    async update(idProduto, data) {
        const fields = [];
        const vals = [];
        const camposPermitidos = [
            'comprimento', 'largura', 'altura', 'peso',
            'composicao', 'acabamento', 'resistencia',
            'potencia', 'voltagem', 'frequencia',
            'normaISO', 'garantia', 'aprovacao'
        ];

        camposPermitidos.forEach(campo => {
            if (data[campo] !== undefined) {
                fields.push(`${campo} = ?`);
                vals.push(data[campo]);
            }
        });

        if (fields.length === 0) return;
        vals.push(idProduto);

        await db.query(
            `UPDATE descricaoProduto SET ${fields.join(", ")} WHERE idProduto = ?`,
            vals
        );
    },

    async delete(idProduto) {
        await db.query(
            "DELETE FROM descricaoProduto WHERE idProduto = ?",
            [idProduto]
        );
    },

    async exists(idProduto) {
        const [rows] = await db.query(
            "SELECT idProduto FROM descricaoProduto WHERE idProduto = ?",
            [idProduto]
        );
        return rows.length > 0;
    }
};

export default DescricaoProduto;