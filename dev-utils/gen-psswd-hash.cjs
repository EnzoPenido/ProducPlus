const path = require('path');
const bcrypt = require("bcrypt");
require('dotenv').config({ path: path.resolve(__dirname, '../.env') });

if (process.env.DB_PASSWORD) {
    bcrypt.hash(process.env.DB_PASSWORD, 10).then(console.log);
} else {
    console.error("Erro: A variável DB_PASSWORD não foi carregada do .env!");
}