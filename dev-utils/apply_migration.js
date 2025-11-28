import mysql from 'mysql2/promise';
import fs from 'fs';
import path from 'path';

(async ()=>{
  try{
    const file = process.argv[2];
    if(!file){
      console.error('Usage: node apply_migration.js <path-to-sql>');
      process.exit(1);
    }
    const sql = fs.readFileSync(file,'utf8');
    const connection = await mysql.createConnection({host:'localhost',user:'EnzoPenido',password:'Ozne86420',database:'ProducPlusDB'});
    const statements = sql.split(';').map(s=>s.trim()).filter(s=>s.length);
    for(const stmt of statements){
      console.log('Executing:', stmt);
      await connection.execute(stmt);
    }
    console.log('Migration applied');
    await connection.end();
  }catch(e){
    console.error('Migration error:', e.message);
    process.exit(1);
  }
})();