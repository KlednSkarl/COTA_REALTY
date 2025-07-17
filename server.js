require('dotenv').config();
const { log } = require('console');
const express = require('express');
const app = express();
const sql = require('mssql');
const API_KEY = process.env.API_KEY;

app.use((req,res,next)=>{
const clientKey = req.headers['x-api-key'];
    console.log('Received x-api-key:', clientKey);
    console.log('Loaded API_KEY:', API_KEY);
if (clientKey!== API_KEY){
 
    return res.status(403).send("Forbidden: API key invalid");
}
next();

});
const config = {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    server: process.env.DB_SERVER,
    port: parseInt(process.env.DB_PORT),
    database: process.env.DB_DATABASE,
    options: {
        encrypt: false,
        trustServerCertificate: true
    }
};

app.get('/tbl', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblPhase');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/tbl', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblPhase');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/Area', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblArea');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});

app.get('/Subd', async (req, res) => {
    try {
        const pool = await sql.connect(config);
        const result = await pool.request().query('SELECT * FROM H_tblSubd');
        res.json(result.recordset);
         
    } catch (err) {
        console.error(err);
        res.status(500).send('Database Error');
    }
});


const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));