const bcrypt = require("bcrypt");
bcrypt.hash("senhaAdmin123", 10).then(console.log);