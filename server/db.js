const Pool= require("pg").Pool;

const pool = new Pool({
    user: "postgres",
    password: "abcde",
    host: "localhost",
    port: 5432,
    database: "bibliophile"
});

module.exports= pool;