require('dotenv').config();
const { log } = require('console');
const express = require('express');
const app = express();
const sql = require('mssql');
const API_KEY = process.env.API_KEY;
app.use(express.json());
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


app.get('/ClientFiltered', async (req,res) =>{
       const {Are, Subd, Phase } = req.query;

        try{
            const pool = await sql.connect(config);
            const result = await pool.request()
            .input('Are', sql.VarChar(30),Are)
            .input('Subd', sql.VarChar(30),Subd)
            .input('Phase',sql.VarChar(30),Phase)
            .execute('H_FilterClient');
            res.json(result.recordset);
        }
            catch (err) {
            console.error(err);
            res.status(500).send('Database Error');
            }
});

app.get('/PrevRead', async (req,res) =>{
        const{WMNo} = req.query;

        try{
            const pool = await sql.connect(config);
            const result = await pool.request()
            .execute('H_tblWMeterDescr');
            res.json(result.recordset);
        }
        catch (err) {
            console.error(err);
            res.status(500).send('Database Error');
        }

});


app.post('/ImportedFromLocalPrevRead',async (req,res)=> {
    const {WMNo,PR_Type,MStat,PrevMRead,PrevDteRead,CurMRead,CurDteRead,CBUsed,DueDte,dteDC,CAmt,RefLine,UserID} = req.body;

    try{
            await sql.connect(config);
            const request = new sql.Request();
            
            request.input('WMNo',sql.VarChar(20),WMNo);
            request.input('PRType',sql.VarChar(20),PR_Type);
            request.input('MStat', sql.VarChar(20),MStat);
            request.input('PrevMRead',sql.BigInt,PrevMRead);
            request.input('PrevDteRead',sql.DateTime,PrevDteRead);
            request.input('CurMRead',sql.BigInt,CurMRead);
            request.input('CurDteRead',sql.DateTime,CurDteRead);
            request.input('CBUsed',sql.BigInt,CBUsed);
            request.input('DueDte',sql.DateTime,DueDte);
            request.input('dteDC',sql.DateTime,dteDC);
            request.input('CAmt',sql.BigInt,CAmt);
            request.input('RefLine',sql.BigInt,RefLine);
            request.input('UserID',sql.VarChar(20),UserID);
            await request.execute('[H_InsertToPrevReadFromLocal]');

               res.status(200).json({ success: true, message: 'Data inserted successfully' });
    }catch(err){
                console.error(err);
                res.status(500).json({ success: false, message: 'Server error', error: err.message });
 
    }


});

app.post('/UpdateStatus', async (req, res) => {
    const { RefLine } = req.body; // ✅ FIXED
    console.log("Received RefLine Updated:", RefLine);

    try {
        const pool = await sql.connect(config);
        const result = await pool.request()
            result.input('RefID', sql.BigInt, RefLine) // Use correct SQL param name
            result.execute('H_UpdateStatusInHistorytbl');

        res.json(result.recordset);
    } catch (err) {
        console.error("Error occurred:", err);
        res.status(500).send('Database Error');
    }
});



app.post('/ActChecker', async (req, res) => {
    const { UserID, MStat } = req.body;
    console.log("Received", user + " " + trans);

    try {
        const pool = await sql.connect(config);

        const result = await pool.request()
            .input('UserID', sql.VarChar(20), user)
            .input('MStat', sql.VarChar(20), trans)
            .execute('H_UserTranChecker');

        res.json(result.recordset);
    } catch (err) {
        console.error("Error occurred", err);
        res.status(500).send('Database Error');
    }
});// checker for transactions



const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

