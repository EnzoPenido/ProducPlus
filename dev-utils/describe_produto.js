import mysql from 'mysql2/promise';
(async()=>{
  try{
    const c=await mysql.createConnection({host:'localhost',user:'EnzoPenido',password:'Ozne86420',database:'ProducPlusDB'});
    const [rows]=await c.execute('DESCRIBE Produto');
    console.table(rows);
    await c.end();
  }catch(e){
    console.error('Erro:', e.message);
    process.exit(1);
  }
})();