const bcrypt = require("bcrypt");
const readline = require("readline");

// Configura a interface de leitura do terminal
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

rl.question("Digite a senha para gerar o hash: ", (password) => {
    if (password) {
        bcrypt.hash(password, 10).then(hash => {
            console.log("\n--- Resultado ---");
            console.log(hash);
            rl.close();
        });
    } else {
        console.error("Erro: A senha não pode ser vazia.");
        rl.close();
    }
});